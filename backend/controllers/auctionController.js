const AuctionItem = require('../models/AuctionItem');
const { validationResult } = require('express-validator');

// @desc    Get all auction items
// @route   GET /api/auctions
// @access  Public
const getAllAuctions = async (req, res, next) => {
  try {
    const { 
      category, 
      status, 
      search,
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build query object
    const query = { isActive: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Get auctions with pagination
    const auctions = await AuctionItem.find(query)
      .populate('createdBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Update status for each auction
    for (let auction of auctions) {
      auction.updateStatus();
      await auction.save();
    }

    // Get total count for pagination
    const total = await AuctionItem.countDocuments(query);

    res.json({
      success: true,
      auctions,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single auction item by ID
// @route   GET /api/auctions/:id
// @access  Public
const getAuctionById = async (req, res, next) => {
  try {
    const auction = await AuctionItem.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!auction || !auction.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Auction item not found'
      });
    }

    // Update and save status
    auction.updateStatus();
    await auction.save();

    res.json({
      success: true,
      auction
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid auction ID'
      });
    }
    next(error);
  }
};

// @desc    Create new auction item
// @route   POST /api/auctions
// @access  Private
const createAuction = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, description, image, startTime, endTime, price, category } = req.body;

    // Validate dates
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    if (start <= now) {
      return res.status(400).json({
        success: false,
        message: 'Start time must be in the future'
      });
    }

    const auction = new AuctionItem({
      title,
      description,
      image,
      startTime: start,
      endTime: end,
      price,
      category,
      createdBy: req.user.userId
    });

    await auction.save();

    // Populate creator info
    await auction.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Auction item created successfully',
      auction
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update auction item
// @route   PUT /api/auctions/:id
// @access  Private
const updateAuction = async (req, res, next) => {
  try {
    const auction = await AuctionItem.findById(req.params.id);

    if (!auction || !auction.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Auction item not found'
      });
    }

    // Check ownership or admin role
    if (auction.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this auction'
      });
    }

    // Update status before checking
    auction.updateStatus();

    // Don't allow updates if auction has started
    if (auction.status === 'active' || auction.status === 'ended') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update auction that has started or ended'
      });
    }

    const { title, description, image, startTime, endTime, price, category } = req.body;

    // Update fields
    if (title) auction.title = title;
    if (description) auction.description = description;
    if (image) auction.image = image;
    if (price) auction.price = price;
    if (category) auction.category = category;
    
    if (startTime) {
      const start = new Date(startTime);
      if (start <= new Date()) {
        return res.status(400).json({
          success: false,
          message: 'Start time must be in the future'
        });
      }
      auction.startTime = start;
    }
    
    if (endTime) {
      auction.endTime = new Date(endTime);
    }

    await auction.save();
    await auction.populate('createdBy', 'name email');

    res.json({
      success: true,
      message: 'Auction item updated successfully',
      auction
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid auction ID'
      });
    }
    next(error);
  }
};

// @desc    Delete auction item
// @route   DELETE /api/auctions/:id
// @access  Private
const deleteAuction = async (req, res, next) => {
  try {
    const auction = await AuctionItem.findById(req.params.id);

    if (!auction || !auction.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Auction item not found'
      });
    }

    // Check ownership or admin role
    if (auction.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this auction'
      });
    }

    // Update status before checking
    auction.updateStatus();

    // Don't allow deletion if auction has started
    if (auction.status === 'active' || auction.status === 'ended') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete auction that has started or ended'
      });
    }

    // Soft delete
    auction.isActive = false;
    await auction.save();

    res.json({
      success: true,
      message: 'Auction item deleted successfully'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid auction ID'
      });
    }
    next(error);
  }
};

module.exports = {
  getAllAuctions,
  getAuctionById,
  createAuction,
  updateAuction,
  deleteAuction
};