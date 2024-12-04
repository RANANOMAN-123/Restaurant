import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateOrder } from '../../common/constants';

interface OrderDetails {
  product: string;
  sauce: string;
  drink: string;
}

interface Product {
  _id: string;
  name: string;
  availableCount: number;
}

const GenerateOrder = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    product: '',
    sauce: '',
    drink: ''
  });

  const sauces = ['Ketchup', 'Mayonnaise', 'Barbecue Sauce', 'Cheese', 'Garlic Sauce'];
  const drinks = ['Next Cola', 'Gourmet drink', '7UP', 'Fanta', 'Mountain Dew'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8187/products/all', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') || ''
        }
      });
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8187/orders/order', {
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
      <h1 className="text-3xl font-bold mb-8">{generateOrder.generateorderHeading}</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="space-y-4">
          <div>
            <label className="block mb-2">{generateOrder.selectproduct}</label>
            <select
              className="w-full p-2 border rounded"
              value={orderDetails.product}
              onChange={(e) => setOrderDetails({ ...orderDetails, product: e.target.value })}
            >
              <option value="">{generateOrder.selectProduct}</option>
              {products.map(product => (
                <option
                  key={product._id}
                  value={product.name}
                >
                  {product.name} 
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">{generateOrder.selectSauces}</label>
            <select
              className="w-full p-2 border rounded"
              value={orderDetails.sauce}
              onChange={(e) => setOrderDetails({ ...orderDetails, sauce: e.target.value })}
            >
              <option value="">{generateOrder.selectSauce}</option>
              {sauces.map(sauce => (
                <option key={sauce} value={sauce}>{sauce}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">{generateOrder.selectDrink}</label>
            <select
              className="w-full p-2 border rounded"
              value={orderDetails.drink}
              onChange={(e) => setOrderDetails({ ...orderDetails, drink: e.target.value })}
            >
              <option value="">{generateOrder.drink}</option>
              {drinks.map(drink => (
                <option key={drink} value={drink}>{drink}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            {generateOrder.orderPlace}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateOrder;
