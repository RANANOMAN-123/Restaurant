import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../config/api.config';
import toast from 'react-hot-toast';

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

interface ReviewModal {
    orderId: string;
    productName: string;
}

const StarRating = ({ rating, setRating }: { rating: number; setRating: (r: number) => void }) => {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
                <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="text-3xl transition-all"
                >
                    {star <= (hover || rating) ? '⭐' : '☆'}
                </button>
            ))}
        </div>
    );
};

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [reviewModal, setReviewModal] = useState<ReviewModal | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewedOrders, setReviewedOrders] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_ORDERS, {
        headers: { 'Authorization': localStorage.getItem('token') || '' }
      });
      const data = await response.json();
      if (data.success) {
          setOrders(data.orders);
          checkReviewedOrders(data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const checkReviewedOrders = async (orders: Order[]) => {
      const completedOrders = orders.filter(o => o.status === 'completed');
      const reviewed: string[] = [];
      for (const order of completedOrders) {
          try {
              const res = await fetch(API_ENDPOINTS.CHECK_REVIEWED(order._id), {
                  headers: { 'Authorization': localStorage.getItem('token') || '' }
              });
              const data = await res.json();
              if (data.reviewed) reviewed.push(order._id);
          } catch (err) {}
      }
      setReviewedOrders(reviewed);
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

  const handleSubmitReview = async () => {
      if (!rating) {
          toast.error('Please select a rating!');
          return;
      }
      setSubmitting(true);
      try {
          const res = await fetch(API_ENDPOINTS.ADD_REVIEW, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': localStorage.getItem('token') || ''
              },
              body: JSON.stringify({
                  orderId: reviewModal?.orderId,
                  productName: reviewModal?.productName,
                  rating,
                  comment
              })
          });
          const data = await res.json();
          if (data.success) {
              toast.success('Review submitted!');
              setReviewModal(null);
              setRating(0);
              setComment('');
              fetchOrders();
          } else {
              toast.error(data.message);
          }
      } catch (err) {
          toast.error('Failed to submit review!');
      }
      setSubmitting(false);
  };

  const handlePrint = (order: Order) => {
    const receiptContent = `
        <html>
        <head><title>Receipt</title>
        <style>
            body { font-family: Arial; padding: 40px; max-width: 500px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 20px; }
            .row { display: flex; justify-content: space-between; margin: 10px 0; font-size: 16px; }
            .divider { border-top: 2px dashed #ccc; margin: 15px 0; }
            .center { text-align: center; }
        </style>
        </head>
        <body>
            <div class="header"><h1>🍔 Tasty Bites</h1><p>Restaurant System</p></div>
            <div class="divider"></div>
            <h2 class="center">ORDER RECEIPT</h2>
            <div class="row"><span>Order ID:</span><strong>#${order._id.slice(-8).toUpperCase()}</strong></div>
            <div class="row"><span>Date:</span><span>${new Date(order.date).toLocaleDateString()}</span></div>
            <div class="row"><span>Time:</span><span>${new Date(order.date).toLocaleTimeString()}</span></div>
            ${order.userName ? `<div class="row"><span>Customer:</span><span>${order.userName}</span></div>` : ''}
            <div class="divider"></div>
            <div class="row"><span>🍔 Product:</span><strong>${order.product}</strong></div>
            <div class="row"><span>🥫 Sauce:</span><span>${order.sauce}</span></div>
            <div class="row"><span>🥤 Drink:</span><span>${order.drink}</span></div>
            <div class="divider"></div>
            <div class="row"><strong>💰 Total:</strong><strong style="color:#f97316">PKR ${order.price || 0}</strong></div>
            <div class="divider"></div>
            <div class="center"><p>Status: <strong>${order.status.toUpperCase()}</strong></p></div>
            <div class="center" style="color:#999;margin-top:20px"><p>Thank you for choosing Tasty Bites! 🍔</p></div>
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

      {/* Review Modal */}
      {reviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">⭐ Rate Your Order</h2>
                  <p className="text-gray-500 mb-6">🍔 {reviewModal.productName}</p>

                  <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Your Rating</label>
                      <StarRating rating={rating} setRating={setRating} />
                  </div>

                  <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Comment (Optional)</label>
                      <textarea
                          placeholder="Share your experience..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          rows={4}
                          className="w-full p-3 border rounded-lg focus:outline-none focus:border-orange-400 resize-none"
                      />
                  </div>

                  <div className="flex gap-3">
                      <button
                          onClick={handleSubmitReview}
                          disabled={submitting}
                          className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-semibold disabled:opacity-50"
                      >
                          {submitting ? 'Submitting...' : '⭐ Submit Review'}
                      </button>
                      <button
                          onClick={() => { setReviewModal(null); setRating(0); setComment(''); }}
                          className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-lg hover:bg-gray-200 font-semibold"
                      >
                          Cancel
                      </button>
                  </div>
              </div>
          </div>
      )}

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
                {/* Rate Button — only for completed orders by user */}
                {order.status === 'completed' && !user.isAdmin && (
                    reviewedOrders.includes(order._id) ? (
                        <span className="px-3 py-1.5 bg-green-100 text-green-600 rounded-lg text-sm font-medium">
                            ✅ Reviewed
                        </span>
                    ) : (
                        <button
                            onClick={() => setReviewModal({ orderId: order._id, productName: order.product })}
                            className="px-3 py-1.5 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 text-sm font-medium transition-all"
                        >
                            ⭐ Rate
                        </button>
                    )
                )}
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