const express = require('express');
const { body, validationResult } = require('express-validator');
const Transaction = require('../models/Transaction');
const Auction = require('../models/Auction');
const Bid = require('../models/Bid');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create payment record
router.post('/create-payment', [
  auth,
  body('auction_id').isMongoId(),
  body('amount').isFloat({ min: 0 }),
  body('type').isIn(['bid_deposit', 'winning_payment']),
  body('payment_method').isIn(['wallet', 'bank_transfer', 'cash'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { auction_id, amount, type, payment_method, payment_reference } = req.body;

    // Verify auction exists
    const auction = await Auction.findById(auction_id);
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    // Create transaction record
    const transaction = new Transaction({
      user_id: req.user._id,
      auction_id,
      amount,
      type,
      payment_method,
      payment_reference,
      status: 'pending'
    });

    await transaction.save();

    res.json({
      message: 'Payment record created successfully',
      transaction_id: transaction._id,
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Confirm payment
router.post('/confirm', [
  auth,
  body('transaction_id').isMongoId(),
  body('payment_reference').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { transaction_id, payment_reference } = req.body;

    // Update transaction
    const transaction = await Transaction.findById(transaction_id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    transaction.status = 'completed';
    if (payment_reference) {
      transaction.payment_reference = payment_reference;
    }
    transaction.processed_at = new Date();
    await transaction.save();

    // Update auction payment status if this is a winning payment
    if (transaction.type === 'winning_payment') {
      await Auction.findByIdAndUpdate(transaction.auction_id, {
        payment_status: 'paid'
      });
    }

    res.json({
      message: 'Payment confirmed successfully',
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's transactions
router.get('/transactions', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, type, status } = req.query;

    let filter = { user_id: req.user._id };
    if (type) filter.type = type;
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const transactions = await Transaction.find(filter)
      .populate('auction_id', 'title images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(filter);

    res.json({
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;