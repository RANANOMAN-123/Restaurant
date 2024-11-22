


const OrderModel = require('../Models/Order');

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

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        
        const updatedOrder = await OrderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

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

const getProductCounts = async (req, res) => {
    try {
        const completedOrders = await OrderModel.find({ status: 'completed' });
        const productCounts = {
            Pizza: 15,
            Burger: 15,
            Sandwich: 15,
            Shawarma: 15,
            Pasta: 15
        };

        completedOrders.forEach(order => {
            if (productCounts[order.product]) {
                productCounts[order.product] -= 1;
            }
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