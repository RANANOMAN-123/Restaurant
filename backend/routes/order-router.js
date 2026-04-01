const router = require('express').Router();
const ensureAuthenticated = require('../middleware/Auth');
const ensureAdmin = require('../middleware/ensure-admin');
const {
    createOrder,
    getOrders,
    updateOrderStatus,
    getProductCounts,
    getReports
} = require('../controllers/order-controller');

router.get('/product-counts', ensureAuthenticated, getProductCounts);
router.post('/order', ensureAuthenticated, createOrder);
router.get('/getdata', ensureAuthenticated, getOrders);
router.patch('/:orderId/status', ensureAuthenticated, updateOrderStatus);
router.get('/reports', ensureAuthenticated, ensureAdmin, getReports);

module.exports = router;