const AuctionItem = require('../models/AuctionItem');

// Get all auction items
const getAllAuctions = async (req, res) => {
  try {
    const { category, status, page = 1, limit = 10 } = req.query;
    
    // Build query object
    const query = {};
    if (category) query.category = category;
    if (status) query.status = status;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get auctions with pagination
    const auctions = await AuctionItem.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
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
      auctions,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching auctions' });
  }
};

// Get single auction item by ID
const getAuctionById = async (req, res) => {
  try {
    const auction = await AuctionItem.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!auction) {
      return res.status(404).json({ message: 'Auction item not found' });
    }

    // Update and save status
    auction.updateStatus();
    await auction.save();

    res.json({ auction });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid auction ID' });
    }
    res.status(500).json({ message: 'Server error fetching auction' });
  }
};

// Add new auction item
const createAuction = async (req, res) => {
  try {
    const { title, description, image, startTime, endTime, price, category } = req.body;

    const auction = new AuctionItem({
      title,
      description,
      image,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      price,
      category,
      createdBy: req.user.userId
    });

    await auction.save();

    // Populate creator info
    await auction.populate('createdBy', 'name email');

    res.status(201).json({
      message: 'Auction item created successfully',
      auction
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error creating auction' });
  }
};

// Update auction item
const updateAuction = async (req, res) => {
  try {
    const auction = await AuctionItem.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({ message: 'Auction item not found' });
    }

    // Check if user owns the auction or is admin
    if (auction.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this auction' });
    }

    // Don't allow updates if auction has started
    if (auction.status === 'active' || auction.status === 'ended') {
      return res.status(400).json({ message: 'Cannot update auction that has started or ended' });
    }

    const { title, description, image, startTime, endTime, price, category } = req.body;

    // Update fields
    if (title) auction.title = title;
    if (description) auction.description = description;
    if (image) auction.image = image;
    if (startTime) auction.startTime = new Date(startTime);
    if (endTime) auction.endTime = new Date(endTime);
    if (price) auction.price = price;
    if (category) auction.category = category;

    await auction.save();
    await auction.populate('createdBy', 'name email');

    res.json({
      message: 'Auction item updated successfully',
      auction
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid auction ID' });
    }
    res.status(500).json({ message: 'Server error updating auction' });
  }
};

// Delete auction item
const deleteAuction = async (req, res) => {
  try {
    const auction = await AuctionItem.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({ message: 'Auction item not found' });
    }

    // Check if user owns the auction or is admin
    if (auction.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this auction' });
    }

    // Don't allow deletion if auction has started
    if (auction.status === 'active' || auction.status === 'ended') {
      return res.status(400).json({ message: 'Cannot delete auction that has started or ended' });
    }

    await AuctionItem.findByIdAndDelete(req.params.id);

    res.json({ message: 'Auction item deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid auction ID' });
    }
    res.status(500).json({ message: 'Server error deleting auction' });
  }
};

module.exports = {
  getAllAuctions,
  getAuctionById,
  createAuction,
  updateAuction,
  deleteAuction
};