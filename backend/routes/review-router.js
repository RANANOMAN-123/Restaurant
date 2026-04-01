const router = require('express').Router();
const { addReview, getProductReviews, getAllReviews, deleteReview, checkReviewed } = require('../controllers/review-controller');
const ensureAuthenticated = require('../middleware/Auth');
const ensureAdmin = require('../middleware/ensure-admin');

router.post('/add', ensureAuthenticated, addReview);
router.get('/product/:productName', getProductReviews);
router.get('/all', ensureAuthenticated, ensureAdmin, getAllReviews);
router.delete('/:id', ensureAuthenticated, ensureAdmin, deleteReview);
router.get('/check/:orderId', ensureAuthenticated, checkReviewed);

module.exports = router;