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
import { dashboard } from '../../common/constants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Order {
  _id: string;
  product: string;
  status: string;
  date: string;
}

const Dashboard = () => {
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


  const completedOrders = orders.filter(order => order.status === 'completed');


  const ordersByDate = completedOrders.reduce((acc, order) => {
    const date = new Date(order.date).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;

    return acc;
  }, {} as Record<string, number>);


  const sortedDates = Object.keys(ordersByDate).sort((a, b) =>
    new Date(a).getTime() - new Date(b).getTime()
  );

  const orderData = {
    labels: sortedDates,
    datasets: [{
      label: 'Daily Completed Orders',
      data: sortedDates.map(date => ordersByDate[date]),
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      tension: 0.1
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Daily Order Statistics'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <div className="ml-64 p-8">
      <h1 className="text-3xl font-bold mb-8">{dashboard.dashbardHeading}</h1>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">{dashboard.totalOrders} {completedOrders.length}</h2>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="h-[400px]">
          <Line data={orderData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
