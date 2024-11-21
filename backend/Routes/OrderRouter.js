const router = require('express').Router();
const ensureAuthenticated = require('../Middlewares/Auth');
const { 
    createOrder, 
    getOrders, 
    updateOrderStatus, 
    getProductCounts
} = require('../Controllers/OrderController');

router.get('/product-counts', ensureAuthenticated, getProductCounts);
router.post('/order', ensureAuthenticated, createOrder);
router.get('/getdata', ensureAuthenticated, getOrders);
router.patch('/:orderId/status', ensureAuthenticated, updateOrderStatus);
// router.get('/stats', ensureAuthenticated, getOrderStats);

module.exports = router;
