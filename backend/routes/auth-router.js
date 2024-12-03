const router = require('express').Router();
const { signupValidation, loginValidation } = require('../middleware/auth-validation');
const { signup } = require('../controllers/auth-controller');
const { login } = require('../controllers/auth-controller');
// const ensureAuthenticated = require('../middlewares/Auth');
const ensureAuthenticated = require('../middleware/Auth');


router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);
router.get('/validate', ensureAuthenticated, (req, res) => {
    res.json({ success: true });
});


module.exports = router;