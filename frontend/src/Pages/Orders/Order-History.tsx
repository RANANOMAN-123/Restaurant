



import React, { useState, useEffect } from 'react';
import { orderhistory } from '../../common/constants';

interface Order {
  _id: string;
  product: string;
  sauce: string;
  drink: string;
  status: string;
  date: string;
}

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8187/orders/getdata', {
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
      const response = await fetch(`http://localhost:8187/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') || ''
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  return (
    <div className="ml-64 p-8">
      <h1 className="text-3xl font-bold mb-8">{orderhistory.mainHeading}</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order._id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">Order #{order._id}</h3>
              <span className={`px-2 py-1 rounded ${order.status === 'completed' ? 'bg-green-100' :
                order.status === 'rejected' ? 'bg-red-100' :
                  'bg-yellow-100'
                }`}>
                {order.status}
              </span>
            </div>
            <div className="mt-2">
              <p>{orderhistory.historyProduct} {order.product}</p>
              <p>{orderhistory.historySauces} {order.sauce}</p>
              <p>{orderhistory.historyDrink} {order.drink}</p>
              <p>{orderhistory.historyDate} {new Date(order.date).toLocaleDateString()}</p>
            </div>
            {order.status === 'pending' && (
              <div className="mt-4">
                <button
                  onClick={() => handleOrderStatus(order._id, 'completed')}
                  className="bg-green-500 text-white px-4 py-1 rounded mr-2"
                >
                  {orderhistory.completeOrder}
                </button>
                <button
                  onClick={() => handleOrderStatus(order._id, 'rejected')}
                  className="bg-red-500 text-white px-4 py-1 rounded"
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