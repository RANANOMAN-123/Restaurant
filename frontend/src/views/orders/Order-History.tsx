import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../config/api.config';

interface Order {
  _id: string;
  product: string;
  sauce: string;
  drink: string;
  status: string;
  date: string;
  userName?: string;
  price?: number;
}

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

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

  const handlePrint = (order: Order) => {
    const receiptContent = `
        <html>
        <head><title>Receipt</title>
        <style>
            body { font-family: Arial; padding: 40px; max-width: 500px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 20px; }
            .header h1 { font-size: 28px; font-weight: bold; margin: 8px 0; }
            .header p { color: #666; font-size: 14px; }
            .row { display: flex; justify-content: space-between; margin: 10px 0; font-size: 16px; }
            .divider { border-top: 2px dashed #ccc; margin: 15px 0; }
            .center { text-align: center; }
            .receipt-title { text-align: center; font-size: 22px; font-weight: bold; margin-bottom: 16px; }
            .section-title { font-weight: bold; font-size: 18px; margin-bottom: 12px; }
            .total { font-size: 20px; font-weight: bold; }
            .total-amount { color: #f97316; font-size: 20px; font-weight: bold; }
            .status-wrap { text-align: center; margin: 20px 0; }
            .status { padding: 8px 24px; border-radius: 20px; font-size: 16px; font-weight: bold; text-transform: uppercase; }
            .footer { text-align: center; color: #999; margin-top: 20px; font-size: 14px; }
        </style>
        </head>
        <body>
            <div class="header">
                <div style="font-size:60px">🍔</div>
                <h1>Tasty Bites</h1>
                <p>Restaurant System</p>
            </div>
            <div class="divider"></div>
            <div class="receipt-title">ORDER RECEIPT</div>
            <div class="row"><span style="color:#666">Order ID:</span><strong>#${order._id.slice(-8).toUpperCase()}</strong></div>
            <div class="row"><span style="color:#666">Date:</span><span>${new Date(order.date).toLocaleDateString()}</span></div>
            <div class="row"><span style="color:#666">Time:</span><span>${new Date(order.date).toLocaleTimeString()}</span></div>
            ${order.userName ? `<div class="row"><span style="color:#666">Customer:</span><span>${order.userName}</span></div>` : ''}
            <div class="divider"></div>
            <div class="section-title">ORDER DETAILS</div>
            <div class="row"><span style="color:#666">🍔 Product:</span><strong>${order.product}</strong></div>
            <div class="row"><span style="color:#666">🥫 Sauce:</span><span>${order.sauce}</span></div>
            <div class="row"><span style="color:#666">🥤 Drink:</span><span>${order.drink}</span></div>
            <div class="divider"></div>
            <div class="row"><span class="total">💰 Total Amount:</span><span class="total-amount">PKR ${order.price || 0}</span></div>
            <div class="divider"></div>
            <div class="status-wrap">
                <p style="color:#666; margin-bottom:8px">Order Status</p>
                <span class="status" style="
                    background: ${order.status === 'completed' ? '#dcfce7' : order.status === 'rejected' ? '#fee2e2' : '#fef9c3'};
                    color: ${order.status === 'completed' ? '#15803d' : order.status === 'rejected' ? '#b91c1c' : '#854d0e'};
                ">${order.status}</span>
            </div>
            <div class="footer">
                <p>Thank you for choosing Tasty Bites! 🍔</p>
                <p>Visit us again!</p>
            </div>
        </body>
        </html>
    `;

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    iframe.contentDocument!.write(receiptContent);
    iframe.contentDocument!.close();
    iframe.contentWindow!.print();
    setTimeout(() => document.body.removeChild(iframe), 1000);
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
        <p className="text-gray-500 mt-1">
          {user.isAdmin ? 'Manage all orders' : 'Track your orders'}
        </p>
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
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor(order.status)}`}>
                  {order.status}
                </span>
                <button
                  onClick={() => handlePrint(order)}
                  className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm font-medium transition-all"
                >
                  🖨️ Print
                </button>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-5 gap-4 text-sm text-gray-600">
              <p>🍔 <span className="font-medium">{order.product}</span></p>
              <p>🥫 {order.sauce}</p>
              <p>🥤 {order.drink}</p>
              <p>📅 {new Date(order.date).toLocaleDateString()}</p>
              <p>💰 <span className="font-medium text-orange-500">PKR {order.price || 0}</span></p>
            </div>
            {user.isAdmin && order.userName && (
              <p className="mt-2 text-xs text-gray-400">👤 Ordered by: {order.userName}</p>
            )}
            {order.status === 'pending' && user.isAdmin && (
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