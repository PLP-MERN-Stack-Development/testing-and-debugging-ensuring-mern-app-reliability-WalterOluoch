const express = require('express');
const router = express.Router();
const bugController = require('../controllers/bugController');
const { body } = require('express-validator');
const bugValidator = require('../middleware/bugValidator');

// Validation rules
const createBugValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  body('status')
    .optional()
    .isIn(['open', 'in-progress', 'resolved']).withMessage('Status must be open, in-progress, or resolved'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical']).withMessage('Priority must be low, medium, high, or critical'),
  body('reporter')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Reporter name cannot exceed 100 characters')
];

const updateBugValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('description')
    .optional()
    .trim()
    .notEmpty().withMessage('Description cannot be empty')
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  body('status')
    .optional()
    .isIn(['open', 'in-progress', 'resolved']).withMessage('Status must be open, in-progress, or resolved'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical']).withMessage('Priority must be low, medium, high, or critical'),
  body('reporter')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Reporter name cannot exceed 100 characters')
];

// Routes
router.get('/', bugController.getAllBugs);
router.get('/:id', bugController.getBugById);
router.post('/', createBugValidation, bugController.createBug);
router.put('/:id', updateBugValidation, bugController.updateBug);
router.delete('/:id', bugController.deleteBug);

module.exports = router;
