




import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateOrder } from '../../common/constants';

interface OrderDetails {
  product: string;
  sauce: string;
  drink: string;
}

const GenerateOrder = () => {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    product: '',
    sauce: '',
    drink: ''
  });

  const products = ['Pizza', 'Burger', 'Sandwich', 'Shawarma', 'Pasta'];
  const sauces = ['Ketchup', 'Mayonnaise', 'Barbecue Sauce', 'Cheese', 'Garlic Sauce'];
  const drinks = ['Next Cola', 'Gourmet drink', '7UP', 'Fanta', 'Mountain Dew'];

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8186/orders/order', {
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
        navigate('/order-history');
      }
    } catch (error) {
      console.error('Failed to place order:', error);
    }
  };

  return (
    <div className="ml-64 p-8">
      <h1 className="text-3xl font-bold mb-8">Generate Order</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Select Product</label>
            <select
              className="w-full p-2 border rounded"
              value={orderDetails.product}
              onChange={(e) => setOrderDetails({...orderDetails, product: e.target.value})}
            >
              <option value="">Select a product</option>
              {products.map(product => (
                <option key={product} value={product}>{product}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">Select Sauce</label>
            <select
              className="w-full p-2 border rounded"
              value={orderDetails.sauce}
              onChange={(e) => setOrderDetails({...orderDetails, sauce: e.target.value})}
            >
              <option value="">Select a sauce</option>
              {sauces.map(sauce => (
                <option key={sauce} value={sauce}>{sauce}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">Select Drink</label>
            <select
              className="w-full p-2 border rounded"
              value={orderDetails.drink}
              onChange={(e) => setOrderDetails({...orderDetails, drink: e.target.value})}
            >
              <option value="">Select a drink</option>
              {drinks.map(drink => (
                <option key={drink} value={drink}>{drink}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateOrder;