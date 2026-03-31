import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { API_ENDPOINTS } from '../../config/api.config';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Order {
  _id: string;
  product: string;
  status: string;
  date: string;
}

const Dashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);

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

  const completed = orders.filter(o => o.status === 'completed');
  const pending = orders.filter(o => o.status === 'pending');
  const rejected = orders.filter(o => o.status === 'rejected');

  const ordersByDate = completed.reduce((acc, order) => {
    const date = new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedDates = Object.keys(ordersByDate).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const orderData = {
    labels: sortedDates,
    datasets: [{
      label: 'Completed Orders',
      data: sortedDates.map(date => ordersByDate[date]),
      borderColor: 'rgb(249, 115, 22)',
      backgroundColor: 'rgba(249, 115, 22, 0.2)',
      tension: 0.4,
      fill: true,
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Daily Order Statistics' }
    },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
  };

  return (
    <div className="ml-64 p-8 bg-gray-100 min-h-screen">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your restaurant performance</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <h2 className="text-4xl font-bold text-gray-800 mt-1">{orders.length}</h2>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
          <p className="text-gray-500 text-sm">Completed</p>
          <h2 className="text-4xl font-bold text-green-600 mt-1">{completed.length}</h2>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
          <p className="text-gray-500 text-sm">Pending</p>
          <h2 className="text-4xl font-bold text-yellow-600 mt-1">{pending.length}</h2>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
          <p className="text-gray-500 text-sm">Rejected</p>
          <h2 className="text-4xl font-bold text-red-600 mt-1">{rejected.length}</h2>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md w-full">
        <div className="h-[400px]">
          <Line data={orderData} options={options} />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;