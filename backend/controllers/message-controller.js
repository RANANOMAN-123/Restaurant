const Message = require('../models/message');
const User = require('../models/user');

const sendMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'All fields required' });
        }
        const newMessage = new Message({ name, email, message, sender: 'user' });
        await newMessage.save();
        res.status(201).json({ success: true, message: 'Message sent successfully!' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to send message' });
    }
};

const sendMessageToUser = async (req, res) => {
    try {
        const { receiverEmail, message } = req.body;
        if (!receiverEmail || !message) {
            return res.status(400).json({ success: false, message: 'All fields required' });
        }
        const newMessage = new Message({
            name: 'Admin',
            email: 'admin@tastybites.com',
            receiverEmail,
            message,
            sender: 'admin',
            isRead: false
        });
        await newMessage.save();
        res.status(201).json({ success: true, message: 'Message sent to user!' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to send message' });
    }
};

const getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find({ sender: 'user' }).sort({ date: -1 });
        res.status(200).json({ success: true, messages });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch messages' });
    }
};

const getUnreadCount = async (req, res) => {
    try {
        const count = await Message.countDocuments({ isRead: false, sender: 'user' });
        res.status(200).json({ success: true, count });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch count' });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, { isRead: true });
        res.status(200).json({ success: true, message: 'Marked as read' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to mark as read' });
    }
};

const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Message deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to delete message' });
    }
};

const replyMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { reply } = req.body;
        if (!reply) {
            return res.status(400).json({ success: false, message: 'Reply cannot be empty' });
        }
        const message = await Message.findByIdAndUpdate(
            id,
            { reply, repliedAt: new Date(), isRead: true },
            { new: true }
        );
        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }
        res.status(200).json({ success: true, message: 'Reply sent!', data: message });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to send reply' });
    }
};

const getMessagesByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        // User ke apne messages + admin ke bheje hue messages
        const messages = await Message.find({
            $or: [
                { email, sender: 'user' },
                { receiverEmail: email, sender: 'admin' }
            ]
        }).sort({ date: -1 });
        res.status(200).json({ success: true, messages });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch messages' });
    }
};

// Get all users who sent messages — for admin to select receiver
const getMessageUsers = async (req, res) => {
    try {
        const users = await User.find({ isAdmin: false }, { email: 1, name: 1 });
        res.status(200).json({ success: true, users });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
};

module.exports = {
    sendMessage,
    sendMessageToUser,
    getAllMessages,
    getUnreadCount,
    markAsRead,
    deleteMessage,
    replyMessage,
    getMessagesByEmail,
    getMessageUsers
};