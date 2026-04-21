const Razorpay = require('razorpay');
const crypto   = require('crypto');

// ─── Lazy init — no crash when keys aren't set yet ───────────────
const getRzp = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return null;
  return new Razorpay({
    key_id    : process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

const isConfigured = () =>
  !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

// ─── Plan IDs (set in .env after creating plans in Razorpay dashboard) ──
const PLAN_IDS = {
  PRO   : process.env.RAZORPAY_PLAN_PRO,
  STUDIO: process.env.RAZORPAY_PLAN_STUDIO,
};

// ─── Create a subscription ────────────────────────────────────────
// Returns the full Razorpay subscription object (id needed by frontend)
const createSubscription = async ({ user, plan }) => {
  const rzp    = getRzp();
  if (!rzp) throw new Error('Razorpay not configured — add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env');

  const planId = PLAN_IDS[plan];
  if (!planId) throw new Error(`Razorpay plan ID missing for "${plan}" — add RAZORPAY_PLAN_${plan} to .env`);

  const subscription = await rzp.subscriptions.create({
    plan_id        : planId,
    customer_notify: 1,
    total_count    : 12,   // 12 billing cycles
    notes          : {
      userId: String(user.id),
      plan,
      email : user.email,
    },
  });

  return subscription;
};

// ─── Verify payment signature (called after checkout modal closes) ─
// Razorpay signs: razorpay_payment_id + '|' + razorpay_subscription_id
const verifyPaymentSignature = ({ paymentId, subscriptionId, signature }) => {
  const body        = `${paymentId}|${subscriptionId}`;
  const expected    = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');
  return expected === signature;
};

// ─── Verify webhook signature ─────────────────────────────────────
const verifyWebhookSignature = (rawBody, signature) => {
  if (!process.env.RAZORPAY_WEBHOOK_SECRET) return false;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');
  return expected === signature;
};

module.exports = {
  isConfigured,
  createSubscription,
  verifyPaymentSignature,
  verifyWebhookSignature,
};
