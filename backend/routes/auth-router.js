const router = require('express').Router();
const { signupValidation, loginValidation } = require('../middlewares/auth-validation');
const { signup } = require('../controllers/auth-controller');
const { login } = require('../controllers/auth-controller');
const ensureAuthenticated = require('../middlewares/auth');


router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);
router.get('/validate', ensureAuthenticated, (req, res) => {
    res.json({ success: true });
});


module.exports = router;