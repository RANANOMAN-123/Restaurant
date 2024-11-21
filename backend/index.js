const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');
const OrderRouter = require('./Routes/OrderRouter');

require('dotenv').config();
require('./Models/db');


const port = process.env.PORT || 8186;


app.use(bodyParser.json());
app.use(cors());
app.use('/auth', AuthRouter);
app.use('/products',ProductRouter);
app.use('/orders', OrderRouter);
app.listen(port, () => {
    console.log(`Server is running on ${port}`)
});


