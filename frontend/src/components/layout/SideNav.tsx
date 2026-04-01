import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { sideNav } from '../../common/constants';

const UnreadBadge = () => {
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
        const fetchCount = async () => {
            try {
                const res = await fetch(`http://localhost:8187/api/messages/unread-count`, {
                    headers: { 'Authorization': localStorage.getItem('token') || '' }
                });
                const data = await res.json();
                if (data.success) setCount(data.count);
            } catch (err) {}
        };
        fetchCount();
        const interval = setInterval(fetchCount, 30000);
        return () => clearInterval(interval);
    }, []);

    if (count === 0) return null;
    return (
        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            {count}
        </span>
    );
};

const PendingOrdersBadge = () => {
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
        const fetchCount = async () => {
            try {
                const res = await fetch(`http://localhost:8187/api/orders/getdata`, {
                    headers: { 'Authorization': localStorage.getItem('token') || '' }
                });
                const data = await res.json();
                if (data.success) {
                    const pending = data.orders.filter((o: any) => o.status === 'pending').length;
                    setCount(pending);
                }
            } catch (err) {}
        };
        fetchCount();
        const interval = setInterval(fetchCount, 30000);
        return () => clearInterval(interval);
    }, []);

    if (count === 0) return null;
    return (
        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            {count}
        </span>
    );
};

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
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">

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
                    <span className="flex-1">{sideNav.orderHistory}</span>
                    <PendingOrdersBadge />
                </NavLink>

                <NavLink to="/contact" className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-orange-500 text-white' : 'hover:bg-gray-700'}`
                }>
                    <span className="text-xl">📞</span>
                    <span>Contact</span>
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

                {user.isAdmin && (
                    <NavLink to="/messages" className={({ isActive }) =>
                        `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-orange-500 text-white' : 'hover:bg-gray-700'}`
                    }>
                        <span className="text-xl">✉️</span>
                        <span className="flex-1">Messages</span>
                        <UnreadBadge />
                    </NavLink>
                )}

                {user.isAdmin && (
                    <NavLink to="/reviews" className={({ isActive }) =>
                        `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-orange-500 text-white' : 'hover:bg-gray-700'}`
                    }>
                       <span className="text-xl">⭐</span>
                      <span>Reviews</span>
                  </NavLink>
                )}

                {user.isAdmin && (
                    <NavLink to="/reports" className={({ isActive }) =>
                        `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-orange-500 text-white' : 'hover:bg-gray-700'}`
                    }>
                        <span className="text-xl">📈</span>
                        <span>Reports</span>
                    </NavLink>
                )}

                {user.isAdmin && (
                    <NavLink to="/settings" className={({ isActive }) =>
                        `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-orange-500 text-white' : 'hover:bg-gray-700'}`
                    }>
                        <span className="text-xl">⚙️</span>
                        <span>Settings</span>
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