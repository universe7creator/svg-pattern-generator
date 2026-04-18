module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const event = req.body;

  // Log webhook for debugging
  console.log('Webhook received:', JSON.stringify(event, null, 2));

  // Handle LemonSqueezy webhooks
  if (event && event.meta && event.meta.event_name) {
    const eventName = event.meta.event_name;

    switch (eventName) {
      case 'order_created':
      case 'order_refunded':
        // Handle order events
        console.log(`Order event: ${eventName}`);
        break;

      case 'subscription_created':
      case 'subscription_cancelled':
        // Handle subscription events
        console.log(`Subscription event: ${eventName}`);
        break;

      default:
        console.log(`Unhandled event: ${eventName}`);
    }

    return res.status(200).json({
      success: true,
      message: `Webhook ${eventName} processed`
    });
  }

  // Handle test webhooks
  return res.status(200).json({
    success: true,
    message: 'Webhook received',
    timestamp: new Date().toISOString()
  });
};