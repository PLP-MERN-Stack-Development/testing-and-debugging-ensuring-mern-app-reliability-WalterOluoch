const Bug = require('../models/Bug');
const { validationResult } = require('express-validator');

// Get all bugs
exports.getAllBugs = async (req, res, next) => {
  try {
    console.log('Fetching all bugs...');
    const bugs = await Bug.find().sort({ createdAt: -1 });
    console.log(`Found ${bugs.length} bugs`);
    res.json({
      success: true,
      count: bugs.length,
      data: bugs
    });
  } catch (error) {
    console.error('Error fetching bugs:', error);
    next(error);
  }
};

// Get single bug by ID
exports.getBugById = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`Fetching bug with ID: ${id}`);
    
    const bug = await Bug.findById(id);
    
    if (!bug) {
      console.log(`Bug not found with ID: ${id}`);
      return res.status(404).json({
        success: false,
        error: { message: 'Bug not found', status: 404 }
      });
    }
    
    console.log('Bug found:', bug);
    res.json({
      success: true,
      data: bug
    });
  } catch (error) {
    console.error('Error fetching bug:', error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid bug ID format', status: 400 }
      });
    }
    
    next(error);
  }
};

// Create new bug
exports.createBug = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          status: 400,
          errors: errors.array()
        }
      });
    }
    
    console.log('Creating new bug with data:', req.body);
    const bug = await Bug.create(req.body);
    console.log('Bug created successfully:', bug);
    
    res.status(201).json({
      success: true,
      data: bug
    });
  } catch (error) {
    console.error('Error creating bug:', error);
    next(error);
  }
};

// Update bug
exports.updateBug = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`Updating bug with ID: ${id}`);
    console.log('Update data:', req.body);
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          status: 400,
          errors: errors.array()
        }
      });
    }
    
    const bug = await Bug.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!bug) {
      console.log(`Bug not found with ID: ${id}`);
      return res.status(404).json({
        success: false,
        error: { message: 'Bug not found', status: 404 }
      });
    }
    
    console.log('Bug updated successfully:', bug);
    res.json({
      success: true,
      data: bug
    });
  } catch (error) {
    console.error('Error updating bug:', error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid bug ID format', status: 400 }
      });
    }
    
    next(error);
  }
};

// Delete bug
exports.deleteBug = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`Deleting bug with ID: ${id}`);
    
    const bug = await Bug.findByIdAndDelete(id);
    
    if (!bug) {
      console.log(`Bug not found with ID: ${id}`);
      return res.status(404).json({
        success: false,
        error: { message: 'Bug not found', status: 404 }
      });
    }
    
    console.log('Bug deleted successfully:', bug);
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting bug:', error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid bug ID format', status: 400 }
      });
    }
    
    next(error);
  }
};
