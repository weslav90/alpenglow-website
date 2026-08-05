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
}

export const products: Product[] = [
	{
		name: "Embroidered Baseball Cap",
		price: "$35",
		description:
			"A classic cotton cap with your choice of monogram or design, stitched to order.",
		image: "/blog-placeholder-1.jpg",
		paymentLink: "https://buy.stripe.com/bJebJ3ecv6TD50ZfQW1B601", 
	},
	{
		name: "Monogrammed Tote Bag",
		price: "$34",
		description:
			"Durable canvas tote with a hand-finished monogram — perfect for school, gifts, or everyday carry.",
		image: "/blog-placeholder-2.jpg",
		paymentLink: "#", // TODO: replace with your Stripe Payment Link
	},
	{
		name: "Custom Patch",
		price: "$14",
		description:
			"A small embroidered patch for backpacks, jackets, or team gear.",
		image: "/blog-placeholder-3.jpg",
		paymentLink: "#", // TODO: replace with your Stripe Payment Link
	},
];
