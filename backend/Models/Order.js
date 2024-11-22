const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    product: {
        type: String,
        required: true
    },
    sauce: {
        type: String,
        required: true
    },
    drink: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'rejected'],
        default: 'pending'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const OrderModel = mongoose.model('Order', OrderSchema);
module.exports = OrderModel;
