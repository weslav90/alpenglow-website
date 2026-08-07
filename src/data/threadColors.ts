// 100% polyester embroidery machine thread colors available for custom
// orders and customizable ready-made products. Codes/names/hex values are
// taken from the shop's 40-spool thread color chart.

export interface ThreadColor {
	code: string;
	name: string;
	/** Approximate swatch color for on-site preview only — not a color-matching guarantee. */
	hex: string;
}

export const THREAD_COLORS: ThreadColor[] = [
	{ code: "001", name: "White", hex: "#f6f6f6" },
	{ code: "079", name: "Salmon Pink", hex: "#f0cfda" },
	{ code: "323", name: "Light Brown", hex: "#a58d73" },
	{ code: "612", name: "Lilac", hex: "#7c6395" },
	{ code: "005", name: "Silver", hex: "#c9c9c9" },
	{ code: "085", name: "Pink", hex: "#e4b1ce" },
	{ code: "328", name: "Brass", hex: "#c1a147" },
	{ code: "614", name: "Purple", hex: "#553770" },
	{ code: "007", name: "Prussian Blue", hex: "#242666" },
	{ code: "086", name: "Deep Rose", hex: "#d04462" },
	{ code: "339", name: "Clay Brown", hex: "#94522d" },
	{ code: "620", name: "Magenta", hex: "#73437b" },
	{ code: "010", name: "Cream Brown", hex: "#eae7b7" },
	{ code: "107", name: "Dark Fuchsia", hex: "#c1408b" },
	{ code: "405", name: "Blue", hex: "#2e5bb0" },
	{ code: "704", name: "Pewter", hex: "#74707f" },
	{ code: "017", name: "Light Blue", hex: "#aec4e0" },
	{ code: "124", name: "Flesh Pink", hex: "#eed2d6" },
	{ code: "420", name: "Electric Blue", hex: "#335da2" },
	{ code: "707", name: "Dark Gray", hex: "#2b2a30" },
	{ code: "019", name: "Sky Blue", hex: "#2f6a96" },
	{ code: "205", name: "Yellow", hex: "#f7e046" },
	{ code: "502", name: "Mint Green", hex: "#85bb7c" },
	{ code: "800", name: "Red", hex: "#ef181f" },
	{ code: "027", name: "Fresh Green", hex: "#b3bf8b" },
	{ code: "208", name: "Orange", hex: "#dba411" },
	{ code: "507", name: "Emerald Green", hex: "#2d6438" },
	{ code: "810", name: "Light Lilac", hex: "#e393da" },
	{ code: "030", name: "Vermilion", hex: "#eb754c" },
	{ code: "209", name: "Tangerine", hex: "#e16a2f" },
	{ code: "513", name: "Lime Green", hex: "#a6db45" },
	{ code: "843", name: "Beige", hex: "#d4c6ac" },
	{ code: "058", name: "Dark Brown", hex: "#3c2d2e" },
	{ code: "214", name: "Deep Gold", hex: "#cd9f37" },
	{ code: "515", name: "Moss Green", hex: "#5b772a" },
	{ code: "900", name: "Black", hex: "#1a1a1b" },
	{ code: "070", name: "Cornflower Blue", hex: "#949ec7" },
	{ code: "307", name: "Linen", hex: "#f5e8de" },
	{ code: "534", name: "Teal Green", hex: "#33564b" },
	{ code: "1618", name: "Snow White", hex: "#f2f0f1" },
];
