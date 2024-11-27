const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    availableCount: {
        type: Number,
        required: true,
        default: 15
    }   
});

const ProductModel = mongoose.model('Product', ProductSchema);
module.exports = ProductModel;
