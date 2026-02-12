const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');

exports.createPaymentIntent = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'garage_owner') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    if (user.garageProfile?.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Payment already completed' });
    }
    let customerId = user.garageProfile?.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user._id.toString() }
      });
      customerId = customer.id;
      await User.findByIdAndUpdate(user._id, {
        'garageProfile.stripeCustomerId': customerId
      });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(process.env.STRIPE_REGISTRATION_PRICE) || 5000,
      currency: 'usd',
      customer: customerId,
      metadata: { userId: user._id.toString(), type: 'garage_registration' }
    });
    res.json({ clientSecret: paymentIntent.client_secret, amount: paymentIntent.amount });
  } catch (error) {
    console.error('Create PaymentIntent error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      const userId = paymentIntent.metadata.userId;
      await User.findByIdAndUpdate(userId, {
        'garageProfile.paymentStatus': 'paid',
        'garageProfile.subscriptionExpiry': new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      });
      console.log(`✅ Payment succeeded for user ${userId}`);
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      const failedUserId = failedPayment.metadata.userId;
      await User.findByIdAndUpdate(failedUserId, {
        'garageProfile.paymentStatus': 'failed'
      });
      console.log(`❌ Payment failed for user ${failedUserId}`);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  res.json({ received: true });
};

exports.getPaymentStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('garageProfile.paymentStatus');
    res.json({ paymentStatus: user.garageProfile?.paymentStatus || 'pending' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};