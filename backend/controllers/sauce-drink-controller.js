const Sauce = require('../models/sauce');
const Drink = require('../models/drink');

// SAUCES
const getAllSauces = async (req, res) => {
    try {
        const sauces = await Sauce.find();
        res.status(200).json({ success: true, sauces });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch sauces' });
    }
};

const addSauce = async (req, res) => {
    try {
        const { name } = req.body;
        const existing = await Sauce.findOne({ name });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Sauce already exists' });
        }
        const sauce = new Sauce({ name });
        await sauce.save();
        res.status(201).json({ success: true, message: 'Sauce added', sauce });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to add sauce' });
    }
};

const deleteSauce = async (req, res) => {
    try {
        const { id } = req.params;
        await Sauce.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Sauce deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to delete sauce' });
    }
};

// DRINKS
const getAllDrinks = async (req, res) => {
    try {
        const drinks = await Drink.find();
        res.status(200).json({ success: true, drinks });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch drinks' });
    }
};

const addDrink = async (req, res) => {
    try {
        const { name } = req.body;
        const existing = await Drink.findOne({ name });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Drink already exists' });
        }
        const drink = new Drink({ name });
        await drink.save();
        res.status(201).json({ success: true, message: 'Drink added', drink });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to add drink' });
    }
};

const deleteDrink = async (req, res) => {
    try {
        const { id } = req.params;
        await Drink.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Drink deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to delete drink' });
    }
};

module.exports = {
    getAllSauces, addSauce, deleteSauce,
    getAllDrinks, addDrink, deleteDrink
};