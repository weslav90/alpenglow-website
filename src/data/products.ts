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
		paymentLink: "https://buy.stripe.com/bJebJ3ecv6TD50ZfQW1B601",
	},
	{
		name: "Embroidered Socks",
		price: "$10",
		description:
			"Soft white crew socks embroidered with a name and your choice of icon — personalize both at checkout.",
		image: "/embroidered-socks.jpg",
		paymentLink: "https://buy.stripe.com/cNi7sN1pJ1zj3WVbAG1B604",
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
		paymentLink: "https://buy.stripe.com/dRmaEZfgz7XH653eMS1B605",
		category: "halloween",
	},
	{
		name: "Halloween Basket with Jack-o'-Lantern",
		price: "$15",
		description: "A gingham trick-or-treat basket embroidered with a classic jack-o'-lantern face.",
		image: "/halloween-basket-jack-o-lantern.jpg",
		paymentLink: "https://buy.stripe.com/cNi14p7O7em579734a1B606",
		category: "halloween",
	},
	{
		name: "Halloween Basket with Name",
		price: "$20",
		description:
			"A black-and-white gingham trick-or-treat basket embroidered with the name of your choice.",
		image: "/halloween-basket-monogram.jpg",
		paymentLink: "https://buy.stripe.com/5kQcN75FZdi1bpnawC1B607",
		category: "halloween",
	},
];
