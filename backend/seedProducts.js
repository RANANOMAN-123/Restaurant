const mongoose = require('mongoose');
const ProductModel = require('./models/product');
require('dotenv').config();

const products = [
    {
        name: 'Pizza',
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
        description: 'Delicious handcrafted pizza with fresh toppings'
    },
    {
        name: 'Burger',
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
        description: 'Juicy burger with premium ingredients'
    },
    {
        name: 'Sandwich',
        imageUrl: 'https://images.unsplash.com/photo-1529563021893-cc83c992d75d',
        description: 'Fresh and healthy sandwiches made to order'
    },
    {
        name: 'Shawarma',
        imageUrl: 'https://images.unsplash.com/photo-1642783944285-b33b18ef6c3b',
        description: 'Authentic Middle Eastern shawarma'
    },
    {
        name: 'Pasta',
        imageUrl: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601',
        description: 'Italian pasta with homemade sauce'
    }
];

mongoose.connect(process.env.MONGO_CONN)
    .then(async () => {
        console.log('Connected to MongoDB');
        await ProductModel.deleteMany({});
        await ProductModel.insertMany(products);
        console.log('Products seeded successfully');
        process.exit(0);
    })
    .catch(err => {
        console.error('Seeding failed:', err);
        process.exit(1);
    });
