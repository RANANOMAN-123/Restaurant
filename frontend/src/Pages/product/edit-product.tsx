import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';

// Validation Schema
const validationSchema = Yup.object({
    name: Yup.string().required('Product name is required'),
    imageUrl: Yup.string().required('Image URL is required').url('Must be a valid URL'),
    description: Yup.string().required('Description is required'),
    availableCount: Yup.number()
        .required('Available count is required')
        .min(1, 'Must be at least 1')
        .integer('Must be a whole number'),
});

interface Product {
    name: string;
    imageUrl: string;
    description: string;
    availableCount: number;
}

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState<Product>({
        name: '',
        imageUrl: '',
        description: '',
        availableCount: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:8186/products/products/${id}`, {
                    headers: {
                        'Authorization': localStorage.getItem('token') || ''
                    }
                });

                if (response.status === 403) {
                    alert('Unauthorized: Admin access required');
                    navigate('/home');
                    return;
                }

                const data = await response.json();
                if (data.success) {
                    setInitialValues({
                        name: data.product.name,
                        imageUrl: data.product.imageUrl,
                        description: data.product.description,
                        availableCount: data.product.availableCount
                    });
                } else {
                    alert('Failed to fetch product details');
                    navigate('/home');
                }
            } catch (error) {
                console.error('Failed to fetch product:', error);
                navigate('/home');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id, navigate]);

    const handleSubmit = async (
        values: Product,
        { setSubmitting }: FormikHelpers<Product>
    ) => {
        try {
            const response = await fetch(`http://localhost:8186/products/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token') || '',
                },
                body: JSON.stringify(values),
            });

            if (response.status === 403) {
                alert('Unauthorized: Admin access required');
                navigate('/home');
                return;
            }

            if (response.ok) {
                alert('Product updated successfully!');
                navigate('/home');
            } else {
                alert('Failed to update product.');
                document.getElementById('name')?.focus();
            }
        } catch (error) {
            console.error('Failed to update product:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="ml-64 p-8">
            <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <Formik
                    initialValues={initialValues}
                    enableReinitialize
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4">
                            <div>
                                <label className="block mb-2">Product Name</label>
                                <Field
                                    type="text"
                                    name="name"
                                    id="name"
                                    className="w-full p-2 border rounded"
                                />
                                <ErrorMessage name="name" component="div" className="text-red-500" />
                            </div>

                            <div>
                                <label className="block mb-2">Image URL</label>
                                <Field
                                    type="text"
                                    name="imageUrl"
                                    id="imageUrl"
                                    className="w-full p-2 border rounded"
                                />
                                <ErrorMessage name="imageUrl" component="div" className="text-red-500" />
                            </div>

                            <div>
                                <label className="block mb-2">Description</label>
                                <Field
                                    as="textarea"
                                    name="description"
                                    id="description"
                                    className="w-full p-2 border rounded"
                                    rows="4"
                                />
                                <ErrorMessage name="description" component="div" className="text-red-500" />
                            </div>

                            <div>
                                <label className="block mb-2">Available Count</label>
                                <Field
                                    type="number"
                                    name="availableCount"
                                    id="availableCount"
                                    className="w-full p-2 border rounded"
                                />
                                <ErrorMessage name="availableCount" component="div" className="text-red-500" />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Update Product
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default EditProduct;
