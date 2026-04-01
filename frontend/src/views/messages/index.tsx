import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../../config/api.config';

interface Message {
    _id: string;
    name: string;
    email: string;
    message: string;
    isRead: boolean;
    date: string;
    reply?: string;
    repliedAt?: string;
}

const MessagesPage = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [showNewMessage, setShowNewMessage] = useState(false);
    const [users, setUsers] = useState<{_id: string, name: string, email: string}[]>([]);
    const [newMsg, setNewMsg] = useState({ receiverEmail: '', message: '' });
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchMessages();
        fetchUsers();
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const res = await fetch(API_ENDPOINTS.GET_ALL_MESSAGES, {
                headers: { 'Authorization': localStorage.getItem('token') || '' }
            });
            const data = await res.json();
            if (data.success) setMessages(data.messages);
        } catch (err) {
            toast.error('Failed to fetch messages!');
        }
        setLoading(false);
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch(API_ENDPOINTS.GET_MESSAGE_USERS, {
                headers: { 'Authorization': localStorage.getItem('token') || '' }
            });
            const data = await res.json();
            if (data.success) setUsers(data.users);
        } catch (err) {}
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            const res = await fetch(API_ENDPOINTS.MARK_AS_READ(id), {
                method: 'PATCH',
                headers: { 'Authorization': localStorage.getItem('token') || '' }
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Marked as read!');
                fetchMessages();
            }
        } catch (err) {
            toast.error('Failed to mark as read!');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this message?')) return;
        try {
            const res = await fetch(API_ENDPOINTS.DELETE_MESSAGE(id), {
                method: 'DELETE',
                headers: { 'Authorization': localStorage.getItem('token') || '' }
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Message deleted!');
                fetchMessages();
            }
        } catch (err) {
            toast.error('Failed to delete message!');
        }
    };

    const handleReply = async (id: string) => {
        if (!replyText[id]?.trim()) {
            toast.error('Reply cannot be empty!');
            return;
        }
        try {
            const res = await fetch(API_ENDPOINTS.REPLY_MESSAGE(id), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token') || ''
                },
                body: JSON.stringify({ reply: replyText[id] })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Reply sent!');
                setReplyingTo(null);
                setReplyText({ ...replyText, [id]: '' });
                fetchMessages();
            }
        } catch (err) {
            toast.error('Failed to send reply!');
        }
    };

    const handleSendToUser = async () => {
        if (!newMsg.receiverEmail || !newMsg.message.trim()) {
            toast.error('Please fill all fields!');
            return;
        }
        setSending(true);
        try {
            const res = await fetch(API_ENDPOINTS.SEND_MESSAGE_TO_USER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token') || ''
                },
                body: JSON.stringify(newMsg)
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Message sent to user!');
                setShowNewMessage(false);
                setNewMsg({ receiverEmail: '', message: '' });
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error('Failed to send message!');
        }
        setSending(false);
    };

    const unreadCount = messages.filter(m => !m.isRead).length;

    return (
        <div className="ml-64 p-8 bg-gray-100 min-h-screen">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Messages</h1>
                    <p className="text-gray-500 mt-1">Customer contact messages</p>
                </div>
                <div className="flex gap-3">
                    {unreadCount > 0 && (
                        <div className="bg-orange-500 text-white px-4 py-2 rounded-full font-medium">
                            🔴 {unreadCount} Unread
                        </div>
                    )}
                    <button
                        onClick={() => setShowNewMessage(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-medium"
                    >
                        ✉️ New Message
                    </button>
                </div>
            </div>

            {/* New Message Modal */}
            {showNewMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">✉️ Send Message to User</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Select User</label>
                                <select
                                    value={newMsg.receiverEmail}
                                    onChange={(e) => setNewMsg({ ...newMsg, receiverEmail: e.target.value })}
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-orange-400"
                                >
                                    <option value="">Select a user...</option>
                                    {users.map(user => (
                                         <option key={user._id} value={user.email}>{user.name} ({user.email})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                                <textarea
                                    placeholder="Write your message..."
                                    value={newMsg.message}
                                    onChange={(e) => setNewMsg({ ...newMsg, message: e.target.value })}
                                    rows={5}
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-orange-400 resize-none"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleSendToUser}
                                    disabled={sending}
                                    className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-semibold disabled:opacity-50"
                                >
                                    {sending ? 'Sending...' : '📤 Send Message'}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowNewMessage(false);
                                        setNewMsg({ receiverEmail: '', message: '' });
                                    }}
                                    className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-lg hover:bg-gray-200 font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500">
                    <p className="text-gray-500 text-sm">Total Messages</p>
                    <h2 className="text-4xl font-bold text-gray-800 mt-1">{messages.length}</h2>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
                    <p className="text-gray-500 text-sm">Unread</p>
                    <h2 className="text-4xl font-bold text-red-600 mt-1">{unreadCount}</h2>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                    <p className="text-gray-500 text-sm">Replied</p>
                    <h2 className="text-4xl font-bold text-green-600 mt-1">
                        {messages.filter(m => m.reply).length}
                    </h2>
                </div>
            </div>

            {/* Messages List */}
            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="space-y-4">
                    {messages.length === 0 && (
                        <div className="bg-white p-8 rounded-xl text-center text-gray-400">
                            No messages yet
                        </div>
                    )}
                    {messages.map(msg => (
                        <div key={msg._id} className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border-l-4 ${msg.isRead ? 'border-gray-200' : 'border-orange-500'}`}>

                            {/* Message Header */}
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                                        {msg.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">
                                            {msg.name}
                                            {!msg.isRead && (
                                                <span className="ml-2 bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full">New</span>
                                            )}
                                            {msg.reply && (
                                                <span className="ml-2 bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full">Replied</span>
                                            )}
                                        </h3>
                                        <p className="text-sm text-gray-500">{msg.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400">{new Date(msg.date).toLocaleDateString()}</span>
                                    {!msg.isRead && (
                                        <button
                                            onClick={() => handleMarkAsRead(msg._id)}
                                            className="px-3 py-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 text-xs font-medium"
                                        >
                                            ✅ Mark Read
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setReplyingTo(replyingTo === msg._id ? null : msg._id)}
                                        className="px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 text-xs font-medium"
                                    >
                                        💬 {msg.reply ? 'Edit Reply' : 'Reply'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(msg._id)}
                                        className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-xs font-medium"
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>

                            {/* Message Content */}
                            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-700">{msg.message}</p>
                            </div>

                            {/* Existing Reply */}
                            {msg.reply && (
                                <div className="mt-3 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                                    <p className="text-xs text-blue-500 font-medium mb-1">
                                        ↩️ Admin Reply — {msg.repliedAt ? new Date(msg.repliedAt).toLocaleDateString() : ''}
                                    </p>
                                    <p className="text-gray-700">{msg.reply}</p>
                                </div>
                            )}

                            {/* Reply Box */}
                            {replyingTo === msg._id && (
                                <div className="mt-4 space-y-3">
                                    <textarea
                                        placeholder="Write your reply..."
                                        value={replyText[msg._id] || msg.reply || ''}
                                        onChange={(e) => setReplyText({ ...replyText, [msg._id]: e.target.value })}
                                        rows={3}
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:border-orange-400 resize-none"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleReply(msg._id)}
                                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm font-medium"
                                        >
                                            📤 Send Reply
                                        </button>
                                        <button
                                            onClick={() => setReplyingTo(null)}
                                            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm font-medium"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MessagesPage;