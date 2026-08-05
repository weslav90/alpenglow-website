export async function onRequestPost(context) {
  const { request, env } = context;
  const { amount, description, customerEmail } = await request.json();

  const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      "mode": "payment",
      "line_items[0][price_data][currency]": "usd",
      "line_items[0][price_data][unit_amount]": Math.round(amount * 100), // cents
      "line_items[0][price_data][product_data][name]": description,
      "line_items[0][quantity]": "1",
      "customer_email": customerEmail,
      "success_url": "https://alpenglowcrafts.com/order-confirmed",
      "cancel_url": "https://alpenglowcrafts.com/order-canceled",
    }),
  });

  const session = await stripeRes.json();
  return Response.json({ url: session.url });
}
