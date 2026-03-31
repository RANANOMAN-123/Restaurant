const mongoose = require('mongoose');

const SauceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Sauce', SauceSchema);