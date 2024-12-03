


const OrderModel = require('../models/order');
const ProductModel = require('../models/product');

//create order in generateorder
const createOrder = async (req, res) => {
    try {
        const { id, product, sauce, drink } = req.body;
        const order = new OrderModel({
            id,
            product,
            sauce,
            drink,
            status: 'pending',
            date: new Date()
        });
        await order.save();
        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to create order"
        });
    }
};
//used in order history & dashboard
const getOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find().sort({ date: -1 });
        res.status(200).json({
            success: true,
            orders
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders"
        });
    }
};



//update order status in order-history
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const updatedOrder = await OrderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        if (status === 'completed') {
            const product = await ProductModel.findOne({ name: updatedOrder.product });
            if (product) {
                product.availableCount = Math.max(0, product.availableCount - 1);
                await product.save();
            }
        }

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order: updatedOrder
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to update order status"
        });
    }
};

//Stock counts
const getProductCounts = async (req, res) => {
    try {
        const products = await ProductModel.find();
        const productCounts = {};

        products.forEach(product => {
            productCounts[product.name] = product.availableCount;
        });

        


        res.status(200).json({
            success: true,
            productCounts
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch product counts"
        });
    }
};

module.exports = {
    createOrder,
    getOrders,
    updateOrderStatus,
    getProductCounts
};