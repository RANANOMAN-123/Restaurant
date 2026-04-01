import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../config/api.config';
import toast from 'react-hot-toast';

interface Reports {
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    rejectedOrders: number;
    totalRevenue: number;
    bestSelling: { name: string; count: number }[];
    monthlyRevenue: { [key: string]: number };
    popularSauces: { name: string; count: number }[];
    popularDrinks: { name: string; count: number }[];
}

const ReportsPage = () => {
    const [reports, setReports] = useState<Reports | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchReports(); }, []);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const res = await fetch(API_ENDPOINTS.GET_REPORTS, {
                headers: { 'Authorization': localStorage.getItem('token') || '' }
            });
            const data = await res.json();
            if (data.success) setReports(data.reports);
        } catch (err) {
            toast.error('Failed to fetch reports!');
        }
        setLoading(false);
    };

    const handlePrintReport = () => {
        const reportContent = `
            <html>
            <head><title>Admin Report - Tasty Bites</title>
            <style>
                body { font-family: Arial; padding: 40px; max-width: 800px; margin: 0 auto; }
                h1 { text-align: center; color: #f97316; }
                h2 { color: #374151; border-bottom: 2px solid #f97316; padding-bottom: 8px; }
                .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 20px 0; }
                .stat { text-align: center; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; }
                .stat h3 { font-size: 32px; font-weight: bold; margin: 0; }
                .stat p { color: #666; margin: 5px 0 0 0; }
                table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                th { background: #f97316; color: white; padding: 10px; text-align: left; }
                td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
                .revenue { color: #f97316; font-weight: bold; font-size: 24px; }
            </style>
            </head>
            <body>
                <h1>🍔 Tasty Bites — Admin Report</h1>
                <p style="text-align:center;color:#666">Generated on ${new Date().toLocaleDateString()}</p>
                
                <h2>📊 Overview</h2>
                <div class="stats">
                    <div class="stat">
                        <h3>${reports?.totalOrders}</h3>
                        <p>Total Orders</p>
                    </div>
                    <div class="stat">
                        <h3 style="color:green">${reports?.completedOrders}</h3>
                        <p>Completed</p>
                    </div>
                    <div class="stat">
                        <h3 style="color:orange">${reports?.pendingOrders}</h3>
                        <p>Pending</p>
                    </div>
                    <div class="stat">
                        <h3 style="color:red">${reports?.rejectedOrders}</h3>
                        <p>Rejected</p>
                    </div>
                </div>

                <h2>💰 Total Revenue</h2>
                <p class="revenue">PKR ${reports?.totalRevenue?.toLocaleString()}</p>

                <h2>🏆 Best Selling Products</h2>
                <table>
                    <tr><th>Product</th><th>Orders</th></tr>
                    ${reports?.bestSelling.map(p => `<tr><td>${p.name}</td><td>${p.count}</td></tr>`).join('')}
                </table>

                <h2>🥫 Popular Sauces</h2>
                <table>
                    <tr><th>Sauce</th><th>Times Ordered</th></tr>
                    ${reports?.popularSauces.map(s => `<tr><td>${s.name}</td><td>${s.count}</td></tr>`).join('')}
                </table>

                <h2>🥤 Popular Drinks</h2>
                <table>
                    <tr><th>Drink</th><th>Times Ordered</th></tr>
                    ${reports?.popularDrinks.map(d => `<tr><td>${d.name}</td><td>${d.count}</td></tr>`).join('')}
                </table>
            </body>
            </html>
        `;

        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        iframe.contentDocument!.write(reportContent);
        iframe.contentDocument!.close();
        iframe.contentWindow!.print();
        setTimeout(() => document.body.removeChild(iframe), 1000);
    };

    if (loading) {
        return (
            <div className="ml-64 p-8 flex justify-center items-center h-screen">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const maxSales = reports?.bestSelling[0]?.count || 1;

    return (
        <div className="ml-64 p-8 bg-gray-100 min-h-screen">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
                    <p className="text-gray-500 mt-1">Restaurant performance overview</p>
                </div>
                <button
                    onClick={handlePrintReport}
                    className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 font-medium transition-all shadow-md"
                >
                    🖨️ Print Report
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500">
                    <p className="text-gray-500 text-sm">Total Orders</p>
                    <h2 className="text-4xl font-bold text-gray-800 mt-1">{reports?.totalOrders}</h2>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                    <p className="text-gray-500 text-sm">Completed</p>
                    <h2 className="text-4xl font-bold text-green-600 mt-1">{reports?.completedOrders}</h2>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
                    <p className="text-gray-500 text-sm">Pending</p>
                    <h2 className="text-4xl font-bold text-yellow-600 mt-1">{reports?.pendingOrders}</h2>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
                    <p className="text-gray-500 text-sm">Rejected</p>
                    <h2 className="text-4xl font-bold text-red-600 mt-1">{reports?.rejectedOrders}</h2>
                </div>
            </div>

            {/* Revenue Card */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-8 rounded-xl shadow-md mb-8">
                <p className="text-orange-100 text-lg">💰 Total Revenue (Completed Orders)</p>
                <h2 className="text-5xl font-bold mt-2">PKR {reports?.totalRevenue?.toLocaleString()}</h2>
                <p className="text-orange-100 mt-2">From {reports?.completedOrders} completed orders</p>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">

                {/* Best Selling Products */}
                <div className="bg-white rounded-xl shadow-md p-6 col-span-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">🏆 Best Selling</h3>
                    <div className="space-y-4">
                        {reports?.bestSelling.length === 0 && (
                            <p className="text-gray-400 text-center">No data yet</p>
                        )}
                        {reports?.bestSelling.map((product, index) => (
                            <div key={product.name}>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium text-gray-700">
                                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🍔'} {product.name}
                                    </span>
                                    <span className="text-sm font-bold text-orange-500">{product.count} orders</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5">
                                    <div
                                        className="bg-orange-500 h-2.5 rounded-full"
                                        style={{ width: `${(product.count / maxSales) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Popular Sauces */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">🥫 Popular Sauces</h3>
                    <div className="space-y-3">
                        {reports?.popularSauces.length === 0 && (
                            <p className="text-gray-400 text-center">No data yet</p>
                        )}
                        {reports?.popularSauces.map((sauce, index) => (
                            <div key={sauce.name} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="font-medium text-gray-700">
                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} {sauce.name}
                                </span>
                                <span className="text-sm font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-full">
                                    {sauce.count}x
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Popular Drinks */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">🥤 Popular Drinks</h3>
                    <div className="space-y-3">
                        {reports?.popularDrinks.length === 0 && (
                            <p className="text-gray-400 text-center">No data yet</p>
                        )}
                        {reports?.popularDrinks.map((drink, index) => (
                            <div key={drink.name} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="font-medium text-gray-700">
                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} {drink.name}
                                </span>
                                <span className="text-sm font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-full">
                                    {drink.count}x
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Monthly Revenue */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">📅 Monthly Revenue</h3>
                <div className="space-y-3">
                    {Object.entries(reports?.monthlyRevenue || {}).length === 0 && (
                        <p className="text-gray-400 text-center">No data yet</p>
                    )}
                    {Object.entries(reports?.monthlyRevenue || {}).map(([month, revenue]) => (
                        <div key={month} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-700">📅 {month}</span>
                            <span className="font-bold text-orange-500">PKR {revenue.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default ReportsPage;