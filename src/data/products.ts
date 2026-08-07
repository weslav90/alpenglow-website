// Products shown on the Shop page.
//
// There are two kinds:
//   * Buy-it-now  — set `paymentLink` to a Stripe Payment Link. The customer
//     gets exactly what the photo shows, at the listed price, in one click.
//   * Made-to-order — set `customOrderHref` to a custom order form instead.
//     These are quoted and invoiced by hand before any stitching starts, so
//     they deliberately do NOT go straight to Stripe checkout.
//
// To add a buy-it-now product: create a Stripe Payment Link for it in the
// Stripe Dashboard (Product catalog -> Add product -> Create payment link),
// then add an entry here with that link as `paymentLink`.

export interface Product {
	name: string;
	price: string; // display string, e.g. "$35"
	description: string;
	image: string; // path under /public
	/** Stripe Payment Link URL. Set this for buy-it-now products. */
	paymentLink?: string;
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
		paymentLink: "https://buy.stripe.com/bJebJ3ecv6TD50ZfQW1B601",
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
];
