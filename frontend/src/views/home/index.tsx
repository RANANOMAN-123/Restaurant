import React, { useState, useEffect , useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { homePage } from '../../common/constants';
import { API_ENDPOINTS } from '../../config/api.config';

interface Product {
    _id: string;
    name: string;
    description: string;
    imageUrl: string;
}

interface ProductCounts {
    [key: string]: number;
}

const HomePage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [productCounts, setProductCounts] = useState<ProductCounts>({});
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
            if (data.success) {
                setProducts(data.products);
            }
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
            if (data.success) {
                setProductCounts(data.productCounts);
            }
        } catch (error) {
            console.error('Failed to fetch product counts:', error);
        }
    };

    const refreshData = useCallback(async () => {
        await fetchProducts();
        await fetchProductCounts();
    },[]);
    //@typescript-eslint/no-unused-vars
    useEffect(() => {
        refreshData();
    }, [refreshData]);

    return (
        <div className="ml-64 min-h-screen bg-gray-100">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-10 px-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-5xl font-bold mb-4">{homePage.homepageHeading}</h1>
                    <p className="text-xl">{homePage.newHeading}</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto py-12 px-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">{homePage.products}</h2>
                    {user.isAdmin && (
                        <button
                            onClick={() => navigate('/add-product')}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Add Product
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {products.map((item) => (
                        <div
                            key={item._id}
                            className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105 h-104"
                        >
                            <div className="h-48 overflow-hidden">
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="h-15 w-24  text-xl font-bold mb-2 text-gray-800">{item.name}</h3>
                                {user.isAdmin && (
                                    <button
                                        onClick={() => navigate(`/edit-product/${item._id}`)}
                                        className="absolute top-44 mt-8 right-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                                    >
                                        Edit
                                    </button>
                                )}
                                <p className="text-sm text-gray-700 overflow-y-auto overflow-x-hidden max-h-14">{item.description}</p>
                                <p className="text-lg font-semibold text-orange-500 mt-2">
                                    {homePage.available} {productCounts[item.name] || 0}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
