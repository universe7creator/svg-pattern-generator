module.exports = (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'SVG Pattern Generator',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
};