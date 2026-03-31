import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../config/api.config';

const ProfilePage = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [showPasswords, setShowPasswords] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false
    });
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const toggleShow = (field: 'oldPassword' | 'newPassword' | 'confirmPassword') => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handlePasswordChange = async () => {
        if (!passwords.oldPassword || !passwords.newPassword || !passwords.confirmPassword) {
            toast.error('Please fill all fields!');
            return;
        }
        if (passwords.newPassword === passwords.oldPassword) {
            toast.error('New password cannot be same as current password!');
            return;
        }
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error('New passwords do not match!');
            return;
        }
        if (passwords.newPassword.length < 4) {
            toast.error('Password must be at least 4 characters!');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_ENDPOINTS.LOGIN.replace('/login', '/change-password')}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token') || ''
                },
                body: JSON.stringify({
                    oldPassword: passwords.oldPassword,
                    newPassword: passwords.newPassword
                })
            });
            const data = await response.json();
            if (data.success) {
                toast.success('Password changed! Please login again.');
                setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
                setTimeout(() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login');
                }, 2000);
            } else {
                toast.error(data.message || 'Failed to change password!');
            }
        } catch (error) {
            toast.error('Something went wrong!');
        }
        setLoading(false);
    };

    return (
        <div className="ml-64 p-8 bg-gray-100 min-h-screen">

            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                <p className="text-gray-500 mt-1">Manage your account details</p>
            </div>

            <div className="grid grid-cols-3 gap-6">

                {/* Profile Card */}
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    {/* Avatar */}
                    <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl text-white font-bold">
                            {user.name?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">{user.name}</h2>
                    <p className="text-gray-500 mb-4">{user.email}</p>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${user.isAdmin ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                        {user.isAdmin ? '👑 Admin' : '👤 User'}
                    </span>

                    {/* Info */}
                    <div className="mt-6 space-y-3 text-left">
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-400">Full Name</p>
                            <p className="font-medium text-gray-800">{user.name}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-400">Email Address</p>
                            <p className="font-medium text-gray-800">{user.email}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-400">Account Type</p>
                            <p className="font-medium text-gray-800">{user.isAdmin ? 'Administrator' : 'Regular User'}</p>
                        </div>
                    </div>
                </div>

                {/* Change Password */}
                <div className="bg-white rounded-xl shadow-md p-8 col-span-2">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">🔐 Change Password</h3>
                    <div className="space-y-4">

                        {/* Old Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                            <div className="relative">
                                <input
                                    type={showPasswords.oldPassword ? 'text' : 'password'}
                                    placeholder="Enter current password"
                                    value={passwords.oldPassword}
                                    onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-orange-400 pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleShow('oldPassword')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500 text-xl"
                                >
                                    {showPasswords.oldPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPasswords.newPassword ? 'text' : 'password'}
                                    placeholder="Enter new password"
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-orange-400 pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleShow('newPassword')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500 text-xl"
                                >
                                    {showPasswords.newPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                            <div className="relative">
                                <input
                                    type={showPasswords.confirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm new password"
                                    value={passwords.confirmPassword}
                                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-orange-400 pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleShow('confirmPassword')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500 text-xl"
                                >
                                    {showPasswords.confirmPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handlePasswordChange}
                            disabled={loading}
                            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-semibold transition-all disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Update Password 🔐'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;