// Client-side shopping cart, backed by localStorage.
//
// There is no server-side cart: the browser is the source of truth for what
// a customer has selected, and /api/create-checkout-session.ts re-validates
// every price ID and quantity against src/data/products.ts before it ever
// talks to Stripe. Nothing here should be trusted for pricing on its own.

export interface CartItem {
	/** Stripe Price ID — see the `priceId` field on Product in src/data/products.ts. */
	priceId: string;
	name: string;
	/** Display string, e.g. "$35" — matches Product.price. Used for the on-page subtotal only. */
	price: string;
	image: string;
	quantity: number;
}

const STORAGE_KEY = "alpenglow_cart";

/** Dispatched on `window` after any cart change, in this tab, so the header badge and cart page can react. */
export const CART_EVENT = "cart:change";

function readCart(): CartItem[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		// Private browsing, disabled storage, or corrupted JSON — treat as an empty cart
		// rather than throwing, since nothing here is critical enough to break the page.
		return [];
	}
}

function writeCart(items: CartItem[]): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
	} catch {
		// Storage may be unavailable (private browsing, quota, disabled). The in-memory
		// change still happened for this page load; it just won't persist or sync.
	}
	window.dispatchEvent(new CustomEvent(CART_EVENT));
}

export function getCart(): CartItem[] {
	return readCart();
}

export function cartCount(): number {
	return readCart().reduce((total, item) => total + item.quantity, 0);
}

export function addItem(item: Omit<CartItem, "quantity">, quantity = 1): void {
	const items = readCart();
	const existing = items.find((i) => i.priceId === item.priceId);
	if (existing) {
		existing.quantity += quantity;
	} else {
		items.push({ ...item, quantity });
	}
	writeCart(items);
}

export function setQuantity(priceId: string, quantity: number): void {
	const items = readCart();
	if (quantity <= 0) {
		writeCart(items.filter((i) => i.priceId !== priceId));
		return;
	}
	const existing = items.find((i) => i.priceId === priceId);
	if (existing) {
		existing.quantity = quantity;
		writeCart(items);
	}
}

export function removeItem(priceId: string): void {
	writeCart(readCart().filter((i) => i.priceId !== priceId));
}

export function clearCart(): void {
	writeCart([]);
}

/** Parses a display price like "$35" into 35. Returns 0 for anything that doesn't contain a number. */
export function parsePrice(display: string): number {
	const match = display.replace(/,/g, "").match(/[\d.]+/);
	return match ? parseFloat(match[0]) : 0;
}
