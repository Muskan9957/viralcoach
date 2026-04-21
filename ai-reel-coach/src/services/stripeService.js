const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICES = {
  STARTER: process.env.STRIPE_PRICE_STARTER, // Set in .env
  PRO    : process.env.STRIPE_PRICE_PRO,     // Set in .env
};

// ─── Create or retrieve a Stripe customer for this user ───────────
const getOrCreateCustomer = async (user) => {
  if (user.stripeCustomerId) return user.stripeCustomerId;

  const customer = await stripe.customers.create({
    email   : user.email,
    name    : user.name || undefined,
    metadata: { userId: user.id },
  });
  return customer.id;
};

// ─── Create a checkout session (redirect user to Stripe hosted page) ─
const createCheckoutSession = async ({ user, plan, successUrl, cancelUrl }) => {
  const priceId = PRICES[plan];
  if (!priceId) throw new Error(`Unknown plan: ${plan}`);

  const customerId = await getOrCreateCustomer(user);

  const session = await stripe.checkout.sessions.create({
    customer          : customerId,
    payment_method_types: ['card'],
    line_items        : [{ price: priceId, quantity: 1 }],
    mode              : 'subscription',
    success_url       : successUrl,
    cancel_url        : cancelUrl,
    metadata          : { userId: user.id, plan },
  });

  return session.url;
};

// ─── Create a billing portal session (manage / cancel subscription) ─
const createPortalSession = async ({ stripeCustomerId, returnUrl }) => {
  const session = await stripe.billingPortal.sessions.create({
    customer  : stripeCustomerId,
    return_url: returnUrl,
  });
  return session.url;
};

// ─── Handle Stripe webhook events ────────────────────────────────
const constructWebhookEvent = (payload, sig) =>
  stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);

module.exports = {
  createCheckoutSession,
  createPortalSession,
  constructWebhookEvent,
};
