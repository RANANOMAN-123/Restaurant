import React, { useState, useEffect } from 'react';
import {orderhistory} from '../../common/constants';

interface Order {
  _id: string;
  product: string;
  sauces: string[];
  drink: string;
  status: 'pending' | 'completed' | 'rejected';
  date: string;
}

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8186/orders/getdata', {
        headers: {
          'Authorization': localStorage.getItem('token') || ''
        }
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const handleOrderStatus = async (orderId: string, status: 'completed' | 'rejected') => {
    try {
      const response = await fetch(`http://localhost:8186/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') || ''
        },
        body: JSON.stringify({ status })
      });

      const data = await response.json();
      if (data.success) {
        fetchOrders(); // Refresh orders after status update
      } else {
        alert(data.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  return (
    <div className="ml-64 p-8">
      <h1 className="text-3xl font-bold mb-8">{orderhistory.mainHeading }</h1>
      <div className="grid gap-4">
        {orders.map(order => (
          <div key={order._id} className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Order #{order._id}</h3>
              <span className={`px-3 py-1 rounded-full text-sm ${
                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                order.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <div className="space-y-2">
              <p><strong>{orderhistory.historyProduct }</strong> {order.product}</p>
              <p><strong>{orderhistory.historySauces }</strong> {order.sauces.join(', ')}</p>
              <p><strong>{orderhistory.historyDrink }</strong> {order.drink}</p>
              <p><strong>{orderhistory.historyDate }</strong> {new Date(order.date).toLocaleDateString()}</p>
            </div>
            {order.status === 'pending' && (
              <div className="mt-4 flex gap-2">
                <button 
                  onClick={() => handleOrderStatus(order._id, 'completed')}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                >
                  {orderhistory.completeOrder}
                </button>
                <button 
                  onClick={() => handleOrderStatus(order._id, 'rejected')}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >
                  {orderhistory.rejectOrder}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
