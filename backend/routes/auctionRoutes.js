const express = require('express');
const { body } = require('express-validator');
const {
  getAllAuctions,
  getAuctionById,
  createAuction,
  updateAuction,
  deleteAuction
} = require('../controllers/auctionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules for auction creation/update
const auctionValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('image')
    .isURL()
    .withMessage('Please provide a valid image URL'),
  body('startTime')
    .isISO8601()
    .withMessage('Please provide a valid start time'),
  body('endTime')
    .isISO8601()
    .withMessage('Please provide a valid end time'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .isIn([
      'electronics', 
      'furniture', 
      'clothing', 
      'books', 
      'collectibles', 
      'art', 
      'jewelry', 
      'vehicles', 
      'sports',
      'other'
    ])
    .withMessage('Please select a valid category')
];

// Public routes
router.get('/', getAllAuctions);
router.get('/:id', getAuctionById);

// Protected routes
router.post('/', authMiddleware, auctionValidation, createAuction);
router.put('/:id', authMiddleware, updateAuction);
router.delete('/:id', authMiddleware, deleteAuction);

module.exports = router;