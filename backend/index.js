const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./routes/auth-router');
const OrderRouter = require('./routes/order-router');
const ProductRouter = require('./routes/product-router');

require('dotenv').config();
require('./models/db');

const port = process.env.PORT || 8186;

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', AuthRouter);
app.use('/orders', OrderRouter);
app.use('/products', ProductRouter);

app.listen(port, () => {
    console.log(`Server is running on ${port}`)
});
