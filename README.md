# Alpenglow Crafting Company

The website for **Alpenglow Crafting Company** — custom embroidery, built with
[Astro](https://astro.build) and deployed on
[Cloudflare Workers](https://developers.cloudflare.com/workers/static-assets/).

## 🚀 Project Structure

- `src/pages/` — site routes: `index.astro` (home), `shop.astro` (ready-made products),
  `about.astro` (our story), `contact.astro` (custom order form), `cart.astro` (shopping cart),
  `cart/success.astro` (post-checkout confirmation).
- `src/pages/api/create-checkout-session.ts` — server endpoint that creates a Stripe Checkout
  Session from the cart's contents. Runs on-demand on the Cloudflare Worker (`prerender = false`),
  not at build time.
- `src/components/` — shared Astro components (header, footer, stitch divider, etc.).
- `src/lib/cart.ts` — client-side cart (localStorage-backed), shared by the Shop page, header
  badge, and cart page.
- `src/data/products.ts` — ready-made products shown on the Shop page, each linked to a
  Stripe Price ID.
- `public/` — static assets (images, fonts, favicon).

The contact/custom-order form submits via [Web3Forms](https://web3forms.com).

## 🛒 Shopping cart & checkout

Customers add one or more ready-made products to a cart (stored in the browser's localStorage)
and check out once, through a single Stripe Checkout Session covering every item — rather than
being sent to a separate Stripe payment page per product.

This requires a Stripe secret key at runtime:

- Local development: copy `.dev.vars.example` to `.dev.vars` and fill in a test-mode secret key.
- Production: `npx wrangler secret put STRIPE_SECRET_KEY`.

Each buy-it-now entry in `src/data/products.ts` needs a real Stripe Price ID (`priceId`, from
the Stripe Dashboard's Product catalog) — the checkout endpoint rejects any price ID it doesn't
recognize from that file.

Adding the checkout endpoint made this the site's first on-demand (server-rendered) route. The
installed version of `@astrojs/cloudflare` (12.6.12) reacts to that by auto-enabling Astro's
session feature, which auto-provisions an unused Cloudflare KV namespace named `SESSION` on
deploy. The site itself doesn't use Astro sessions or that KV namespace for anything. A later
adapter version adds a `session: false` option to opt out of this; upgrading `@astrojs/cloudflare`
is a separate, breaking change from this feature and was left out of scope here.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                           | Action                                           |
| :-------------------------------- | :----------------------------------------------- |
| `npm install`                     | Installs dependencies                            |
| `npm run dev`                     | Starts local dev server at `localhost:4321`      |
| `npm run build`                   | Build your production site to `./dist/`          |
| `npm run preview`                 | Preview your build locally, before deploying     |
| `npm run astro ...`               | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help`         | Get help using the Astro CLI                     |
| `npm run build && npm run deploy` | Deploy your production site to Cloudflare        |
| `npm wrangler tail`               | View real-time logs for all Workers              |

## 👀 Want to learn more?

Check out [Astro's documentation](https://docs.astro.build) or the
[Cloudflare Workers docs](https://developers.cloudflare.com/workers/) for the deployment platform.

## Credit

This site started from the [Astro + Cloudflare blog starter template](https://github.com/cloudflare/templates/tree/main/astro-blog-starter-template),
which itself is based on the lovely [Bear Blog](https://github.com/HermanMartinus/bearblog/).
