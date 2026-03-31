const mongoose = require('mongoose');
require('dotenv').config();
const Sauce = require('./models/sauce');
const Drink = require('./models/drink');

const sauces = ['Ketchup', 'Mayonnaise', 'Barbecue Sauce', 'Cheese', 'Garlic Sauce'];
const drinks = ['Next Cola', 'Gourmet drink', '7UP', 'Fanta', 'Mountain Dew'];

mongoose.connect(process.env.MONGO_CONN).then(async () => {
    await Sauce.deleteMany({});
    await Drink.deleteMany({});
    await Sauce.insertMany(sauces.map(name => ({ name })));
    await Drink.insertMany(drinks.map(name => ({ name })));
    console.log('Sauces and Drinks seeded!');
    process.exit(0);
});
