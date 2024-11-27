import React from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { sideNav } from '../common/constants';
const SideNav = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };
    return (
        <div className="h-screen w-64 bg-gray-700 text-white fixed left-0 top-0 shadow-lg">
            <div className="p-6">
                <h3 className="text-3xl font-bold mb-10 text-black-500">{sideNav.restaurantName}</h3>
                <nav className="space-y-6">
                    <NavLink to="/Home" className={({ isActive }) =>
                        `flex items-center p-4 rounded-lg transition-all duration-200 ${
                            isActive ? 'bg-orange-500 text-white' : 'hover:bg-gray-800'
                        }`
                    }>
                        <span className="text-lg">{sideNav.home}</span> 
                    </NavLink>
                    {user.isAdmin && (  
                        <>
                            {/* <NavLink to="/add-product" className={({ isActive }) =>
                                `flex items-center p-4 rounded-lg transition-all duration-200 ${
                                    isActive ? 'bg-orange-500 text-white' : 'hover:bg-gray-800'
                                }`
                            }>
                                <span className="text-lg">Add Product</span>
                            </NavLink> */}
                            <NavLink to="/restock" className={({ isActive }) =>
                                `flex items-center p-4 rounded-lg transition-all duration-200 ${
                                    isActive ? 'bg-orange-500 text-white' : 'hover:bg-gray-800'
                                }`
                            }>
                                <span className="text-lg">Restock</span>
                            </NavLink>
                        </>
                    )}
                    <NavLink to="/dashboard" className={({ isActive }) =>
                        `flex items-center p-4 rounded-lg transition-all duration-200 ${
                            isActive ? 'bg-orange-500 text-white' : 'hover:bg-gray-800'
                        }`
                    }>
                        <span className="text-lg">{sideNav.dashboard}</span>
                    </NavLink>
                    <NavLink to="/generate-order" className={({ isActive }) =>
                        `flex items-center p-4 rounded-lg transition-all duration-200 ${
                            isActive ? 'bg-orange-500 text-white' : 'hover:bg-gray-800'
                        }`
                    }>
                        <span className="text-lg">{sideNav.geneateOrder}</span>
                    </NavLink>
                    <NavLink to="/order-history" className={({ isActive }) =>
                        `flex items-center p-4 rounded-lg transition-all duration-200 ${
                            isActive ? 'bg-orange-500 text-white' : 'hover:bg-gray-800'
                        }`
                    }>
                        <span className="text-lg">{sideNav.orderHistory}</span>
                    </NavLink>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center p-4 rounded-lg transition-all duration-200 hover:bg-gray-800 text-left"
                    >
                        <span className="text-lg text-white-500">{sideNav.logout}</span>
                    </button>
                </nav>
            </div>
        </div>
    );
};
export default SideNav;