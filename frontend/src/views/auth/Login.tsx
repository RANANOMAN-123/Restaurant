import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../../common/constants';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { loginvalidationSchema } from '../../common/Validation-Schema';
import { API_ENDPOINTS } from '../../config/api.config';

interface LoginForm {
  email: string;
  password: string;
  confirmPassword: string;
}



const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = React.useState(false);

  const initialValues = {
    email: '',
    password: '',
    confirmPassword: '',
  };

  const handleSubmit = async (
    values: LoginForm,
    formikHelpers: FormikHelpers<LoginForm>
  ) => {
    const { setSubmitting, setErrors } = formikHelpers;

    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.jwtToken!);
        localStorage.setItem(
          'user',
          JSON.stringify({
            email: data.email,
            name: data.name,
            isAdmin: data.isAdmin,
          })
        );

        const from = location.state?.from?.pathname || '/home';
        navigate(from, { replace: true });
      } else {
        alert(data.message);
        setErrors({ email: data.message });
      }
    } catch (error) {
      // setErrors({ email: 'Login failed. Please try again.' });
      alert('Bad request');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://t3.ftcdn.net/jpg/05/89/70/46/360_F_589704609_b84XoVDaeopctL2Iz0lG4IQT86Dzm7xz.jpg')] bg-cover bg-center relative px-5">
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="bg-white bg-opacity-95 p-10 rounded-[20px] shadow-[0_15px_35px_rgba(0,0,0,0.2)] w-full max-w-[400px] relative z-10 backdrop-blur-[10px]">
        <h2 className="text-[28px] font-bold text-center text-[#2d3748] mb-2.5 shadow-sm">
          {login.welcome}
        </h2>
        <p className="text-[#718096] text-center mb-8">{login.loginHeading}</p>

        <Formik
          initialValues={initialValues}
          validationSchema={loginvalidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              <div>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full p-3 border-2 border-[#e2e8f0] rounded-[10px] text-base transition-all duration-300 bg-white bg-opacity-90 focus:outline-none focus:border-[#4299e1] focus:shadow-[0_0_0_3px_rgba(66,153,225,0.2)]"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="relative">
                <Field
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  className="w-full p-3 border-2 border-[#e2e8f0] rounded-[10px] text-base transition-all duration-300 bg-white bg-opacity-90 focus:outline-none focus:border-[#4299e1] focus:shadow-[0_0_0_3px_rgba(66,153,225,0.2)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#718096] hover:text-[#4299e1] focus:outline-none"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="relative">
                <Field
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="w-full p-3 border-2 border-[#e2e8f0] rounded-[10px] text-base transition-all duration-300 bg-white bg-opacity-90 focus:outline-none focus:border-[#4299e1] focus:shadow-[0_0_0_3px_rgba(66,153,225,0.2)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#718096] hover:text-[#4299e1] focus:outline-none"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <ErrorMessage
                name="submit"
                component="div"
                className="text-red-500 text-sm mt-1"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#4299e1] text-white border-none rounded-[10px] text-base font-semibold cursor-pointer transition-all duration-300 uppercase tracking-wider hover:bg-[#3182ce] hover:transform hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(66,153,225,0.3)]"
              >
                {login.loginButton}
              </button>
            </Form>
          )}
        </Formik>

        <p className="text-center mt-5 text-[#718096]">
          {login.signupHeading}{' '}
          <span
            onClick={() => navigate('/signup')}
            className="text-[#4299e1] cursor-pointer font-semibold hover:text-[#3182ce] hover:underline"
          >
            {login.signupButton}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;


