// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Alpenglow Crafting Company';
export const SITE_DESCRIPTION = 'Custom embroidery inspired by the radiant warmth of mountain alpenglow.';

// Every order — buy-it-now or custom — is picked up locally. Nothing ships. These strings are
// shared by the header bar, footer, shop, cart, contact, and order-confirmation pages and the
// Stripe Checkout page, so the wording stays identical everywhere it appears.
export const PICKUP_CITY = 'Colorado Springs, CO';
export const PICKUP_SHORT = `Local pickup only in ${PICKUP_CITY} — we don't ship.`;

// Display-only. The amount actually charged comes from the manual Stripe Tax Rates listed in
// STRIPE_TAX_RATE_IDS (wrangler.json). Keep this in sync if a rate changes:
// state 2.90% + El Paso County 1.23% + PPRTA 1.00% + City of Colorado Springs 3.07% = 8.20%.
export const SALES_TAX_DISPLAY = '8.20%';