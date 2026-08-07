// Ready-made (non-custom) products shown on the Shop page.
// To add a product: create a Stripe Payment Link for it in the Stripe
// Dashboard (Product catalog -> Add product -> Create payment link),
// then add an entry here with that link as `paymentLink`.

export interface Product {
	name: string;
	price: string; // display string, e.g. "$28"
	description: string;
	image: string; // path under /public
	paymentLink: string; // Stripe Payment Link URL
	/**
	 * Set true for made-to-order products where the customer picks a font
	 * and thread color before buying (see FontThreadFields.astro). The pick
	 * is attached to the Stripe purchase via the `client_reference_id` URL
	 * parameter so it shows up on the payment in the Stripe Dashboard.
	 */
	customizable?: boolean;
}

export const products: Product[] = [
	{
		name: "Embroidered Baseball Cap",
		price: "$35",
		description:
			"A classic cotton cap with your choice of monogram or design, stitched to order.",
		image: "/embroidered-cap.jpg",
		paymentLink: "https://buy.stripe.com/bJebJ3ecv6TD50ZfQW1B601",
		customizable: true,
	},
];
