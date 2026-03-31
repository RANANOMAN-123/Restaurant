const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/product');
mongoose.connect(process.env.MONGO_CONN).then(async () => {
    await Product.updateMany({}, { $set: { price: 500 } });
    console.log('Prices updated!');
    process.exit(0);
});
