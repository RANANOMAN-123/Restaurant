import React, { useState, useEffect } from 'react';
import { homePage } from '../../common/constants';

interface ProductCounts {
  [key: string]: number;
}

const HomePage = () => {
  const [productCounts, setProductCounts] = useState<ProductCounts>({
    Pizza: 15,
    Burger: 15,
    Sandwich: 15,
    Shawarma: 15,
    Pasta: 15
  });

  useEffect(() => {
    fetchProductCounts();
  }, []);

  const fetchProductCounts = async () => {
    try {
      const response = await fetch('http://localhost:8186/orders/product-counts', {
        headers: {
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

  const foodItems = [
    {
      id: 1,
      name: 'Pizza',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
      description: 'Delicious handcrafted pizza with fresh toppings'
    },
    {
      id: 2,
      name: 'Burger',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
      description: 'Juicy burger with premium ingredients'
    },
    {
      id: 3,
      name: 'Sandwich',
      image: 'https://images.unsplash.com/photo-1529563021893-cc83c992d75d',
      description: 'Fresh and healthy sandwiches made to order'
    },
    {
      id: 4,
      name: 'Shawarma',
      image: 'https://images.unsplash.com/photo-1642783944285-b33b18ef6c3b',
      description: 'Authentic Middle Eastern shawarma'
    },
    {
      id: 5,
      name: 'Pasta',
      image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601',
      description: 'Italian pasta with homemade sauce'
    }
  ];

  return (
    <div className="ml-64 min-h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-10 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">{homePage.homepageHeading}</h1>
          <p className="text-xl">{homePage.newHeading}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-12 px-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">{homePage.products}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {foodItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2 text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
                <p className="text-lg font-semibold text-orange-500 mt-2">
                  {homePage.available} {productCounts[item.name]}
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
