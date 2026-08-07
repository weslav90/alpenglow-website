// Embroidery font options customers can choose from for custom orders and
// customizable ready-made products (e.g. the monogrammed cap).
//
// Source: the shop's embroidery machine font library. Images of each
// category live in /public/fonts-guide and are shown on the home page's
// "Browse Our Fonts" section so customers can see what each name looks
// like before picking it from a dropdown.

export interface FontCategory {
	name: string;
	description: string;
	/** Font sample images for this category, shown in the Browse Our Fonts gallery. */
	images: string[];
	fonts: string[];
	/** Fonts in this category that support a second (accent) thread color. */
	twoColorFonts?: string[];
}

export const FONT_CATEGORIES: FontCategory[] = [
	{
		name: "Cursives",
		description: "Flowing, connected script styles — great for names and short words.",
		images: ["/fonts-guide/cursives-1.webp", "/fonts-guide/cursives-2.webp"],
		fonts: [
			"Pacifico",
			"Magnolia",
			"Vacation",
			"English",
			"Airplanes",
			"Cyasoon",
			"Fornever",
			"Darling",
			"FunkyCool",
			"Besides Me",
			"HappyDay",
			"Big Bold",
			"Fenden",
			"Exact Lee",
			"Advanced",
			"Glamor",
		],
	},
	{
		name: "Scripts",
		description: "Block, novelty, and display lettering — bold and easy to read from a distance.",
		images: ["/fonts-guide/scripts-1.webp", "/fonts-guide/scripts-2.webp", "/fonts-guide/scripts-3.webp", "/fonts-guide/scripts-4.webp"],
		fonts: [
			"RIO",
			"Caryonette",
			"AMERICA",
			"GOLD PLATED",
			"Zas Arial",
			"KISS",
			"Garamond",
			"Retro",
			"MUE ATHLETIC",
			"Georgia",
			"A Calling",
			"COLLEGE",
			"FISHTAIL",
			"Cartoon",
			"Jokster",
			"Dallaser",
			"LINES",
			"Cupshoy",
			"Do Not Enter",
			"Dingy",
			"Falling S",
			"JEOPARDY",
			"Colossal",
			"Executive",
			"Basketball",
			"MagicLand",
			"Haunting",
			"It Happens",
			"COWBOY",
			"Buzzlova",
			"Adore",
			"Times New",
			"BILLY KID",
			"Blue plate",
			"Bobbin",
			"Behind",
			"Braggin",
			"Chowder",
			"ANGEL",
			"dark poet",
			"Family",
			"FUNNYMAN",
			"Late Night",
			"Apple Cobbler",
			"Old English",
			"Comic",
			"Dream",
			"Experiment",
			"fisherman",
			"HORSEHAND",
			"Grooves",
			"Animated",
			"Blink",
		],
	},
	{
		name: "Monograms",
		description: "Initials-based layouts for a classic monogrammed look.",
		images: ["/fonts-guide/monograms-1.webp", "/fonts-guide/monograms-2.webp", "/fonts-guide/monograms-3.webp"],
		fonts: [
			"Twilight Fishtail",
			"Twilight Stacked",
			"TwilightVine",
			"Twilight Formal",
			"Twilight Wreath",
			"Twilight Stamp",
			"Twilight Diamond",
			"Twilight Seal",
			"Circle Satin",
			"Empire Satin",
			"Fancy Satin Bean",
			"Fancy Satin Mono",
			"Fish Tail Mono",
			"SSP Heart",
		],
		twoColorFonts: ["Twilight Wreath", "Twilight Seal"],
	},
];
