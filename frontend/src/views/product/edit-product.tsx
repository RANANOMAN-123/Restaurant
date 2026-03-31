import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { API_ENDPOINTS } from '../../config/api.config';
import toast from 'react-hot-toast';

const validationSchema = Yup.object({
    name: Yup.string().required('Product name is required'),
    imageUrl: Yup.string().required('Image URL is required').url('Must be a valid URL'),
    description: Yup.string().required('Description is required'),
    availableCount: Yup.number()
        .required('Available count is required')
        .min(1, 'Must be at least 1')
        .integer('Must be a whole number'),
    price: Yup.number()
        .required('Price is required')
        .min(1, 'Price must be at least 1')
});

interface Product {
    name: string;
    imageUrl: string;
    description: string;
    availableCount: number;
    price: number;
}

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState<Product>({
        name: '',
        imageUrl: '',
        description: '',
        availableCount: 0,
        price: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.GET_PRODUCT(id!), {
                    headers: {
                        'Authorization': localStorage.getItem('token') || ''
                    }
                });

                if (response.status === 403) {
                    toast.error('Unauthorized: Admin access required');
                    navigate('/home');
                    return;
                }

                const data = await response.json();
                if (data.success) {
                    setInitialValues({
                        name: data.product.name,
                        imageUrl: data.product.imageUrl,
                        description: data.product.description,
                        availableCount: data.product.availableCount,
                        price: data.product.price || 0
                    });
                } else {
                    toast.error('Failed to fetch product details');
                    navigate('/home');
                }
            } catch (error) {
                console.error('Failed to fetch product:', error);
                navigate('/home');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id, navigate]);

    const handleSubmit = async (
        values: Product,
        { setSubmitting }: FormikHelpers<Product>
    ) => {
        try {
            const response = await fetch(API_ENDPOINTS.UPDATE_PRODUCT(id!), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token') || '',
                },
                body: JSON.stringify(values),
            });

            if (response.status === 403) {
                toast.error('Unauthorized: Admin access required');
                navigate('/home');
                return;
            }

            if (response.ok) {
                toast.success('Product updated successfully!');
                navigate('/home');
            } else {
                toast.error('Failed to update product.');
            }
        } catch (error) {
            toast.error('Something went wrong!');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="ml-64 p-8 flex justify-center items-center h-screen">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="ml-64 p-8 bg-gray-100 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>
                <p className="text-gray-500 mt-1">Update product details</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md max-w-2xl">
                <Formik
                    initialValues={initialValues}
                    enableReinitialize
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                                <Field
                                    type="text"
                                    name="name"
                                    id="name"
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-orange-400"
                                />
                                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
                                <Field
                                    type="text"
                                    name="imageUrl"
                                    id="imageUrl"
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-orange-400"
                                />
                                <ErrorMessage name="imageUrl" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                <Field
                                    as="textarea"
                                    name="description"
                                    id="description"
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-orange-400"
                                    rows="4"
                                />
                                <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Available Count</label>
                                    <Field
                                        type="number"
                                        name="availableCount"
                                        id="availableCount"
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:border-orange-400"
                                    />
                                    <ErrorMessage name="availableCount" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">💰 Price (PKR)</label>
                                    <Field
                                        type="number"
                                        name="price"
                                        id="price"
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:border-orange-400"
                                    />
                                    <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-semibold transition-all"
                            >
                                {isSubmitting ? 'Updating...' : 'Update Product'}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default EditProduct;