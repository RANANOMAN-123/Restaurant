import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../../config/api.config';

const ProfilePage = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [name, setName] = useState(user.name || '');
    const [updatingName, setUpdatingName] = useState(false);
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [updatingPassword, setUpdatingPassword] = useState(false);

    const handleNameUpdate = async () => {
        if (!name.trim()) {
            toast.error('Name cannot be empty!');
            return;
        }
        if (name === user.name) {
            toast.error('Name is same as current!');
            return;
        }
        setUpdatingName(true);
        try {
            const res = await fetch(API_ENDPOINTS.UPDATE_NAME, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token') || ''
                },
                body: JSON.stringify({ name })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Name updated successfully!');
                const updatedUser = { ...user, name };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error('Failed to update name!');
        }
        setUpdatingName(false);
    };

    const handlePasswordChange = async () => {
        if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
            toast.error('Please fill all fields!');
            return;
        }
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }
        if (passwords.newPassword === passwords.currentPassword) {
            toast.error('New password cannot be same as current!');
            return;
        }
        if (passwords.newPassword.length < 4) {
            toast.error('Password must be at least 4 characters!');
            return;
        }
        setUpdatingPassword(true);
        try {
            const res = await fetch(API_ENDPOINTS.CHANGE_PASSWORD, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token') || ''
                },
                body: JSON.stringify({
                    currentPassword: passwords.currentPassword,
                    newPassword: passwords.newPassword,
                    confirmPassword: passwords.confirmPassword
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Password changed! Logging out...');
                setTimeout(() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }, 1500);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error('Failed to change password!');
        }
        setUpdatingPassword(false);
    };

    return (
        <div className="ml-64 p-8 bg-gray-100 min-h-screen">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                <p className="text-gray-500 mt-1">Manage your account details</p>
            </div>

            <div className="grid grid-cols-2 gap-6">

                {/* Profile Info */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">👤 Account Info</h2>

                    {/* Avatar */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-lg">{user.name}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${user.isAdmin ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                {user.isAdmin ? '👑 Admin' : '👤 User'}
                            </span>
                        </div>
                    </div>

                    {/* Name Update */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:border-orange-400"
                                placeholder="Enter your name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={user.email}
                                readOnly
                                className="w-full p-3 border rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                        </div>
                        <button
                            onClick={handleNameUpdate}
                            disabled={updatingName}
                            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-semibold transition-all disabled:opacity-50"
                        >
                            {updatingName ? 'Updating...' : '💾 Update Name'}
                        </button>
                    </div>
                </div>

                {/* Password Change */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">🔒 Change Password</h2>

                    <div className="space-y-4">
                        {/* Current Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                            <div className="relative">
                                <input
                                    type={showPasswords.current ? 'text' : 'password'}
                                    value={passwords.currentPassword}
                                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-orange-400 pr-10"
                                    placeholder="Enter current password"
                                />
                                <button
                                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                    className="absolute right-3 top-3.5 text-gray-400"
                                >
                                    {showPasswords.current ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPasswords.new ? 'text' : 'password'}
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-orange-400 pr-10"
                                    placeholder="Enter new password"
                                />
                                <button
                                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                    className="absolute right-3 top-3.5 text-gray-400"
                                >
                                    {showPasswords.new ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                            <div className="relative">
                                <input
                                    type={showPasswords.confirm ? 'text' : 'password'}
                                    value={passwords.confirmPassword}
                                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-orange-400 pr-10"
                                    placeholder="Confirm new password"
                                />
                                <button
                                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                    className="absolute right-3 top-3.5 text-gray-400"
                                >
                                    {showPasswords.confirm ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handlePasswordChange}
                            disabled={updatingPassword}
                            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-semibold transition-all disabled:opacity-50"
                        >
                            {updatingPassword ? 'Updating...' : '🔒 Change Password'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;