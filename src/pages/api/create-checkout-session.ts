import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { products } from '../../data/products';
import { PICKUP_CITY } from '../../consts';

// Runs on the Cloudflare Worker per-request rather than at build time —
// required for any route that needs a runtime secret or talks to Stripe.
export const prerender = false;

// The cart in the browser is not trusted: a customer's request body could
// name any Price ID and any quantity. This allow-list is built from the
// same product catalog the Shop page renders, so a line item can only be
// checked out at the price and identity Stripe (via that Price object)
// already has on file for it — the request never sets an amount.
const knownPriceIds = new Set(
	products.flatMap((product) => [
		...(product.priceId ? [product.priceId] : []),
		...(product.variants?.map((variant) => variant.priceId) ?? []),
	]),
);

// Mirrors the per-item cap Stripe itself applies to Payment Links; keeps a
// malformed or abusive request from asking Stripe to price out something
// absurd before it's rejected.
const MAX_QUANTITY_PER_ITEM = 20;

// Stripe's `line_items` don't carry custom text when using an existing Price
// (only `price_data` line items can, and switching to that would mean
// re-deriving the amount ourselves instead of trusting the Price object).
// So personalization notes are collected per line but sent up to Stripe as
// one combined string on the session/PaymentIntent instead of per-item.
//
// NOTE_MAX_LENGTH is per cart line and has to fit the longest note a product card can produce
// (the Christmas stockings: font + thread color + a 250-character notes box).
// DESCRIPTION_MAX_LENGTH is Stripe's limit on a PaymentIntent description; METADATA_VALUE_MAX
// is Stripe's limit on a single metadata value, so a long combined note is split across
// `personalization`, `personalization_2`, ... rather than cut off at 500 characters.
const NOTE_MAX_LENGTH = 400;
const DESCRIPTION_MAX_LENGTH = 1000;
const METADATA_VALUE_MAX = 500;
const METADATA_MAX_CHUNKS = 8;

// Sales tax: every order is picked up in Colorado Springs, so every sale is sourced there and
// carries the same set of manual Stripe Tax Rates (state, El Paso County, PPRTA, and City of
// Colorado Springs). Their IDs live in the STRIPE_TAX_RATE_IDS variable (wrangler.json for
// production; .dev.vars locally, with test-mode IDs) as a comma-separated list. Keeping the
// rates separate rather than one combined 8.20% rate means Stripe's tax report splits the
// collected tax the same way the two returns do: state, county and PPRTA go on the Colorado
// DOR return; the city rate goes on the City of Colorado Springs return.
const TAX_RATE_ID_PATTERN = /^txr_[A-Za-z0-9]+$/;

function parseTaxRateIds(raw: string | undefined): string[] | null {
	const ids = (raw ?? '')
		.split(',')
		.map((id) => id.trim())
		.filter(Boolean);
	if (ids.length === 0 || !ids.every((id) => TAX_RATE_ID_PATTERN.test(id))) return null;
	return ids;
}

const PICKUP_MESSAGE = `This order is for local pickup in ${PICKUP_CITY}. We'll email you when it's ready to arrange a pickup time. Need it shipped instead? Don't pay here — request a shipping quote at alpenglowcrafts.com/contact.`;

function personalizationMetadata(text: string): Record<string, string> {
	const metadata: Record<string, string> = {};
	for (let i = 0; i < METADATA_MAX_CHUNKS && i * METADATA_VALUE_MAX < text.length; i++) {
		const key = i === 0 ? 'personalization' : `personalization_${i + 1}`;
		metadata[key] = text.slice(i * METADATA_VALUE_MAX, (i + 1) * METADATA_VALUE_MAX);
	}
	return metadata;
}

interface CartLineInput {
	priceId?: unknown;
	quantity?: unknown;
	note?: unknown;
}

function jsonResponse(body: unknown, status: number): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

/** Human-readable label for a line item, e.g. "Name Tags (Name & Phone Number – Large)". */
function productLabelForPriceId(priceId: string): string {
	for (const product of products) {
		if (product.priceId === priceId) return product.name;
		const variant = product.variants?.find((v) => v.priceId === priceId);
		if (variant) return `${product.name} (${variant.label})`;
	}
	return priceId;
}

// The note is free text a customer typed into a shop-page field, not
// something with a fixed shape — clean it up before it goes into a Stripe
// API call (control characters can't ride along in a string field anyway,
// and stripping them defensively costs nothing).
function sanitizeNote(value: unknown): string | undefined {
	if (typeof value !== 'string') return undefined;
	const cleaned = value.replace(/[\x00-\x1F\x7F]/g, ' ').replace(/\s+/g, ' ').trim();
	return cleaned ? cleaned.slice(0, NOTE_MAX_LENGTH) : undefined;
}

