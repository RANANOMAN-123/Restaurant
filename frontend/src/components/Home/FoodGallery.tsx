import React from 'react';

const FoodGallery = () => {
  const foodItems = [
    { name: 'Pizza', image: '/images/pizza.jpg' },
    { name: 'Burger', image: '/images/burger.jpg' },
    { name: 'Sandwich', image: '/images/sandwich.jpg' },
    { name: 'Shawarma', image: '/images/shawarma.jpg' },
    { name: 'Nuggets', image: '/images/nuggets.jpg' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {foodItems.map((item, index) => (
        <div key={index} className="relative group overflow-hidden rounded-lg shadow-lg">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-64 object-cover transform transition-transform group-hover:scale-110"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black p-4">
            <h3 className="text-white text-xl font-bold">{item.name}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FoodGallery;
