// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Alpenglow Crafting Company';
export const SITE_DESCRIPTION = 'Custom embroidery inspired by the radiant warmth of mountain alpenglow.';

// Listed prices are for local pickup. Shipping isn't offered at checkout, but can be arranged
// by custom quote through the Custom Order form or email. These strings are shared by the
// header bar, footer, shop, cart, contact, and order-confirmation pages and the Stripe Checkout
// page, so the wording stays identical everywhere it appears.
export const PICKUP_CITY = 'Colorado Springs, CO';
export const SHIPPING_QUOTE_HREF = '/contact';
// Social profiles, linked from the footer. Both handles are alpenglowcrafts.
export const INSTAGRAM_URL = 'https://www.instagram.com/alpenglowcrafts/';
export const FACEBOOK_URL = 'https://www.facebook.com/alpenglowcrafts';

export const PICKUP_SHORT = `Prices are for local pickup in ${PICKUP_CITY}. Shipping available by custom quote.`;

// Display-only. The amount actually charged comes from the manual Stripe Tax Rates listed in
// STRIPE_TAX_RATE_IDS (wrangler.json). Keep this in sync if a rate changes:
// state 2.90% + El Paso County 1.23% + PPRTA 1.00% + City of Colorado Springs 3.07% = 8.20%.
export const SALES_TAX_DISPLAY = '8.20%';

// Christmas stockings: customers drop off their own stockings and pick them up finished.
// Shown in the Shop page's Christmas section and the stocking product card.
export const STOCKING_DROPOFF_DEADLINE = 'December 18, 2026';
export const STOCKING_TURNAROUND = '3–5 days';
export const STOCKING_HANDOFF_AREA = 'near Powers & N. Carefree in Colorado Springs';

// Marketing-email consent: an optional checkbox, unchecked by default, on every form that
// collects an email (the custom-order forms and the cart). Recorded as marketing_opt_in
// (Yes/No) in Web3Forms order emails, and as marketing_opt_in (yes/no) metadata on the Stripe
// Checkout Session and its payment. Only customers marked yes should get marketing emails.
export const MARKETING_OPT_IN_LABEL =
	'Yes, send me occasional emails about new designs and seasonal offers. Unsubscribe anytime.';
