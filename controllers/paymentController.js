const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (shipping_fee, total_amount) => {
  return (shipping_fee + total_amount) * 100;
};

const paymentController = async (req, res) => {
  const { cart, shipping_fee, total_amount, shipping } = req.body;
  const totalOrderAmount = calculateOrderAmount(shipping_fee, total_amount);
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalOrderAmount,
      currency: "MAD",
      description: `${shipping.name} Purchase`,
      shipping,
    });
    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = paymentController;
