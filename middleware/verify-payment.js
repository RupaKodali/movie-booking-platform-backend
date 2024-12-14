const fetch = require('node-fetch');

// Utility function to verify PayPal payment
const verifyPayPalPayment = async (orderId) => {
  try {
    // Get PayPal API token
    // const tokenResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': 'Basic ' + Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString('base64'),
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   },
    //   body: 'grant_type=client_credentials'
    // });

    // const tokenData = await tokenResponse.json();
    // console.log("tokenData",tokenData)
    // const accessToken = tokenData.access_token;

    // Verify payment status using the order ID
    const paymentVerificationResponse = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization':  'Basic ' + Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString('base64'),
        'Content-Type': 'application/json'
      }
    });

    const paymentDetails = await paymentVerificationResponse.json();
    // Return true if payment is completed, else false
    return paymentDetails.status === 'COMPLETED';
  } catch (error) {
    console.log(error)
    console.error('Error verifying PayPal payment:', error);
    throw new Error('Failed to verify payment');
  }
};

module.exports = { verifyPayPalPayment };
