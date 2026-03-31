import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../../config/api.config';

interface User {
    _id: string;
    name: string;
    email: string;
    isAdmin: boolean;
}

const UsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_ENDPOINTS.GET_ALL_USERS, {
                headers: { 'Authorization': localStorage.getItem('token') || '' }
            });
            const data = await response.json();
            if (data.success) setUsers(data.users);
        } catch (error) {
            toast.error('Failed to fetch users!');
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            const response = await fetch(API_ENDPOINTS.DELETE_USER(id), {
                method: 'DELETE',
                headers: { 'Authorization': localStorage.getItem('token') || '' }
            });
            const data = await response.json();
            if (data.success) {
                toast.success('User deleted successfully!');
                fetchUsers();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to delete user!');
        }
    };

    const handleMakeAdmin = async (id: string, isAdmin: boolean) => {
        const msg = isAdmin ? 'Remove admin access?' : 'Make this user Admin?';
        if (!window.confirm(msg)) return;
        try {
            const response = await fetch(API_ENDPOINTS.MAKE_ADMIN(id), {
                method: 'PATCH',
                headers: { 'Authorization': localStorage.getItem('token') || '' }
            });
            const data = await response.json();
            if (data.success) {
                toast.success(data.message);
                fetchUsers();
            } else {
                toast.error('Failed to update user!');
            }
        } catch (error) {
            toast.error('Failed to update user!');
        }
    };

    return (
        <div className="ml-64 p-8 bg-gray-100 min-h-screen">

            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
                <p className="text-gray-500 mt-1">Manage all registered users</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500">
                    <p className="text-gray-500 text-sm">Total Users</p>
                    <h2 className="text-4xl font-bold text-gray-800 mt-1">{users.length}</h2>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                    <p className="text-gray-500 text-sm">Admins</p>
                    <h2 className="text-4xl font-bold text-blue-600 mt-1">
                        {users.filter(u => u.isAdmin).length}
                    </h2>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                    <p className="text-gray-500 text-sm">Regular Users</p>
                    <h2 className="text-4xl font-bold text-green-600 mt-1">
                        {users.filter(u => !u.isAdmin).length}
                    </h2>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left p-4 text-gray-600 font-semibold">#</th>
                            <th className="text-left p-4 text-gray-600 font-semibold">User</th>
                            <th className="text-left p-4 text-gray-600 font-semibold">Email</th>
                            <th className="text-left p-4 text-gray-600 font-semibold">Role</th>
                            <th className="text-left p-4 text-gray-600 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="text-center p-8 text-gray-400">
                                    <div className="flex justify-center">
                                        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            users.map((user, index) => (
                                <tr key={user._id} className="border-b hover:bg-gray-50 transition-all">
                                    <td className="p-4 text-gray-500">{index + 1}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                                                <span className="text-white font-bold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">{user.name}</p>
                                                {user.email === currentUser.email && (
                                                    <span className="text-xs text-orange-500">You</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.isAdmin ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {user.isAdmin ? '👑 Admin' : '👤 User'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {user.email !== currentUser.email ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleMakeAdmin(user._id, user.isAdmin)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${user.isAdmin ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-orange-100 text-orange-600 hover:bg-orange-200'}`}
                                                >
                                                    {user.isAdmin ? '⬇️ Remove Admin' : '👑 Make Admin'}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-100 text-red-600 hover:bg-red-200 transition-all"
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400">No actions</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersPage;