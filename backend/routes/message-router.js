const router = require('express').Router();
const {
    sendMessage,
    sendMessageToUser,
    getAllMessages,
    getUnreadCount,
    markAsRead,
    deleteMessage,
    replyMessage,
    getMessagesByEmail,
    getMessageUsers
} = require('../controllers/message-controller');
const ensureAuthenticated = require('../middleware/Auth');
const ensureAdmin = require('../middleware/ensure-admin');

router.post('/send', sendMessage);
router.post('/send-to-user', ensureAuthenticated, ensureAdmin, sendMessageToUser);
router.get('/all', ensureAuthenticated, ensureAdmin, getAllMessages);
router.get('/unread-count', ensureAuthenticated, ensureAdmin, getUnreadCount);
router.get('/users', ensureAuthenticated, ensureAdmin, getMessageUsers);
router.patch('/:id/read', ensureAuthenticated, ensureAdmin, markAsRead);
router.delete('/:id', ensureAuthenticated, ensureAdmin, deleteMessage);
router.patch('/:id/reply', ensureAuthenticated, ensureAdmin, replyMessage);
router.get('/by-email/:email', getMessagesByEmail);

module.exports = router;