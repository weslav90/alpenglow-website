// Example pieces shown in the gallery to help customers picture what a
// custom order can look like. Not for sale directly — each links back to
// the custom order form. To add a new example: drop the photo (both .jpg
// and .webp) in /public/gallery and add an entry here.

export interface GalleryItem {
	name: string;
	description: string;
	image: string; // path under /public, no extension — .jpg and .webp both expected
	alt: string;
}

export const galleryItems: GalleryItem[] = [
	{
		name: 'First Day of School Banner',
		description:
			'A keepsake pennant banner with a monogram and ribbon fringe, made for picture day.',
		image: '/gallery/banner-first-day',
		alt: 'Cream canvas pennant banner reading "First Day of School" with an embroidered monogram and red, gold, and navy ribbon fringe',
	},
	{
		name: 'Nursing Program Jacket',
		description:
			'A name and department logo embroidered on a zip jacket for a nursing school cohort.',
		image: '/gallery/jacket-navy',
		alt: 'Navy zip jacket embroidered with a name and a college nursing department logo',
	},
	{
		name: 'Monogrammed Backpack',
		description: 'A classic backpack finished with a custom script monogram and bow.',
		image: '/gallery/backpack-monogram',
		alt: 'Mint green backpack with an embroidered script monogram and bow on the front pocket',
	},
	{
		name: 'Collegiate Soft Shell Jacket',
		description: 'A name and college crest embroidered on a soft shell jacket.',
		image: '/gallery/jacket-grey',
		alt: 'Grey soft shell jacket embroidered with a name and a college crest logo',
	},
	{
		name: 'Stitch Detail',
		description:
			'A closer look at the satin-stitch monogram and bow from the backpack above — the kind of detail every custom piece gets.',
		image: '/gallery/backpack-detail',
		alt: 'Close-up of a satin-stitch script monogram and bow embroidered on fabric',
	},
];
