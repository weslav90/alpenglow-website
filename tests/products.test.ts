// Catalog integrity tests for src/data/products.ts.
// The checkout endpoint trusts this file as its price allow-list, so a typo here
// is a broken or wrong checkout in production. These tests catch it at build time.
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { products, type Product } from "../src/data/products";
import {
	STOCKING_DROPOFF_DEADLINE,
	STOCKING_TURNAROUND,
	STOCKING_HANDOFF_AREA,
} from "../src/consts";

const PRICE_ID = /^price_[A-Za-z0-9]{10,}$/;
const DOLLARS = /^\$(\d+)$/;
// Keep in sync with NOTE_MAX_LENGTH in src/pages/api/create-checkout-session.ts.
const NOTE_MAX_LENGTH = Number(
	readFileSync(resolve("src/pages/api/create-checkout-session.ts"), "utf8").match(
		/const NOTE_MAX_LENGTH = (\d+);/,
	)![1],
);

const buyItNow = products.filter((p) => p.priceId || p.variants);
const allPriceIds = products.flatMap((p) => [
	...(p.priceId ? [p.priceId] : []),
	...(p.variants?.map((v) => v.priceId) ?? []),
]);

describe("catalog shape", () => {
	it("has products", () => {
		expect(products.length).toBeGreaterThan(0);
	});

	it.each(products.map((p) => [p.name, p] as const))("%s is exactly one kind", (_n, p) => {
		const kinds = [!!p.priceId, !!p.variants?.length, !!p.customOrderHref].filter(Boolean);
		expect(kinds).toHaveLength(1);
	});

	it("product names are unique", () => {
		expect(new Set(products.map((p) => p.name)).size).toBe(products.length);
	});

	it.each(products.map((p) => [p.name, p] as const))("%s image exists in public/", (_n, p) => {
		expect(existsSync(resolve("public", p.image.replace(/^\//, "")))).toBe(true);
	});
});

describe("Stripe Price IDs", () => {
	it("every Price ID is well-formed", () => {
		for (const id of allPriceIds) expect(id, id).toMatch(PRICE_ID);
	});

	it("no Price ID is used twice", () => {
		expect(new Set(allPriceIds).size).toBe(allPriceIds.length);
	});

	it.each(buyItNow.map((p) => [p.name, p] as const))("%s display price matches its options", (_n, p) => {
		if (p.priceId) {
			expect(p.price).toMatch(DOLLARS);
			return;
		}
		const amounts = p.variants!.map((v) => {
			expect(v.price, `${p.name} / ${v.label}`).toMatch(DOLLARS);
			return Number(v.price.slice(1));
		});
		const lo = Math.min(...amounts);
		const hi = Math.max(...amounts);
		expect(p.price).toBe(lo === hi ? `$${lo}` : `$${lo}–$${hi}`);
	});

	it("variant labels are unique within a product", () => {
		for (const p of products.filter((x) => x.variants)) {
			const labels = p.variants!.map((v) => v.label);
			expect(new Set(labels).size, p.name).toBe(labels.length);
		}
	});
});

describe("personalization fields", () => {
	const withFields = products.filter((p) => p.personalization?.length);

	it.each(withFields.map((p) => [p.name, p] as const))("%s fields are valid", (_n, p) => {
		const fields = p.personalization!;
		expect(new Set(fields.map((f) => f.key)).size).toBe(fields.length);
		for (const f of fields) {
			expect(f.label.trim(), `${p.name}.${f.key} label`).not.toBe("");
			if (f.type === "select") {
				expect(f.options?.length, `${p.name}.${f.key} options`).toBeGreaterThan(0);
				const values = f.options!.map((o) => o.value);
				expect(new Set(values).size, `${p.name}.${f.key} duplicate option`).toBe(values.length);
			} else {
				expect(f.options, `${p.name}.${f.key} has options but is ${f.type}`).toBeUndefined();
				if (f.maxLength !== undefined) expect(f.maxLength).toBeGreaterThan(0);
			}
			for (const id of f.showForVariants ?? []) {
				expect(p.variants?.map((v) => v.priceId), `${p.name}.${f.key} showForVariants`).toContain(id);
			}
			if (f.showWhen) {
				const target = fields.find((x) => x.key === f.showWhen!.key);
				expect(target, `${p.name}.${f.key} showWhen key`).toBeDefined();
				expect(target!.options?.map((o) => o.value), `${p.name}.${f.key} showWhen value`).toContain(
					f.showWhen.equals,
				);
			}
		}
	});

	// The cart note is "Label: value; Label: value". If the longest possible note exceeds
	// NOTE_MAX_LENGTH, the end of the customer's personalization is cut off before Stripe.
	it.each(withFields.map((p) => [p.name, p] as const))("%s longest note fits NOTE_MAX_LENGTH", (_n, p) => {
		const parts = p.personalization!.map((f) => {
			const longest =
				f.type === "select" ? Math.max(...f.options!.map((o) => o.value.length)) : (f.maxLength ?? 60);
			return f.label.length + 2 + longest;
		});
		const total = parts.reduce((a, b) => a + b, 0) + 2 * (parts.length - 1);
		expect(total).toBeLessThanOrEqual(NOTE_MAX_LENGTH);
	});
});

describe("Christmas stockings", () => {
	const stocking = products.find((p) => p.section === "christmas") as Product;

	it("is in the Christmas section", () => {
		expect(stocking?.name).toBe("Custom Embroidered Christmas Stockings");
	});

	it("sells a set of 2 for $10 and a set of 4 for $16", () => {
		expect(stocking.variants?.map((v) => [v.label, v.price])).toEqual([
			["Set of 2", "$10"],
			["Set of 4", "$16"],
		]);
	});

	it("asks for font, thread color and names", () => {
		expect(stocking.personalization?.map((f) => [f.key, f.type])).toEqual([
			["font", "select"],
			["thread_color", "select"],
			["notes", "textarea"],
		]);
		expect(stocking.personalization?.find((f) => f.key === "notes")?.maxLength).toBe(250);
	});

	it("drop-off details are set", () => {
		expect(Number.isNaN(Date.parse(STOCKING_DROPOFF_DEADLINE))).toBe(false);
		expect(STOCKING_TURNAROUND).toMatch(/\d/);
		expect(STOCKING_HANDOFF_AREA).toContain("Colorado Springs");
	});
});

describe("sales tax config", () => {
	it("wrangler.json lists four well-formed Stripe Tax Rate IDs", () => {
		const cfg = JSON.parse(readFileSync(resolve("wrangler.json"), "utf8"));
		const ids = String(cfg.vars.STRIPE_TAX_RATE_IDS).split(",").map((s) => s.trim());
		expect(ids).toHaveLength(4);
		for (const id of ids) expect(id).toMatch(/^txr_[A-Za-z0-9]+$/);
	});
});
