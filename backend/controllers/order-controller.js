const OrderModel = require('../models/order');
const ProductModel = require('../models/product');

const createOrder = async (req, res) => {
    try {
        const { id, product, sauce, drink } = req.body;

        // Check stock
        const productData = await ProductModel.findOne({ name: product });
        
        if (!productData) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        if (productData.availableCount === 0) {
            return res.status(400).json({ success: false, message: 'Product is out of stock!' });
        }

        const price = productData.price || 0;

        const order = new OrderModel({
            id,
            userId: req.user.id,
            userName: req.user.email,
            product,
            price,
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
        let orders;
        if (req.user.isAdmin) {
            orders = await OrderModel.find().sort({ date: -1 });
        } else {
            orders = await OrderModel.find({ userId: req.user.id }).sort({ date: -1 });
        }
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



const getReports = async (req, res) => {
    try {
        const orders = await OrderModel.find();

        // Total stats
        const totalOrders = orders.length;
        const completedOrders = orders.filter(o => o.status === 'completed');
        const pendingOrders = orders.filter(o => o.status === 'pending');
        const rejectedOrders = orders.filter(o => o.status === 'rejected');

        // Total revenue
        const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.price || 0), 0);

        // Best selling products
        const productSales = {};
        completedOrders.forEach(order => {
            if (productSales[order.product]) {
                productSales[order.product]++;
            } else {
                productSales[order.product] = 1;
            }
        });
        const bestSelling = Object.entries(productSales)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

        // Monthly revenue
        const monthlyRevenue = {};
        completedOrders.forEach(order => {
            const month = new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
            monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (order.price || 0);
        });

        // Popular sauces
        const sauceSales = {};
        completedOrders.forEach(order => {
            sauceSales[order.sauce] = (sauceSales[order.sauce] || 0) + 1;
        });
        const popularSauces = Object.entries(sauceSales)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

        // Popular drinks
        const drinkSales = {};
        completedOrders.forEach(order => {
            drinkSales[order.drink] = (drinkSales[order.drink] || 0) + 1;
        });
        const popularDrinks = Object.entries(drinkSales)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

        res.status(200).json({
            success: true,
            reports: {
                totalOrders,
                completedOrders: completedOrders.length,
                pendingOrders: pendingOrders.length,
                rejectedOrders: rejectedOrders.length,
                totalRevenue,
                bestSelling,
                monthlyRevenue,
                popularSauces,
                popularDrinks
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch reports' });
    }
};


module.exports = {
    createOrder,
    getOrders,
    updateOrderStatus,
    getProductCounts,
    getReports
};