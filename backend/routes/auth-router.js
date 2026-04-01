const router = require('express').Router();
const { signupValidation, loginValidation } = require('../middleware/auth-validation');
const { signup, login, changePassword, getAllUsers, deleteUser, makeAdmin, updateName } = require('../controllers/auth-controller');
const ensureAuthenticated = require('../middleware/Auth');
const ensureAdmin = require('../middleware/ensure-admin');

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);
router.post('/change-password', ensureAuthenticated, changePassword);
router.get('/users', ensureAuthenticated, ensureAdmin, getAllUsers);
router.delete('/users/:id', ensureAuthenticated, ensureAdmin, deleteUser);
router.patch('/users/:id/make-admin', ensureAuthenticated, ensureAdmin, makeAdmin);
router.patch('/update-name', ensureAuthenticated, updateName);
router.get('/validate', ensureAuthenticated, (req, res) => {
    res.json({ success: true });
});

module.exports = router;