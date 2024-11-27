const ProductModel = require('../Models/Product');

const getAllProducts = async (req, res) => {
    try {
        const products = await ProductModel.find();
        res.status(200).json({
            success: true,
            products
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch products"
        });
    }
};

const addProduct = async (req, res) => {
    try {
        const { name, description, imageUrl } = req.body;
        const product = new ProductModel({
            name,
            description,
            imageUrl
        });
        await product.save();
        res.status(201).json({
            success: true,
            message: "Product added successfully",
            product
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to add product"
        });
    }
};

const getZeroStockProducts = async (req, res) => {
    try {
        const products = await ProductModel.find({ availableCount: 0 });
        res.status(200).json({
            success: true,
            products
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch zero stock products"
        
        });
    }
};

// const createProduct = async (req, res) => {
//     try {
//         const { name, description, imageUrl, availableCount } = req.body;
//         const product = new ProductModel({
//             name,
//             descriptiom,
//             imageUrl,
//             availableCount
//         });
//         await product.save();
//         res.status(201).json({
//             success: true,
//             message: "Product created successfully",
//             product
//         });
//     } catch (err) {
//         res.status(500).json({
//             success: false,
//             message: "Failed to create product"
//         });
//     }
// };

module.exports = {
    getAllProducts,
    addProduct
};