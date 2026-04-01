const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (user) {
      return res.status(409).json({
        message: "User already exists, you can login",
        success: false
      });
    }

    const userModel = new UserModel({ name, email, password });
    userModel.password = await bcrypt.hash(password, 10);
    await userModel.save();

    res.status(201).json({
      message: "Signup successful",
      success: true
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    const errorMsg = "Auth failed, email or password is incorrect";
    if (!user) {
      return res.status(403).json({
        message: errorMsg,
        success: false
      });
    }

    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(403).json({
        message: errorMsg,
        success: false
      });
    }

    const jwtToken = jwt.sign(
      {
        email: user.email,
        id: user._id,
        isAdmin: user.isAdmin
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login successful",
      success: true,
      jwtToken,
      email,
      name: user.name,
      isAdmin: user.isAdmin
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await UserModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ success: false, message: 'New password cannot be same as current password' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Get all users — Admin only
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}, { password: 0 });
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

// Delete user — Admin only
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (id === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete yourself!' });
    }
    await UserModel.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
};

// Make Admin — Admin only
const makeAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.isAdmin = !user.isAdmin;
    await user.save();
    res.status(200).json({
      success: true,
      message: `User is now ${user.isAdmin ? 'Admin' : 'Regular User'}`,
      isAdmin: user.isAdmin
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update user' });
  }
};

const updateName = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: 'Name is required' });
        }
        await UserModel.findByIdAndUpdate(req.user.id, { name });
        res.status(200).json({ success: true, message: 'Name updated successfully!' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update name' });
    }
};

module.exports = { signup, login, changePassword, getAllUsers, deleteUser, makeAdmin, updateName };