const Review = require('../models/review');

const addReview = async (req, res) => {
    try {
        const { productName, orderId, rating, comment } = req.body;
        if (!productName || !orderId || !rating) {
            return res.status(400).json({ success: false, message: 'All fields required' });
        }

        // Check if already reviewed
        const existing = await Review.findOne({ orderId, userId: req.user.id });
        if (existing) {
            return res.status(409).json({ success: false, message: 'You already reviewed this order!' });
        }

        const review = new Review({
            userId: req.user.id,
            userName: req.user.email,
            productName,
            orderId,
            rating,
            comment
        });
        await review.save();
        res.status(201).json({ success: true, message: 'Review added!', review });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to add review' });
    }
};

const getProductReviews = async (req, res) => {
    try {
        const { productName } = req.params;
        const reviews = await Review.find({ productName }).sort({ date: -1 });
        const avgRating = reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;
        res.status(200).json({ success: true, reviews, avgRating: avgRating.toFixed(1) });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
    }
};

const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ date: -1 });
        res.status(200).json({ success: true, reviews });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
    }
};

const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        await Review.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Review deleted!' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to delete review' });
    }
};

const checkReviewed = async (req, res) => {
    try {
        const { orderId } = req.params;
        const review = await Review.findOne({ orderId, userId: req.user.id });
        res.status(200).json({ success: true, reviewed: !!review });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to check review' });
    }
};

module.exports = { addReview, getProductReviews, getAllReviews, deleteReview, checkReviewed };