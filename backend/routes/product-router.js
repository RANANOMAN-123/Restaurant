const router = require('express').Router();
const { getAllProducts, addProduct } = require('../controllers/product-controller');
const ensureAuthenticated = require('../middlewares/auth');
const { updateProduct } = require('../controllers/product-controller');

router.get('/all', ensureAuthenticated, getAllProducts);
router.post('/add', ensureAuthenticated, addProduct);
router.put('/products/:id', updateProduct);


module.exports = router;
