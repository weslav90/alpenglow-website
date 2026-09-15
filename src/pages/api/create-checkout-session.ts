import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { products } from '../../data/products';

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
const NOTE_MAX_LENGTH = 200;
const DESCRIPTION_MAX_LENGTH = 500;

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

	let body: { items?: CartLineInput[] };
	try {
		body = await request.json();
	} catch {
		return jsonResponse({ error: 'Invalid request body.' }, 400);
	}

	const rawItems = Array.isArray(body.items) ? body.items : [];
	if (rawItems.length === 0) {
		return jsonResponse({ error: 'Cart is empty.' }, 400);
	}

	const lineItems: { price: string; quantity: number }[] = [];
	const orderNotes: string[] = [];
	for (const item of rawItems) {
		if (typeof item.priceId !== 'string' || !knownPriceIds.has(item.priceId)) {
			return jsonResponse({ error: 'Cart contains an unrecognized item.' }, 400);
		}
		const quantity = Math.floor(Number(item.quantity));
		if (!Number.isFinite(quantity) || quantity < 1 || quantity > MAX_QUANTITY_PER_ITEM) {
			return jsonResponse({ error: 'Invalid item quantity.' }, 400);
		}
		lineItems.push({ price: item.priceId, quantity });

		const note = sanitizeNote(item.note);
		if (note) {
			orderNotes.push(`${productLabelForPriceId(item.priceId)}: ${note}`);
		}
	}
	const personalization = orderNotes.length > 0 ? orderNotes.join(' | ').slice(0, DESCRIPTION_MAX_LENGTH) : undefined;

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
			// Personalization notes aren't shown to the customer here — they typed them on the
			// shop page already. This is purely so the order is fulfillable: it shows up on the
			// payment in the Stripe Dashboard (and in the "successful payment" notification, if
			// that's mapped in) instead of the order having no record of what to embroider.
			...(personalization && {
				payment_intent_data: { description: personalization },
				metadata: { personalization },
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
