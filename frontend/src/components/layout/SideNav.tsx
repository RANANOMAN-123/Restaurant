import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { sideNav } from '../../common/constants';

const SideNav = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="sidebar-nav h-screen w-64 bg-gray-800 text-white fixed left-0 top-0 shadow-xl flex flex-col">
            
            {/* Logo Section */}
            <div className="p-6 border-b border-gray-700">
                <div className="flex items-center gap-3">
                    <span className="text-4xl">🍔</span>
                    <div>
                        <h3 className="text-xl font-bold text-orange-400">Tasty Bites</h3>
                        <p className="text-xs text-gray-400">Restaurant System</p>
                    </div>
                </div>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 p-4 space-y-2">
                <NavLink to="/home" className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-orange-500 text-white' : 'hover:bg-gray-700'}`
                }>
                    <span className="text-xl">🏠</span>
                    <span>{sideNav.home}</span>
                </NavLink>

                <NavLink to="/dashboard" className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-orange-500 text-white' : 'hover:bg-gray-700'}`
                }>
                    <span className="text-xl">📊</span>
                    <span>{sideNav.dashboard}</span>
                </NavLink>

                <NavLink to="/generate-order" className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-orange-500 text-white' : 'hover:bg-gray-700'}`
                }>
                    <span className="text-xl">🛒</span>
                    <span>{sideNav.geneateOrder}</span>
                </NavLink>

                <NavLink to="/order-history" className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-orange-500 text-white' : 'hover:bg-gray-700'}`
                }>
                    <span className="text-xl">📋</span>
                    <span>{sideNav.orderHistory}</span>
                </NavLink>

                {user.isAdmin && (
                    <NavLink to="/restock" className={({ isActive }) =>
                        `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-orange-500 text-white' : 'hover:bg-gray-700'}`
                    }>
                        <span className="text-xl">📦</span>
                        <span>Restock</span>
                    </NavLink>
                )}

                {user.isAdmin && (
                    <NavLink to="/users" className={({ isActive }) =>
                         `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-orange-500 text-white' : 'hover:bg-gray-700'}`
                    }>
                        <span className="text-xl">👥</span>
                        <span>Users</span>
                    </NavLink>
                )}

                <NavLink to="/profile" className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-orange-500 text-white' : 'hover:bg-gray-700'}`
                }>
                    <span className="text-xl">👤</span>
                    <span>Profile</span>
                </NavLink>
            </nav>

            {/* Logout at Bottom */}
            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-red-600 text-left"
                >
                    <span className="text-xl">🚪</span>
                    <span>{sideNav.logout}</span>
                </button>
            </div>
        </div>
    );
};

export default SideNav;