import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../../config/api.config';

interface Item {
    _id: string;
    name: string;
}

const SettingsPage = () => {
    const [sauces, setSauces] = useState<Item[]>([]);
    const [drinks, setDrinks] = useState<Item[]>([]);
    const [newSauce, setNewSauce] = useState('');
    const [newDrink, setNewDrink] = useState('');

    useEffect(() => {
        fetchSauces();
        fetchDrinks();
    }, []);

    const fetchSauces = async () => {
        try {
            const res = await fetch(API_ENDPOINTS.GET_SAUCES, {
                headers: { 'Authorization': localStorage.getItem('token') || '' }
            });
            const data = await res.json();
            if (data.success) setSauces(data.sauces);
        } catch (err) {
            toast.error('Failed to fetch sauces!');
        }
    };

    const fetchDrinks = async () => {
        try {
            const res = await fetch(API_ENDPOINTS.GET_DRINKS, {
                headers: { 'Authorization': localStorage.getItem('token') || '' }
            });
            const data = await res.json();
            if (data.success) setDrinks(data.drinks);
        } catch (err) {
            toast.error('Failed to fetch drinks!');
        }
    };

    const handleAddSauce = async () => {
        if (!newSauce.trim()) { toast.error('Enter sauce name!'); return; }
        try {
            const res = await fetch(API_ENDPOINTS.ADD_SAUCE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token') || ''
                },
                body: JSON.stringify({ name: newSauce })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Sauce added!');
                setNewSauce('');
                fetchSauces();
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error('Failed to add sauce!');
        }
    };

    const handleDeleteSauce = async (id: string) => {
        if (!window.confirm('Delete this sauce?')) return;
        try {
            const res = await fetch(API_ENDPOINTS.DELETE_SAUCE(id), {
                method: 'DELETE',
                headers: { 'Authorization': localStorage.getItem('token') || '' }
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Sauce deleted!');
                fetchSauces();
            }
        } catch (err) {
            toast.error('Failed to delete sauce!');
        }
    };

    const handleAddDrink = async () => {
        if (!newDrink.trim()) { toast.error('Enter drink name!'); return; }
        try {
            const res = await fetch(API_ENDPOINTS.ADD_DRINK, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token') || ''
                },
                body: JSON.stringify({ name: newDrink })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Drink added!');
                setNewDrink('');
                fetchDrinks();
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error('Failed to add drink!');
        }
    };

    const handleDeleteDrink = async (id: string) => {
        if (!window.confirm('Delete this drink?')) return;
        try {
            const res = await fetch(API_ENDPOINTS.DELETE_DRINK(id), {
                method: 'DELETE',
                headers: { 'Authorization': localStorage.getItem('token') || '' }
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Drink deleted!');
                fetchDrinks();
            }
        } catch (err) {
            toast.error('Failed to delete drink!');
        }
    };

    return (
        <div className="ml-64 p-8 bg-gray-100 min-h-screen">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
                <p className="text-gray-500 mt-1">Manage sauces and drinks</p>
            </div>

            <div className="grid grid-cols-2 gap-6">

                {/* Sauces */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">🥫 Sauces</h2>

                    {/* Add Sauce */}
                    <div className="flex gap-2 mb-6">
                        <input
                            type="text"
                            placeholder="Enter sauce name..."
                            value={newSauce}
                            onChange={(e) => setNewSauce(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddSauce()}
                            className="flex-1 p-3 border rounded-lg focus:outline-none focus:border-orange-400"
                        />
                        <button
                            onClick={handleAddSauce}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
                        >
                            + Add
                        </button>
                    </div>

                    {/* Sauces List */}
                    <div className="space-y-2">
                        {sauces.length === 0 && (
                            <p className="text-gray-400 text-center py-4">No sauces added yet</p>
                        )}
                        {sauces.map(sauce => (
                            <div key={sauce._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="font-medium text-gray-700">🥫 {sauce.name}</span>
                                <button
                                    onClick={() => handleDeleteSauce(sauce._id)}
                                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Drinks */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">🥤 Drinks</h2>

                    {/* Add Drink */}
                    <div className="flex gap-2 mb-6">
                        <input
                            type="text"
                            placeholder="Enter drink name..."
                            value={newDrink}
                            onChange={(e) => setNewDrink(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddDrink()}
                            className="flex-1 p-3 border rounded-lg focus:outline-none focus:border-orange-400"
                        />
                        <button
                            onClick={handleAddDrink}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
                        >
                            + Add
                        </button>
                    </div>

                    {/* Drinks List */}
                    <div className="space-y-2">
                        {drinks.length === 0 && (
                            <p className="text-gray-400 text-center py-4">No drinks added yet</p>
                        )}
                        {drinks.map(drink => (
                            <div key={drink._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="font-medium text-gray-700">🥤 {drink.name}</span>
                                <button
                                    onClick={() => handleDeleteDrink(drink._id)}
                                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;