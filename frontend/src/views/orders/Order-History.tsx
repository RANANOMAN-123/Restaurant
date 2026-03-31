import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../config/api.config';

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
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_ORDERS, {
        headers: { 'Authorization': localStorage.getItem('token') || '' }
      });
      const data = await response.json();
      if (data.success) setOrders(data.orders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const handleOrderStatus = async (orderId: string, status: 'completed' | 'rejected') => {
    try {
      const response = await fetch(API_ENDPOINTS.UPDATE_ORDER_STATUS(orderId), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') || ''
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) fetchOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const filteredOrders = orders
    .filter(o => filter === 'all' ? true : o.status === filter)
    .filter(o => o.product.toLowerCase().includes(search.toLowerCase()));

  const statusColor = (status: string) => {
    if (status === 'completed') return 'bg-green-100 text-green-700';
    if (status === 'rejected') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div className="ml-64 p-8 bg-gray-100 min-h-screen">

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Order History</h1>
        <p className="text-gray-500 mt-1">Track and manage all orders</p>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 border rounded-lg w-64 focus:outline-none focus:border-orange-400"
        />
        <div className="flex gap-2">
          {['all', 'pending', 'completed', 'rejected'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg capitalize font-medium transition-all ${
                filter === f
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-orange-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 && (
          <div className="bg-white p-8 rounded-xl text-center text-gray-400">
            No orders found
          </div>
        )}
        {filteredOrders.map(order => (
          <div key={order._id} className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-700">
                Order #{order._id.slice(-8).toUpperCase()}
              </h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-4 text-sm text-gray-600">
              <p>🍔 <span className="font-medium">{order.product}</span></p>
              <p>🥫 {order.sauce}</p>
              <p>🥤 {order.drink}</p>
              <p>📅 {new Date(order.date).toLocaleDateString()}</p>
            </div>
            {order.status === 'pending' && (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleOrderStatus(order._id, 'completed')}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm font-medium"
                >
                  ✅ Complete
                </button>
                <button
                  onClick={() => handleOrderStatus(order._id, 'rejected')}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm font-medium"
                >
                  ❌ Reject
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