// Marketing-email consent must be offered, optional, and recorded on every form that collects
// an email. These checks catch a new order form that forgets the checkbox or its "No" fallback.
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const pagesDir = resolve("src/pages");
const web3formsPages = readdirSync(pagesDir)
	.filter((f) => f.endsWith(".astro"))
	.map((f) => ({ file: f, source: readFileSync(resolve(pagesDir, f), "utf8") }))
	.filter((p) => p.source.includes("api.web3forms.com/submit"));

describe("marketing opt-in", () => {
	it("finds the order forms", () => {
		expect(web3formsPages.length).toBeGreaterThan(0);
	});

	for (const { file, source } of web3formsPages) {
		it(`${file} offers the checkbox and records an explicit No`, () => {
			expect(source).toContain("<MarketingOptIn ");
			expect(source).toContain(
				"formData.set('marketing_opt_in', formData.has('marketing_opt_in') ? 'Yes' : 'No');",
			);
		});
	}

	it("the checkbox is unchecked by default and not required", () => {
		const component = readFileSync(resolve("src/components/MarketingOptIn.astro"), "utf8");
		const input = component.match(/<input[^>]*>/)![0];
		expect(input).not.toMatch(/\bchecked\b/);
		expect(input).not.toMatch(/\brequired\b/);
	});

	it("checkout records consent only on an explicit true", () => {
		const endpoint = readFileSync(resolve("src/pages/api/create-checkout-session.ts"), "utf8");
		expect(endpoint).toContain("body.marketingOptIn === true ? 'yes' : 'no'");
		expect(endpoint).toContain("marketing_opt_in: marketingOptIn");
	});
});
