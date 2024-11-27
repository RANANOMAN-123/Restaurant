const router = require('express').Router();
const { getAllProducts, addProduct } = require('../Controllers/ProductController');
const ensureAuthenticated = require('../Middlewares/Auth');

router.get('/all', ensureAuthenticated, getAllProducts);
router.post('/add', ensureAuthenticated, addProduct);

module.exports = router;
