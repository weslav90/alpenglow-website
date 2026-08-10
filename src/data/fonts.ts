// Embroidery font options customers can choose from for custom orders and
// customizable ready-made products (e.g. the monogrammed cap).
//
// Source: the shop's embroidery machine font library. Trimmed down (Aug 2026)
// from the original, much longer list after customer feedback that it was
// too long to browse comfortably.
//
// Category images (in /public/fonts-guide) are shown on the home page's
// "Browse Our Fonts" section so customers can see what a whole category
// looks like at once. Each individual font also has its own small sample
// image (in /public/fonts-guide/samples) shown next to the Font Style
// dropdown when it's selected, the same way a thread color's swatch shows
// up next to the Thread Color dropdown.

export interface FontOption {
	name: string;
	/** Small sample image shown next to the dropdown when this font is selected. */
	image: string;
}

export interface FontCategory {
	name: string;
	description: string;
	/** Font sample images for this category, shown in the Browse Our Fonts gallery. */
	images: string[];
	fonts: FontOption[];
	/** Fonts in this category that support a second (accent) thread color. */
	twoColorFonts?: string[];
}

export const FONT_CATEGORIES: FontCategory[] = [
	{
		name: "Cursives",
		description: "Flowing, connected script styles — great for names and short words.",
		images: ["/fonts-guide/cursives-1.webp"],
		fonts: [
			{ name: "Magnolia", image: "/fonts-guide/samples/magnolia.webp" },
			{ name: "Vacation", image: "/fonts-guide/samples/vacation.webp" },
			{ name: "English", image: "/fonts-guide/samples/english.webp" },
			{ name: "Cyasoon", image: "/fonts-guide/samples/cyasoon.webp" },
			{ name: "Besides Me", image: "/fonts-guide/samples/besides-me.webp" },
			{ name: "FunkyCool", image: "/fonts-guide/samples/funkycool.webp" },
			{ name: "English II", image: "/fonts-guide/samples/english-ii.webp" },
			{ name: "HappyDay", image: "/fonts-guide/samples/happyday.webp" },
			{ name: "Big Bold", image: "/fonts-guide/samples/big-bold.webp" },
			{ name: "Glamor", image: "/fonts-guide/samples/glamor.webp" },
		],
	},
	{
		name: "Scripts",
		description: "Block, novelty, and display lettering — bold and easy to read from a distance.",
		images: ["/fonts-guide/scripts-1.webp", "/fonts-guide/scripts-2.webp", "/fonts-guide/scripts-3.webp"],
		fonts: [
			{ name: "RIO", image: "/fonts-guide/samples/rio.webp" },
			{ name: "AMERICA", image: "/fonts-guide/samples/america.webp" },
			{ name: "GOLD PLATED", image: "/fonts-guide/samples/gold-plated.webp" },
			{ name: "KISS", image: "/fonts-guide/samples/kiss.webp" },
			{ name: "Retro", image: "/fonts-guide/samples/retro.webp" },
			{ name: "MUE ATHLETIC", image: "/fonts-guide/samples/mue-athletic.webp" },
			{ name: "COLLEGE", image: "/fonts-guide/samples/college.webp" },
			{ name: "A Calling", image: "/fonts-guide/samples/a-calling.webp" },
			{ name: "Cartoon", image: "/fonts-guide/samples/cartoon.webp" },
			{ name: "FISHTAIL", image: "/fonts-guide/samples/fishtail.webp" },
			{ name: "Jokster", image: "/fonts-guide/samples/jokster.webp" },
			{ name: "LINES", image: "/fonts-guide/samples/lines.webp" },
			{ name: "Dingy", image: "/fonts-guide/samples/dingy.webp" },
			{ name: "Falling S", image: "/fonts-guide/samples/falling-s.webp" },
			{ name: "JEOPARDY", image: "/fonts-guide/samples/jeopardy.webp" },
			{ name: "Executive", image: "/fonts-guide/samples/executive.webp" },
			{ name: "MagicLand", image: "/fonts-guide/samples/magicland.webp" },
			{ name: "COWBOY", image: "/fonts-guide/samples/cowboy.webp" },
			{ name: "Buzzlova", image: "/fonts-guide/samples/buzzlova.webp" },
			{ name: "Times New", image: "/fonts-guide/samples/times-new.webp" },
			{ name: "Blue plate", image: "/fonts-guide/samples/blue-plate.webp" },
			{ name: "Bobbin", image: "/fonts-guide/samples/bobbin.webp" },
			{ name: "Behind", image: "/fonts-guide/samples/behind.webp" },
			{ name: "Chowder", image: "/fonts-guide/samples/chowder.webp" },
			{ name: "ANGEL", image: "/fonts-guide/samples/angel.webp" },
			{ name: "FUNNYMAN", image: "/fonts-guide/samples/funnyman.webp" },
			{ name: "Late Night", image: "/fonts-guide/samples/late-night.webp" },
			{ name: "Apple Cobbler", image: "/fonts-guide/samples/apple-cobbler.webp" },
			{ name: "Old English", image: "/fonts-guide/samples/old-english.webp" },
			{ name: "Experiment", image: "/fonts-guide/samples/experiment.webp" },
			{ name: "Animated", image: "/fonts-guide/samples/animated.webp" },
			{ name: "Blink", image: "/fonts-guide/samples/blink.webp" },
		],
	},
	{
		name: "Monograms",
		description: "Initials-based layouts for a classic monogrammed look.",
		images: ["/fonts-guide/monograms-1.webp", "/fonts-guide/monograms-2.webp"],
		fonts: [
			{ name: "Twilight Fishtail", image: "/fonts-guide/samples/twilight-fishtail.webp" },
			{ name: "Twilight Stacked", image: "/fonts-guide/samples/twilight-stacked.webp" },
			{ name: "TwilightVine", image: "/fonts-guide/samples/twilightvine.webp" },
			{ name: "Twilight Formal", image: "/fonts-guide/samples/twilight-formal.webp" },
			{ name: "Twilight Wreath", image: "/fonts-guide/samples/twilight-wreath.webp" },
			{ name: "Twilight Stamp", image: "/fonts-guide/samples/twilight-stamp.webp" },
			{ name: "Twilight Diamond", image: "/fonts-guide/samples/twilight-diamond.webp" },
			{ name: "Twilight Seal", image: "/fonts-guide/samples/twilight-seal.webp" },
			{ name: "Circle Satin", image: "/fonts-guide/samples/circle-satin.webp" },
			{ name: "Empire Satin", image: "/fonts-guide/samples/empire-satin.webp" },
			{ name: "Fancy Satin Bean", image: "/fonts-guide/samples/fancy-satin-bean.webp" },
			{ name: "Fish Tail Mono", image: "/fonts-guide/samples/fish-tail-mono.webp" },
			{ name: "SSP Heart", image: "/fonts-guide/samples/ssp-heart.webp" },
		],
		twoColorFonts: ["Twilight Wreath", "Twilight Seal"],
	},
];
