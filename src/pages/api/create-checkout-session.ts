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
	products.filter((product): product is typeof product & { priceId: string } => Boolean(product.priceId)).map(
		(product) => product.priceId,
	),
);

// Mirrors the per-item cap Stripe itself applies to Payment Links; keeps a
// malformed or abusive request from asking Stripe to price out something
// absurd before it's rejected.
const MAX_QUANTITY_PER_ITEM = 20;

interface CartLineInput {
	priceId?: unknown;
	quantity?: unknown;
}

function jsonResponse(body: unknown, status: number): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
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
	for (const item of rawItems) {
		if (typeof item.priceId !== 'string' || !knownPriceIds.has(item.priceId)) {
			return jsonResponse({ error: 'Cart contains an unrecognized item.' }, 400);
		}
		const quantity = Math.floor(Number(item.quantity));
		if (!Number.isFinite(quantity) || quantity < 1 || quantity > MAX_QUANTITY_PER_ITEM) {
			return jsonResponse({ error: 'Invalid item quantity.' }, 400);
		}
		lineItems.push({ price: item.priceId, quantity });
	}

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
