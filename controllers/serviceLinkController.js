const asyncHandler = require('express-async-handler');
const ServiceLink = require('../models/ServiceLink');

// @desc    Get service link
// @route   GET /api/service-link
// @access  Public
const getServiceLink = asyncHandler(async (req, res) => {
  const serviceLink = await ServiceLink.getSingleton();
  res.json({
    success: true,
    data: serviceLink,
  });
});

// @desc    Update service link
// @route   PUT /api/service-link
// @access  Private/Admin
const updateServiceLink = asyncHandler(async (req, res) => {
  const { link } = req.body;
  
  if (!link) {
    res.status(400);
    throw new Error('Please provide a service link');
  }
  
  const serviceLink = await ServiceLink.getSingleton();
  serviceLink.link = link;
  serviceLink.updatedAt = Date.now();
  
  await serviceLink.save();
  
  res.json({
    success: true,
    data: serviceLink,
  });
});

module.exports = {
  getServiceLink,
  updateServiceLink,
};