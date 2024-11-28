import * as Yup from 'yup';

export const loginvalidationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
});
  

export const signupvalidationSchema = Yup.object({
    name: Yup.string()
      .required('Name is required')
      .min(3, 'Name must be at least 3 characters'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(4, 'Password must be at least 4 characters'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required')
});
  

export  const addproductvalidationSchema = Yup.object({
  name: Yup.string().required('Product name is required'),
  imageUrl: Yup.string().required('Image URL is required').url('Must be a valid URL'),
  description: Yup.string().required('Description is required'),
  availableCount: Yup.number()
      .required('Available count is required')
      .min(1, 'Must be at least 1')
      .integer('Must be a whole number')
});