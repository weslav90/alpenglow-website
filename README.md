# Alpenglow Crafting Company

The website for **Alpenglow Crafting Company** — custom embroidery, artisan sewing, and
handcrafted goods, built with [Astro](https://astro.build) and deployed on
[Cloudflare Workers](https://developers.cloudflare.com/workers/static-assets/).

## 🚀 Project Structure

- `src/pages/` — site routes: `index.astro` (home), `shop.astro` (ready-made products),
  `about.astro` (our story), `contact.astro` (custom order form).
- `src/components/` — shared Astro components (header, footer, stitch divider, etc.).
- `src/data/products.ts` — ready-made products shown on the Shop page, each linked to a
  Stripe Payment Link.
- `public/` — static assets (images, fonts, favicon).

The contact/custom-order form submits via [Web3Forms](https://web3forms.com).

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
