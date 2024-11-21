import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {signup} from '../common/constants';

interface SignupForm {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<SignupForm>({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8186/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data: AuthResponse = await response.json();
      
      if (data.success) {
        navigate('/login');
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Signup failed:', error);
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://t3.ftcdn.net/jpg/05/89/70/46/360_F_589704609_b84XoVDaeopctL2Iz0lG4IQT86Dzm7xz.jpg')] bg-cover bg-center relative px-5">
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="bg-white bg-opacity-95 p-10 rounded-[20px] shadow-[0_15px_35px_rgba(0,0,0,0.2)] w-full max-w-[400px] relative z-10 backdrop-blur-[10px]">
        <h2 className="text-[28px] font-bold text-center text-[#2d3748] mb-2.5 shadow-sm">{signup.signupHeading }</h2>
        <p className="text-[#718096] text-center mb-8">{signup.joinHeading }</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 border-2 border-[#e2e8f0] rounded-[10px] text-base transition-all duration-300 bg-white bg-opacity-90 focus:outline-none focus:border-[#4299e1] focus:shadow-[0_0_0_3px_rgba(66,153,225,0.2)]"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border-2 border-[#e2e8f0] rounded-[10px] text-base transition-all duration-300 bg-white bg-opacity-90 focus:outline-none focus:border-[#4299e1] focus:shadow-[0_0_0_3px_rgba(66,153,225,0.2)]"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 border-2 border-[#e2e8f0] rounded-[10px] text-base transition-all duration-300 bg-white bg-opacity-90 focus:outline-none focus:border-[#4299e1] focus:shadow-[0_0_0_3px_rgba(66,153,225,0.2)]"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error && (
            <div className="text-[#e53e3e] text-center mb-4 p-3 bg-[rgba(254,215,215,0.9)] rounded-lg border border-[#fc8181]">
              {error}
            </div>
          )}

          <button 
            type="submit"
            className="w-full py-3.5 bg-[#4299e1] text-white border-none rounded-[10px] text-base font-semibold cursor-pointer transition-all duration-300 uppercase tracking-wider hover:bg-[#3182ce] hover:transform hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(66,153,225,0.3)]"
          >
            {signup.signupButton }
          </button>
        </form>

        <p className="text-center mt-5 text-[#718096]">
          {signup.loginHeading }{' '}
          <span 
            onClick={() => navigate('/login')}
            className="text-[#4299e1] cursor-pointer font-semibold hover:text-[#3182ce] hover:underline"
          >
            {signup.loginButton}
          </span>
        </p>
      </div>
    </div>
  );
};
export default Signup;
