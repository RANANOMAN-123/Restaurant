const router = require('express').Router();
const { getAllProducts, addProduct, updateProduct, getProduct } = require('../controllers/product-controller');
const ensureAuthenticated = require('../middleware/Auth');
const ensureAdmin = require('../middleware/ensure-admin');

router.get('/all', ensureAuthenticated, getAllProducts);
router.post('/add', ensureAuthenticated, ensureAdmin, addProduct);
router.put('/products/:id', ensureAuthenticated, ensureAdmin, updateProduct);
router.get('/products/:id', ensureAuthenticated, ensureAdmin, getProduct);

module.exports = router;
