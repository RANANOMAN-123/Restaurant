import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { addproduct } from '../../common/constants';


const validationSchema = Yup.object({
    name: Yup.string().required('Product name is required'),
    imageUrl: Yup.string().required('Image URL is required').url('Must be a valid URL'),
    description: Yup.string().required('Description is required'),
    availableCount: Yup.number()
        .required('Available count is required')
        .min(1, 'Must be at least 1')
        .integer('Must be a whole number')
});

const AddProduct = () => {
    const navigate = useNavigate();

    const handleSubmit = async (values: { 
        name: string; 
        imageUrl: string; 
        description: string;
        availableCount: number;
    }, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
        try {
            const response = await fetch('http://localhost:8187/products/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token') || ''
                },
                body: JSON.stringify(values)
            });
           
            if (response.ok) {
                navigate('/home');
            }
        } catch (error) {
            console.error('Failed to add product:', error);
        }
        setSubmitting(false);
    };

    return (
        <div className="ml-64 p-8">
            <h1 className="text-3xl font-bold mb-8">{ addproduct.newProduct}</h1>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <Formik
                    initialValues={{ 
                        name: '', 
                        imageUrl: '', 
                        description: '',
                        availableCount: 15 
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4">
                            <div>
                                <label className="block mb-2">{addproduct.productName }</label>
                                <Field
                                    type="text"
                                    name="name"
                                    className="w-full p-2 border rounded"
                                />
                                <ErrorMessage name="name" component="div" className="text-red-500" />
                            </div>
 
                             <div>
                                <label className="block mb-2">{addproduct.imageURL}</label>
                                <Field
                                    type="text"
                                    name="imageUrl"
                                    className="w-full p-2 border rounded"
                                />
                                <ErrorMessage name="imageUrl" component="div" className="text-red-500" />
                            </div>

                            <div>
                                <label className="block mb-2">{ addproduct.description}</label>
                                <Field
                                    as="textarea"
                                    name="description"
                                    className="w-full p-2 border rounded"
                                    rows="4"
                                />
                                <ErrorMessage name="description" component="div" className="text-red-500" />
                            </div>

                            <div>
                                <label className="block mb-2">{ addproduct.availableCount}</label>
                                <Field
                                    type="number"
                                    name="availableCount"
                                    className="w-full p-2 border rounded"
                                />
                                <ErrorMessage name="availableCount" component="div" className="text-red-500" />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                {addproduct.addProduct1}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default AddProduct;
