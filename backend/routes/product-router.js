const router = require('express').Router();
const { getAllProducts, addProduct } = require('../controllers/product-controller');
const ensureAuthenticated = require('../middlewares/auth');

router.get('/all', ensureAuthenticated, getAllProducts);
router.post('/add', ensureAuthenticated, addProduct);

module.exports = router;
