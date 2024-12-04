import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { restock } from '../../common/constants';
import { API_ENDPOINTS } from '../../config/api.config';

interface Product {
    _id: string;
    name: string;
    description: string;
    imageUrl: string;
    availableCount: number;
}

const RestockPage = () => {
    const [zeroStockProducts, setZeroStockProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetchZeroStockProducts();
    }, []);

    const fetchZeroStockProducts = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.GET_ZERO_STOCK, {
                headers: {
                    'Authorization': localStorage.getItem('token') || ''
                }
            });
            const data = await response.json();
            if (data.success) {
                setZeroStockProducts(data.products);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    const handleUpdateCount = async (productId: string, newCount: number) => {
        try {
            const response = await fetch(`http://localhost:8187/products/${productId}/update-count`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token') || ''
                },
                body: JSON.stringify({ availableCount: newCount })
            });
            if (response.ok) {
                fetchZeroStockProducts();
            }
        } catch (error) {
            console.error('Failed to update count:', error);
        }
    };

    return (
        <div className="ml-64 p-8">
            <h1 className="text-3xl font-bold mb-8">{restock.restockProducts }</h1>
            <div className="grid gap-6">
                {zeroStockProducts.map(product => (
                    <div key={product._id} className="bg-white p-6 rounded-lg shadow-lg">
                        <div className="flex gap-4">
                            <img 
                                src={product.imageUrl} 
                                alt={product.name} 
                                className="w-32 h-32 object-cover rounded"
                            />
                            <div className="flex-1">
                                <h2 className="text-xl font-bold">{product.name}</h2>
                                <p className="text-gray-600">{product.description}</p>
                                <Formik
                                    initialValues={{ count: 0 }}
                                    onSubmit={(values) => handleUpdateCount(product._id, values.count)}
                                >
                                    <Form className="mt-4 flex gap-4">
                                        <Field
                                            type="number"
                                            name="count"
                                             className="w-32 p-2 border rounded"
                                             min="1"
                                        />
                                        <button
                                            type="submit"
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                        >
                                            {restock.updatetock}
                                        </button>
                                    </Form>
                                </Formik>
                            </div>
                        </div>
                    </div>
                ))}
                {zeroStockProducts.length === 0 && (
                    <p className="text-center text-gray-600">{restock.noProducts }</p>
                )}
            </div>
        </div>
    );
};

export default RestockPage;
