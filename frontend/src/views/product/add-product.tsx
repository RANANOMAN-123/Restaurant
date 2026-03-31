import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
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

const AddProduct = () => {
    const navigate = useNavigate();

    const handleSubmit = async (values: {
        name: string;
        imageUrl: string;
        description: string;
        availableCount: number;
        price: number;
    }, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
        try {
            const response = await fetch(API_ENDPOINTS.ADD_PRODUCT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token') || ''
                },
                body: JSON.stringify(values)
            });

            if (response.ok) {
                toast.success('Product added successfully!');
                navigate('/home');
            } else {
                toast.error('Failed to add product!');
            }
        } catch (error) {
            toast.error('Something went wrong!');
        }
        setSubmitting(false);
    };

    return (
        <div className="ml-64 p-8 bg-gray-100 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Add New Product</h1>
                <p className="text-gray-500 mt-1">Add a new item to the menu</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md max-w-2xl">
                <Formik
                    initialValues={{
                        name: '',
                        imageUrl: '',
                        description: '',
                        availableCount: 15,
                        price: 0
                    }}
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
                                    placeholder="Enter product name"
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-orange-400"
                                />
                                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
                                <Field
                                    type="text"
                                    name="imageUrl"
                                    placeholder="Enter image URL"
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-orange-400"
                                />
                                <ErrorMessage name="imageUrl" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                <Field
                                    as="textarea"
                                    name="description"
                                    placeholder="Enter product description"
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
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:border-orange-400"
                                    />
                                    <ErrorMessage name="availableCount" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">💰 Price (PKR)</label>
                                    <Field
                                        type="number"
                                        name="price"
                                        placeholder="Enter price"
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
                                {isSubmitting ? 'Adding...' : '+ Add Product'}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default AddProduct;