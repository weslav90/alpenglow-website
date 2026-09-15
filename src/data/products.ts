// Products shown on the Shop page (split there into "Ready to Order" and
// "Custom Embroidery" sections, based on which fields below are set).
//
// There are two kinds:
//   * Buy-it-now  — set `priceId` to a single Stripe Price ID, or `variants`
//     when the customer must choose between a few priced options (e.g. size).
//     The customer adds it to a cart (src/lib/cart.ts) and can check out
//     several products at once through one Stripe Checkout Session
//     (src/pages/api/create-checkout-session.ts).
//   * Made-to-order — set `customOrderHref` to a custom order form instead.
//     These are quoted and invoiced by hand before any stitching starts, so
//     they deliberately do NOT go straight to Stripe checkout.
//
// To add a single-price buy-it-now product: create the product and its
// Price in the Stripe Dashboard (Product catalog -> Add product), then add
// an entry here with that Price's ID (starts with "price_") as `priceId`.
// For a product with multiple priced options, create one Price per option
// and list them under `variants` instead (see "Name Tags" below). Either
// way, the checkout endpoint only accepts price IDs that appear in this
// file, so a product added here without a real Stripe Price ID will fail at
// checkout, not at build time.

export interface ProductVariant {
	/** Shown in the option picker, e.g. "Name Only – Small". */
	label: string;
	/** Display string, e.g. "$3". */
	price: string;
	/** Stripe Price ID (starts with "price_") for this specific variant. */
	priceId: string;
}

export interface Product {
	name: string;
	price: string; // display string, e.g. "$35", or a range like "$3–$5" for variant products
	description: string;
	image: string; // path under /public
	/** Stripe Price ID (starts with "price_"). Set this for a single-price buy-it-now product. */
	priceId?: string;
	/** Set this instead of `priceId` when the customer must choose between multiple priced options. */
	variants?: ProductVariant[];
	/** Custom order form path. Set this for made-to-order products. */
	customOrderHref?: string;
	/** Overrides the call-to-action label. Defaults per product kind. */
	ctaLabel?: string;
}

export const products: Product[] = [
	{
		name: "Eagles Embroidered Baseball Cap",
		price: "$35",
		description:
			"Exactly as pictured — royal blue EAGLES lettering embroidered on a white cotton cap with a matching blue brim. Ready to order, no customization needed.",
		image: "/embroidered-cap.jpg",
		priceId: "price_1U0uVIPwLggDTH96robxT2uz",
	},
	{
		name: "Embroidered Socks",
		price: "$10",
		description:
			"Soft white crew socks embroidered with a name and your choice of icon — personalize both at checkout.",
		image: "/embroidered-socks.jpg",
		priceId: "price_1UAqA5PwLggDTH961vScvdkb",
	},
	{
		name: "Name Tags",
		price: "$3–$5",
		description:
			"Iron-on name tags for backpacks, lunch boxes, coats, and gear. Choose name only, or add a phone number for extra peace of mind.",
		image: "/nametags.jpg",
		variants: [
			{ label: "Name Only – Small", price: "$3", priceId: "price_1UC7rpPwLggDTH96n5QZ2AJk" },
			{ label: "Name Only – Large", price: "$4", priceId: "price_1UFuUyPwLggDTH96t2jkmX85" },
			{ label: "Name & Phone Number – Large", price: "$5", priceId: "price_1UC7s4PwLggDTH96t6sNhMU7" },
		],
	},
	{
		name: "Custom Embroidered Baseball Cap",
		price: "Custom quote",
		description:
			"The same quality cap, stitched with your words. Choose your font and thread color, tell us what you'd like embroidered, and we'll send you a quote before we start.",
		image: "/blank-cap.jpg",
		customOrderHref: "/custom-hat",
		ctaLabel: "Design Yours",
	},
	{
		name: "Custom Monogrammed Backpack",
		price: "Custom quote",
		description:
			"A backpack finished with your own script monogram (and a bow, if you'd like one). Choose your font and thread color, tell us your initials, and we'll send you a quote before we start.",
		image: "/gallery/backpack-monogram.jpg",
		customOrderHref: "/custom-backpack",
		ctaLabel: "Design Yours",
	},
	{
		name: "Custom Embroidered Banner",
		price: "Custom quote",
		description:
			"A keepsake pennant banner embroidered with your own text — perfect for a first day of school, birthday, or milestone moment. Choose your font, thread color, and ribbon fringe.",
		image: "/gallery/banner-first-day.jpg",
		customOrderHref: "/custom-banner",
		ctaLabel: "Design Yours",
	},
	{
		name: "Custom Embroidered Shirts, Jackets & More",
		price: "Custom quote",
		description:
			"Send us your own shirt, jacket, or other item to embroider — or tell us what you'd like and we can help source it too. Choose your font and thread color, tell us what you'd like stitched, and we'll send you a quote before we start.",
		image: "/gallery/jacket-navy.jpg",
		customOrderHref: "/custom-apparel",
		ctaLabel: "Design Yours",
	},
];
