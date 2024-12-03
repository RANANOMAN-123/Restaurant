const ProductModel = require('../models/product');

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








const updateProduct = async (req, res) => {
    try {
        const { id } = req.params; 
        const { name, description, imageUrl, availableCount } = req.body; // Data to update

        // Find product by ID and update with the new data
        const product = await ProductModel.findByIdAndUpdate(
            id, 
            { name, description, imageUrl, availableCount }, 
            { new: true } // Returns the updated document
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to update product",
            error: err.message
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

const getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.findById(id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            product
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch product"
        });
    }
};



    


module.exports = {
    getAllProducts,
    addProduct,
    updateProduct,
    getZeroStockProducts,
    getProduct
};




// const addOrUpdateProduct = async (req, res) => {
//     try {
//         const { id } = req.params; // Optional: ID for updating an existing product
//         const { name, description, imageUrl, availableCount } = req.body; // Data to add or update

//         if (id) {
//             // Update existing product
//             const product = await ProductModel.findByIdAndUpdate(
//                 id,
//                 { name, description, imageUrl, availableCount },
//                 { new: true } // Returns the updated document
//             );

//             if (!product) {
//                 return res.status(404).json({
//                     success: false,
//                     message: "Product not found",
//                 });
//             }

//             return res.status(200).json({
//                 success: true,
//                 message: "Product updated successfully",
//                 product,
//             });
//         } else {
//             // Add new product
//             const product = new ProductModel({
//                 name,
//                 description,
//                 imageUrl,
//                 availableCount,
//             });
//             await product.save();

//             return res.status(201).json({
//                 success: true,
//                 message: "Product added successfully",
//                 product,
//             });
//         }
//     } catch (err) {
//         return res.status(500).json({
//             success: false,
//             message: "Failed to process request",
//             error: err.message,
//         });
//     }
// };
