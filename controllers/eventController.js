const asyncHandler = require('express-async-handler');
const Event = require('../models/Event');
const { deleteFiles, getRelativePath } = require('../utils/fileHelper');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({}).sort({ createdAt: -1 });
  res.json({
    success: true,
    count: events.length,
    data: events,
  });
});

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  
  res.json({
    success: true,
    data: event,
  });
});

// @desc    Create event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  
  if (!title || !description) {
    res.status(400);
    throw new Error('Please provide title and description');
  }
  
  // Get main photo from multer
  const mainPhoto = req.file ? req.file.path : null;
  if (!mainPhoto) {
    res.status(400);
    throw new Error('Main photo is required');
  }
  
  // Get photos array
  const photos = req.files ? req.files.map(file => file.path) : [];
  
  const event = await Event.create({
    title,
    description,
    main_photo: mainPhoto,
    photos,
  });
  
  res.status(201).json({
    success: true,
    data: event,
  });
});

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  
  const { title, description } = req.body;
  
  // Update text fields
  if (title) event.title = title;
  if (description) event.description = description;
  
  // Handle main photo update
  if (req.file) {
    // Delete old main photo
    await deleteFiles([event.main_photo]);
    event.main_photo = req.file.path;
  }
  
  // Handle photos array update (if new photos uploaded, replace all)
  if (req.files && req.files.length > 0) {
    // Delete old photos
    await deleteFiles(event.photos);
    event.photos = req.files.map(file => file.path);
  }
  
  const updatedEvent = await event.save();
  
  res.json({
    success: true,
    data: updatedEvent,
  });
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  
  // Delete all associated images
  const allImages = [event.main_photo, ...event.photos];
  await deleteFiles(allImages);
  
  await event.deleteOne();
  
  res.json({
    success: true,
    message: 'Event deleted successfully',
  });
});

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};