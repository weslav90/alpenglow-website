export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  const { amount, description, customerEmail } = await request.json();
  const env = (locals as any).runtime.env;

  const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      "mode": "payment",
      "line_items[0][price_data][currency]": "usd",
      "line_items[0][price_data][unit_amount]": String(Math.round(amount * 100)),
      "line_items[0][price_data][product_data][name]": description,
      "line_items[0][quantity]": "1",
      "customer_email": customerEmail,
      "success_url": "https://alpenglowcrafts.com/order-confirmed",
      "cancel_url": "https://alpenglowcrafts.com/order-canceled",
    }),
  });

  const session = await stripeRes.json();
  return new Response(JSON.stringify(session), {
    headers: { "Content-Type": "application/json" },
  });
};
