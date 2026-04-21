const asyncHandler = require('express-async-handler');
const Story = require('../models/Story');
const { deleteFiles } = require('../utils/fileHelper');

// @desc    Get all stories
// @route   GET /api/stories
// @access  Public
const getStories = asyncHandler(async (req, res) => {
  const stories = await Story.find({}).sort({ createdAt: -1 });
  res.json({
    success: true,
    count: stories.length,
    data: stories,
  });
});

// @desc    Get single story
// @route   GET /api/stories/:id
// @access  Public
const getStoryById = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id);
  
  if (!story) {
    res.status(404);
    throw new Error('Story not found');
  }
  
  res.json({
    success: true,
    data: story,
  });
});

// @desc    Create story
// @route   POST /api/stories
// @access  Private/Admin
const createStory = asyncHandler(async (req, res) => {
  const { title, name, epigram, story } = req.body;
  
  if (!title || !name || !epigram || !story) {
    res.status(400);
    throw new Error('Please provide title, name, epigram, and story');
  }
  
  const photos = req.files ? req.files.map(file => file.path) : [];
  
  if (photos.length !== 3) {
    res.status(400);
    throw new Error('Exactly 3 images are required for story carousel');
  }
  
  const newStory = await Story.create({
    title,
    name,
    epigram,
    story,
    photos,
  });
  
  res.status(201).json({
    success: true,
    data: newStory,
  });
});

// @desc    Update story
// @route   PUT /api/stories/:id
// @access  Private/Admin
const updateStory = asyncHandler(async (req, res) => {
  const storyDoc = await Story.findById(req.params.id);
  
  if (!storyDoc) {
    res.status(404);
    throw new Error('Story not found');
  }
  
  const { title, name, epigram, story } = req.body;
  
  if (title) storyDoc.title = title;
  if (name) storyDoc.name = name;
  if (epigram) storyDoc.epigram = epigram;
  if (story) storyDoc.story = story;
  
  // Handle photos update (if new photos uploaded, replace all)
  if (req.files && req.files.length > 0) {
    if (req.files.length !== 3) {
      res.status(400);
      throw new Error('Exactly 3 images are required for story carousel');
    }
    await deleteFiles(storyDoc.photos);
    storyDoc.photos = req.files.map(file => file.path);
  }
  
  const updatedStory = await storyDoc.save();
  
  res.json({
    success: true,
    data: updatedStory,
  });
});

// @desc    Delete story
// @route   DELETE /api/stories/:id
// @access  Private/Admin
const deleteStory = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id);
  
  if (!story) {
    res.status(404);
    throw new Error('Story not found');
  }
  
  await deleteFiles(story.photos);
  
  await story.deleteOne();
  
  res.json({
    success: true,
    message: 'Story deleted successfully',
  });
});

module.exports = {
  getStories,
  getStoryById,
  createStory,
  updateStory,
  deleteStory,
};