export const POST: APIRoute = async ({ request, locals }) => {
	const secretKey = locals.runtime.env.STRIPE_SECRET_KEY;
	if (!secretKey) {
		// Missing in this environment (e.g. STRIPE_SECRET_KEY not set via
		// `wrangler secret put` in production, or missing from .dev.vars locally).
		console.error('STRIPE_SECRET_KEY is not configured for this environment');
		return jsonResponse({ error: 'Checkout is not configured.' }, 500);
	}

	// Fail closed: selling without the tax rates attached would under-collect sales tax that is
	// still owed to the state and city, so checkout refuses to start instead.
	const taxRateIds = parseTaxRateIds(locals.runtime.env.STRIPE_TAX_RATE_IDS);
	if (!taxRateIds) {
		console.error('STRIPE_TAX_RATE_IDS is missing or malformed for this environment');
		return jsonResponse({ error: 'Checkout is not configured.' }, 500);
	}

	let body: { items?: CartLineInput[]; pickupAcknowledged?: unknown };
	try {
		body = await request.json();
	} catch {
		return jsonResponse({ error: 'Invalid request body.' }, 400);
	}

	if (body.pickupAcknowledged !== true) {
		return jsonResponse({ error: `Please confirm you'll pick up this order in ${PICKUP_CITY}.` }, 400);
	}

	const rawItems = Array.isArray(body.items) ? body.items : [];
	if (rawItems.length === 0) {
		return jsonResponse({ error: 'Cart is empty.' }, 400);
	}

	const lineItems: { price: string; quantity: number; tax_rates: string[] }[] = [];
	const orderNotes: string[] = [];
	for (const item of rawItems) {
		if (typeof item.priceId !== 'string' || !knownPriceIds.has(item.priceId)) {
			return jsonResponse({ error: 'Cart contains an unrecognized item.' }, 400);
		}
		const quantity = Math.floor(Number(item.quantity));
		if (!Number.isFinite(quantity) || quantity < 1 || quantity > MAX_QUANTITY_PER_ITEM) {
			return jsonResponse({ error: 'Invalid item quantity.' }, 400);
		}
		lineItems.push({ price: item.priceId, quantity, tax_rates: taxRateIds });

		const note = sanitizeNote(item.note);
		if (note) {
			orderNotes.push(`${productLabelForPriceId(item.priceId)}: ${note}`);
		}
	}
	const personalization = orderNotes.length > 0 ? orderNotes.join(' | ') : undefined;

	const stripe = new Stripe(secretKey, {
		// stripe-node defaults to Node's `https` module for requests, which
		// Cloudflare Workers doesn't provide even with nodejs_compat enabled.
		// The fetch-based client is the officially supported way to run
		// stripe-node on Workers (and other fetch-only runtimes).
		httpClient: Stripe.createFetchHttpClient(),
	});

	const origin = new URL(request.url).origin;

	try {
		const session = await stripe.checkout.sessions.create({
			mode: 'payment',
			line_items: lineItems,
			success_url: `${origin}/cart/success`,
			cancel_url: `${origin}/cart`,
			// Shown just above the Pay button on Stripe's page, so the pickup-only terms are the
			// last thing the customer reads before paying. No shipping address is collected; shipped
			// orders are quoted and invoiced by hand instead of going through this checkout.
			custom_text: { submit: { message: PICKUP_MESSAGE } },
			// Personalization notes aren't shown to the customer here — they typed them on the
			// shop page already. This is purely so the order is fulfillable: it shows up on the
			// payment in the Stripe Dashboard (and in the "successful payment" notification, if
			// that's mapped in) instead of the order having no record of what to embroider.
			metadata: {
				fulfillment: 'local_pickup',
				...(personalization && personalizationMetadata(personalization)),
			},
			...(personalization && {
				payment_intent_data: { description: personalization.slice(0, DESCRIPTION_MAX_LENGTH) },
			}),
		});

		if (!session.url) {
			throw new Error('Stripe did not return a Checkout Session URL');
		}

		return jsonResponse({ url: session.url }, 200);
	} catch (error) {
		console.error('Failed to create Stripe Checkout Session', error);
		return jsonResponse({ error: 'Could not start checkout. Please try again.' }, 502);
	}
};
