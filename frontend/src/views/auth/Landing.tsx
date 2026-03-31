import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🍔</span>
          <div>
            <h1 className="text-2xl font-bold text-orange-500">Tasty Bites</h1>
            <p className="text-xs text-gray-500">Restaurant System</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 border-2 border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 font-medium transition-all"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium transition-all"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-24 px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="max-w-xl">
            <h2 className="text-6xl font-bold mb-6 leading-tight">
              Best Fast Food <br />in Town! 🍕
            </h2>
            <p className="text-xl mb-8 text-orange-100">
              Experience the finest fast food delicacies. Fresh ingredients, quick service, and amazing taste!
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/signup')}
                className="px-8 py-4 bg-white text-orange-500 rounded-xl font-bold text-lg hover:bg-orange-50 transition-all shadow-lg"
              >
                Order Now 🛒
              </button>
              <button
                onClick={() => {
                  document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-orange-600 transition-all"
              >
                View Menu
              </button>
            </div>
          </div>
          <div className="text-[180px] hidden lg:block">
            🍔
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12 px-8 shadow-md">
        <div className="max-w-6xl mx-auto grid grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-4xl font-bold text-orange-500">500+</h3>
            <p className="text-gray-500 mt-1">Happy Customers</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-orange-500">50+</h3>
            <p className="text-gray-500 mt-1">Menu Items</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-orange-500">10+</h3>
            <p className="text-gray-500 mt-1">Years Experience</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-orange-500">4.9⭐</h3>
            <p className="text-gray-500 mt-1">Average Rating</p>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div id="menu-section" className="py-16 px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">Our Popular Menu</h2>
          <p className="text-gray-500 mt-3">Fresh and delicious food made just for you</p>
        </div>
        <div className="grid grid-cols-5 gap-6">
          {[
            { name: 'Pizza', emoji: '🍕', desc: 'Handcrafted with fresh toppings', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400' },
            { name: 'Burger', emoji: '🍔', desc: 'Juicy with premium ingredients', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
            { name: 'Sandwich', emoji: '🥪', desc: 'Fresh and healthy', img: 'https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=400' },
            { name: 'Shawarma', emoji: '🌯', desc: 'Authentic Middle Eastern', img: 'https://images.unsplash.com/photo-1642783944285-b33b18ef6c3b?w=400' },
            { name: 'Pasta', emoji: '🍝', desc: 'Italian with homemade sauce', img: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400' },
          ].map((item) => (
            <div key={item.name} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="h-40 overflow-hidden">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 text-center">
                <span className="text-3xl">{item.emoji}</span>
                <h3 className="font-bold text-gray-800 mt-1">{item.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <button
            onClick={() => navigate('/signup')}
            className="px-10 py-4 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg"
          >
            Order Now 🛒
          </button>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-gray-800 text-white py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us? 🌟</h2>
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-700 rounded-xl">
              <span className="text-5xl">⚡</span>
              <h3 className="text-xl font-bold mt-4 mb-2">Quick Service</h3>
              <p className="text-gray-400">Orders prepared and delivered in minutes</p>
            </div>
            <div className="text-center p-6 bg-gray-700 rounded-xl">
              <span className="text-5xl">🌿</span>
              <h3 className="text-xl font-bold mt-4 mb-2">Fresh Ingredients</h3>
              <p className="text-gray-400">All food made with fresh daily ingredients</p>
            </div>
            <div className="text-center p-6 bg-gray-700 rounded-xl">
              <span className="text-5xl">💰</span>
              <h3 className="text-xl font-bold mt-4 mb-2">Best Prices</h3>
              <p className="text-gray-400">Affordable prices without compromising quality</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-gray-400 py-8 px-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-2xl">🍔</span>
          <span className="text-white font-bold text-xl">Tasty Bites</span>
        </div>
        <p>© 2026 Tasty Bites. All rights reserved.</p>
      </div>

    </div>
  );
};

export default LandingPage;