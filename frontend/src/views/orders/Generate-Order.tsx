import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../config/api.config';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  imageUrl: string;
  availableCount: number;
  price: number;
}

interface Item {
  _id: string;
  name: string;
}

const GenerateOrder = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [sauces, setSauces] = useState<Item[]>([]);
  const [drinks, setDrinks] = useState<Item[]>([]);
  const [orderDetails, setOrderDetails] = useState({ product: '', sauce: '', drink: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchSauces();
    fetchDrinks();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_ALL_PRODUCTS, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') || ''
        }
      });
      const data = await response.json();
      if (data.success) setProducts(data.products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchSauces = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.GET_SAUCES, {
        headers: { 'Authorization': localStorage.getItem('token') || '' }
      });
      const data = await res.json();
      if (data.success) setSauces(data.sauces);
    } catch (err) {
      console.error('Failed to fetch sauces');
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
      console.error('Failed to fetch drinks');
    }
  };

  const selectedProduct = products.find(p => p.name === orderDetails.product);

const handleSubmit = async () => {
    if (!orderDetails.product || !orderDetails.sauce || !orderDetails.drink) {
      toast.error('Please select all options!');
      return;
    }
    try {
      const response = await fetch(API_ENDPOINTS.CREATE_ORDER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') || ''
        },
        body: JSON.stringify({
          id: Date.now(),
          ...orderDetails,
          status: 'pending',
          date: new Date().toISOString()
        })
      });
      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
        setTimeout(() => navigate('/order-history'), 1500);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Failed to place order:', error);
      toast.error('Failed to place order!');
    }
  };
  return (
    <div className="ml-64 p-8 bg-gray-100 min-h-screen">

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Generate Order</h1>
        <p className="text-gray-500 mt-1">Select your meal preferences</p>
      </div>

      {submitted && (
        <div className="bg-green-100 text-green-700 p-4 rounded-xl mb-6 text-center font-medium">
          ✅ Order placed successfully! Redirecting...
        </div>
      )}

      <div className="flex gap-6">

        {/* Form */}
        <div className="bg-white p-6 rounded-xl shadow-md flex-1">
          <div className="space-y-5">

            {/* Product */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">🍔 Select Product</label>
              <select
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-orange-400"
                value={orderDetails.product}
                onChange={(e) => setOrderDetails({ ...orderDetails, product: e.target.value })}
              >
                <option value="">Select a product</option>
              {products.map(product => (
                  <option 
                     key={product._id} 
                     value={product.name}
                     disabled={product.availableCount === 0}
                  >
                     {product.availableCount === 0 
                     ? `${product.name} — OUT OF STOCK` 
                     : `${product.name} — PKR ${product.price} (Available: ${product.availableCount})`
                     }
                   </option>
                    ))}
              </select>
            </div>

            {/* Sauce */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">🥫 Select Sauce</label>
              <select
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-orange-400"
                value={orderDetails.sauce}
                onChange={(e) => setOrderDetails({ ...orderDetails, sauce: e.target.value })}
              >
                <option value="">Select a sauce</option>
                {sauces.map(sauce => (
                  <option key={sauce._id} value={sauce.name}>{sauce.name}</option>
                ))}
              </select>
            </div>

            {/* Drink */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">🥤 Select Drink</label>
              <select
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-orange-400"
                value={orderDetails.drink}
                onChange={(e) => setOrderDetails({ ...orderDetails, drink: e.target.value })}
              >
                <option value="">Select a drink</option>
                {drinks.map(drink => (
                  <option key={drink._id} value={drink.name}>{drink.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-semibold transition-all"
            >
              Place Order 🛒
            </button>
          </div>
        </div>

        {/* Order Summary Preview */}
        <div className="bg-white p-6 rounded-xl shadow-md w-80 shrink-0">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>

          {selectedProduct ? (
            <img
              src={selectedProduct.imageUrl}
              alt={selectedProduct.name}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
          ) : (
            <div className="w-full h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400">
              No product selected
            </div>
          )}

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">🍔 Product</span>
              <span className="font-medium">{orderDetails.product || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">🥫 Sauce</span>
              <span className="font-medium">{orderDetails.sauce || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">🥤 Drink</span>
              <span className="font-medium">{orderDetails.drink || '—'}</span>
            </div>
            {selectedProduct && (
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="font-bold text-gray-700">💰 Total</span>
                <span className="font-bold text-orange-500">PKR {selectedProduct.price}</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Section - Quick Tips */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm flex items-center gap-4">
          <span className="text-4xl">🍔</span>
          <div>
            <h3 className="font-semibold text-gray-800">Fresh Ingredients</h3>
            <p className="text-sm text-gray-500">All products made fresh daily</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm flex items-center gap-4">
          <span className="text-4xl">⚡</span>
          <div>
            <h3 className="font-semibold text-gray-800">Quick Service</h3>
            <p className="text-sm text-gray-500">Orders prepared in minutes</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm flex items-center gap-4">
          <span className="text-4xl">⭐</span>
          <div>
            <h3 className="font-semibold text-gray-800">Top Quality</h3>
            <p className="text-sm text-gray-500">Best restaurant in town</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default GenerateOrder;