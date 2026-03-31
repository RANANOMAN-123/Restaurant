import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../config/api.config';
import toast from 'react-hot-toast';

interface Product {
    _id: string;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
}

interface ProductCounts {
    [key: string]: number;
}

const HomePage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [productCounts, setProductCounts] = useState<ProductCounts>({});
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const fetchProducts = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.GET_ALL_PRODUCTS, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token') || ''
                }
            });
            const data = await response.json();
            if (data.success) setProducts(data.products);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    const fetchProductCounts = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.GET_PRODUCT_COUNTS, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token') || ''
                }
            });
            const data = await response.json();
            if (data.success) setProductCounts(data.productCounts);
        } catch (error) {
            console.error('Failed to fetch product counts:', error);
        }
    };

    const refreshData = useCallback(async () => {
        setLoading(true);
        await fetchProducts();
        await fetchProductCounts();
        setLoading(false);
    }, []);

    const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
        const response = await fetch(API_ENDPOINTS.DELETE_PRODUCT(id), {
            method: 'DELETE',
            headers: { 'Authorization': localStorage.getItem('token') || '' }
        });
        const data = await response.json();
        if (data.success) {
            toast.success('Product deleted successfully!');
            refreshData();
        } else {
            toast.error('Failed to delete product!');
        }
    } catch (error) {
        toast.error('Failed to delete product!');
    }
};

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const getStockInfo = (count: number) => {
        if (count === 0) return { color: 'text-red-600', bg: 'bg-red-50', label: '⚠️ Out of Stock' };
        if (count < 5) return { color: 'text-red-500', bg: 'bg-red-50', label: `🔴 Low Stock: ${count}` };
        if (count < 10) return { color: 'text-yellow-500', bg: 'bg-yellow-50', label: `🟡 Available: ${count}` };
        return { color: 'text-green-600', bg: 'bg-green-50', label: `🟢 Available: ${count}` };
    };

    return (
        <div className="ml-64 min-h-screen bg-gray-100">

            {/* Header Banner */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-10 px-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-5xl font-bold mb-4">Welcome to Tasty Bites</h1>
                    <p className="text-xl">Experience the finest fast food delicacies</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto py-12 px-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Our Products</h2>
                        <p className="text-gray-500 mt-1">{products.length} items available</p>
                    </div>
                    {user.isAdmin && (
                        <button
                            onClick={() => navigate('/add-product')}
                            className="bg-orange-500 text-white px-5 py-2.5 rounded-lg hover:bg-orange-600 font-medium transition-all shadow-md"
                        >
                            + Add Product
                        </button>
                    )}
                </div>

                {/* Loading Spinner */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-500 font-medium">Loading products...</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {products.map((item) => {
                            const count = productCounts[item.name] || 0;
                            const stock = getStockInfo(count);
                            return (
                              <div
    key={item._id}
    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
>
    {/* Image */}
    <div className="h-48 overflow-hidden relative">
        <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
        />
        {count < 5 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                {count === 0 ? 'Out of Stock' : 'Low Stock'}
            </div>
        )}
    </div>

    {/* Content */}
    <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{item.name}</h3>
        <p className="text-sm text-gray-500 mb-3 max-h-16 overflow-y-auto overflow-x-hidden">{item.description}</p>
       <div className={`px-3 py-1.5 rounded-lg text-sm font-semibold mb-3 ${stock.color} ${stock.bg}`}>
          {stock.label}
       </div>
     <div className="px-3 py-1.5 rounded-lg text-sm font-bold text-orange-500 bg-orange-50 mb-3">
        💰 PKR {item.price}
     </div>
        {user.isAdmin && (
            <div className="flex gap-2">
                <button
                    onClick={() => navigate(`/edit-product/${item._id}`)}
                    className="flex-1 bg-blue-500 text-white px-2 py-1.5 rounded-lg hover:bg-blue-600 text-xs font-medium"
                >
                    ✏️ Edit
                </button>
                <button
                    onClick={() => handleDelete(item._id)}
                    className="flex-1 bg-red-500 text-white px-2 py-1.5 rounded-lg hover:bg-red-600 text-xs font-medium"
                >
                    🗑️ Delete
                </button>
            </div>
        )}
    </div>
</div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;