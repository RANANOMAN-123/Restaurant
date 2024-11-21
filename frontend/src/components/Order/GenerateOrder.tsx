import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {generateOrder} from '../../common/constants';

interface OrderDetails {
  product: string;
  sauces: string[];
  drink: string;
}

interface ProductCounts {
  [key: string]: number;
}

const GenerateOrder = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    product: '',
    sauces: [],
    drink: ''
  });
  const [productCounts, setProductCounts] = useState<ProductCounts>({
    Pizza: 15,
    Burger: 15,
    Sandwich: 15,
    Shawarma: 15,
    Pasta: 15
  });

  const products = ['Pizza', 'Burger', 'Sandwich', 'Shawarma', 'Pasta'];
  const sauces = ['Ketchup', 'Mayonnaise', 'Barbecue Sauce', 'Cheese', 'Garlic Sauce'];
  const drinks = ['Next Cola', 'Gourmet drink', '7UP', 'Fanta', 'Mountain Dew'];

  useEffect(() => {
    fetchProductCounts();
  }, []);

  const fetchProductCounts = async () => {
    try {
      const response = await fetch('http://localhost:8186/orders/product-counts', {
        headers: {
          'Authorization': localStorage.getItem('token') || ''
        }
      });
      const data = await response.json();
      if (data.success) {
        setProductCounts(data.productCounts);
      }
    } catch (error) {
      console.error('Failed to fetch product counts:', error);
    }
  };

  const isProductAvailable = (product: string): boolean => {
    return productCounts[product] > 0;
  };

  const handlePlaceOrder = async () => {
    if (!isProductAvailable(orderDetails.product)) {
      alert('Selected product is no longer available');
      return;
    }

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
      } else {
        alert(data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="ml-64 p-8">
      <h1 className="text-3xl font-bold mb-8">{generateOrder.generateorderHeading }</h1>
      
      <div className="flex justify-between mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`w-1/4 p-6 mx-2 rounded-lg ${
              currentStep === step
                ? 'bg-orange-500 text-white'
                : 'bg-white'
            } shadow-lg`}
          >
            <h3 className="text-lg font-semibold mb-4">
              Step {step}
              {step === 1 && ': Select Product'}
              {step === 2 && ': Choose Sauces'}
              {step === 3 && ': Pick Drink'}
              {step === 4 && ': Review Order'}
            </h3>

            {step === 1 && currentStep === 1 && (
              <div>
                <select
                  className="w-full p-2 border rounded text-gray-800 bg-white"
                  value={orderDetails.product}
                  onChange={(e) => setOrderDetails({...orderDetails, product: e.target.value})}
                >
                  <option value="">{generateOrder.selectProduct }</option>
                  {products.map(product => (
                    <option 
                      key={product} 
                      value={product}
                      disabled={!isProductAvailable(product)}
                    >
                      {product} {!isProductAvailable(product) ? '(Out of Stock)' : `(${productCounts[product]} available)`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {step === 2 && currentStep === 2 && (
              <div>
                <select
                  className="w-full p-2 border rounded text-gray-800 bg-white mb-2"
                  onChange={(e) => {
                    const sauce = e.target.value;
                    if (sauce && orderDetails.sauces.length < 2) {
                      setOrderDetails({
                        ...orderDetails,
                        sauces: [...orderDetails.sauces, sauce]
                      });
                    }
                  }}
                >
                  <option value="">{generateOrder.selectSauce }({2 - orderDetails.sauces.length} remaining)</option>
                  {sauces
                    .filter(sauce => !orderDetails.sauces.includes(sauce))
                    .map(sauce => (
                      <option key={sauce} value={sauce}>{sauce}</option>
                    ))}
                </select>
                {orderDetails.sauces.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm mb-2">{generateOrder.selectedSaucess }</p>
                    {orderDetails.sauces.map(sauce => (
                      <div key={sauce} className="flex items-center justify-between mb-1">
                        <span>{sauce}</span>
                        <button
                          onClick={() => setOrderDetails({
                            ...orderDetails,
                            sauces: orderDetails.sauces.filter(s => s !== sauce)
                          })}
                          className="text-white-500 text-sm"
                        >
                          {generateOrder.remove }
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {step === 3 && currentStep === 3 && (
              <select
                className="w-full p-2 border rounded text-gray-800 bg-white"
                value={orderDetails.drink}
                onChange={(e) => setOrderDetails({...orderDetails, drink: e.target.value})}
              >
                <option value="">{generateOrder.drink }</option>
                {drinks.map(drink => (
                  <option key={drink} value={drink}>{drink}</option>
                ))}
              </select>
            )}

            {step === 4 && currentStep === 4 && (
              <div className="space-y-2">
                <p><strong>{generateOrder.selectedProduct }</strong> {orderDetails.product}</p>
                <p><strong>{ generateOrder.selectedSauces}</strong> {orderDetails.sauces.join(', ')}</p>
                <p><strong>{generateOrder.selectedDrink }</strong> {orderDetails.drink}</p>
                <button
                  className="mt-4 bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
                  onClick={handlePlaceOrder}
                  disabled={!isProductAvailable(orderDetails.product)}
                >
                  {generateOrder.orderPlace }
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between px-2">
        <button
          className="bg-gray-500 text-white px-6 py-2 rounded"
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
        >
          {generateOrder.previous }
        </button>
        <button
          className="bg-orange-500 text-white px-6 py-2 rounded"
          onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))}
          disabled={currentStep === 4}
        >
          {generateOrder.next }
        </button>
      </div>
    </div>
  );
};

export default GenerateOrder;
