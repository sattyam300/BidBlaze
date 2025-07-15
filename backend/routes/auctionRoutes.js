const express = require('express');
const {
  getAllAuctions,
  getAuctionById,
  createAuction,
  updateAuction,
  deleteAuction
} = require('../controllers/auctionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getAllAuctions);
router.get('/:id', getAuctionById);

// Protected routes
router.post('/', authMiddleware, createAuction);
router.put('/:id', authMiddleware, updateAuction);
router.delete('/:id', authMiddleware, deleteAuction);

module.exports = router;