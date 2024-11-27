const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const OrderRouter = require('./Routes/OrderRouter');
const ProductRouter = require('./Routes/ProductRouter');

require('dotenv').config();
require('./Models/db');

const port = process.env.PORT || 8186;

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', AuthRouter);
app.use('/orders', OrderRouter);
app.use('/products', ProductRouter);

app.listen(port, () => {
    console.log(`Server is running on ${port}`)
});
