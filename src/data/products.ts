// Products shown on the Shop page.
//
// There are two kinds:
//   * Buy-it-now  — set `priceId` to a Stripe Price ID. The customer adds it
//     to a cart (src/lib/cart.ts) and can check out several products at once
//     through one Stripe Checkout Session (src/pages/api/create-checkout-session.ts).
//   * Made-to-order — set `customOrderHref` to a custom order form instead.
//     These are quoted and invoiced by hand before any stitching starts, so
//     they deliberately do NOT go straight to Stripe checkout.
//
// To add a buy-it-now product: create the product and its Price in the
// Stripe Dashboard (Product catalog -> Add product), then add an entry here
// with that Price's ID (starts with "price_") as `priceId`. The checkout
// endpoint only accepts price IDs that appear in this file, so a product
// added here without a real Stripe Price ID will fail at checkout, not at
// build time.

export interface Product {
	name: string;
	price: string; // display string, e.g. "$35"
	description: string;
	image: string; // path under /public
	/** Stripe Price ID (starts with "price_"). Set this for buy-it-now products. */
	priceId?: string;
	/** Custom order form path. Set this for made-to-order products. */
	customOrderHref?: string;
	/** Overrides the call-to-action label. Defaults per product kind. */
	ctaLabel?: string;
	/** Set to "halloween" to show this product in the seasonal Halloween section instead of the main grid. */
	category?: "halloween";
}

export const products: Product[] = [
	{
		name: "Eagles Embroidered Baseball Cap",
		price: "$35",
		description:
			"Exactly as pictured — royal blue EAGLES lettering embroidered on a white cotton cap with a matching blue brim. Ready to order, no customization needed.",
		image: "/embroidered-cap.jpg",
		priceId: "price_REPLACE_WITH_EAGLES_CAP_PRICE_ID",
	},
	{
		name: "Embroidered Socks",
		price: "$10",
		description:
			"Soft white crew socks embroidered with a name and your choice of icon — personalize both at checkout.",
		image: "/embroidered-socks.jpg",
		priceId: "price_REPLACE_WITH_SOCKS_PRICE_ID",
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
		name: "Halloween Basket with Pumpkin and Name",
		price: "$25",
		description:
			"A gingham trick-or-treat basket with an appliqué pumpkin, embroidered with the name of your choice.",
		image: "/halloween-basket-pumpkin-name.jpg",
		priceId: "price_REPLACE_WITH_PUMPKIN_BASKET_PRICE_ID",
		category: "halloween",
	},
	{
		name: "Halloween Basket with Jack-o'-Lantern",
		price: "$15",
		description: "A gingham trick-or-treat basket embroidered with a classic jack-o'-lantern face.",
		image: "/halloween-basket-jack-o-lantern.jpg",
		priceId: "price_REPLACE_WITH_JACKOLANTERN_BASKET_PRICE_ID",
		category: "halloween",
	},
	{
		name: "Halloween Basket with Name",
		price: "$20",
		description:
			"A black-and-white gingham trick-or-treat basket embroidered with the name of your choice.",
		image: "/halloween-basket-monogram.jpg",
		priceId: "price_REPLACE_WITH_NAME_BASKET_PRICE_ID",
		category: "halloween",
	},
];
