const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./routes/auth-router');
const OrderRouter = require('./routes/order-router');
const ProductRouter = require('./routes/product-router');

require('dotenv').config();
require('./models/db');

const port = process.env.PORT || 8187;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', AuthRouter);
app.use('/api/orders', OrderRouter);
app.use('/api/products', ProductRouter);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'Server is running' });
});

app.listen(port, () => {
    console.log(`Server is running on ${port}`)
});
