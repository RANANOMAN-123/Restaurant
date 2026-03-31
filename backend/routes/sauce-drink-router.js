const router = require('express').Router();
const {
    getAllSauces, addSauce, deleteSauce,
    getAllDrinks, addDrink, deleteDrink
} = require('../controllers/sauce-drink-controller');
const ensureAuthenticated = require('../middleware/Auth');
const ensureAdmin = require('../middleware/ensure-admin');

router.get('/sauces', ensureAuthenticated, getAllSauces);
router.post('/sauces', ensureAuthenticated, ensureAdmin, addSauce);
router.delete('/sauces/:id', ensureAuthenticated, ensureAdmin, deleteSauce);

router.get('/drinks', ensureAuthenticated, getAllDrinks);
router.post('/drinks', ensureAuthenticated, ensureAdmin, addDrink);
router.delete('/drinks/:id', ensureAuthenticated, ensureAdmin, deleteDrink);

module.exports = router;