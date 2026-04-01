import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../../config/api.config';

interface Message {
    _id: string;
    message: string;
    reply?: string;
    repliedAt?: string;
    date: string;
    sender?: string;
}

const ContactPage = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [myMessages, setMyMessages] = useState<Message[]>([]);

    useEffect(() => {
        if (user.email) fetchMyMessages();
    }, []);

    const fetchMyMessages = async () => {
        try {
            const res = await fetch(API_ENDPOINTS.GET_MESSAGES_BY_EMAIL(user.email));
            const data = await res.json();
            if (data.success) setMyMessages(data.messages);
        } catch (err) {
            console.error('Failed to fetch messages');
        }
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.email || !formData.message) {
            toast.error('Please fill all fields!');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(API_ENDPOINTS.SEND_MESSAGE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Message sent successfully!');
                setSubmitted(true);
                setFormData({ name: user.name || '', email: user.email || '', message: '' });
                fetchMyMessages();
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error('Failed to send message!');
        }
        setLoading(false);
    };

    return (
        <div className="ml-64 p-8 bg-gray-100 min-h-screen">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Contact Us</h1>
                <p className="text-gray-500 mt-1">We'd love to hear from you!</p>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">

                {/* Contact Info */}
                <div className="space-y-4">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center gap-4">
                            <span className="text-4xl">📍</span>
                            <div>
                                <h3 className="font-bold text-gray-800">Address</h3>
                                <p className="text-gray-500 text-sm mt-1">123 Food Street, Lahore, Pakistan</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center gap-4">
                            <span className="text-4xl">📞</span>
                            <div>
                                <h3 className="font-bold text-gray-800">Phone</h3>
                                <p className="text-gray-500 text-sm mt-1">+92 300 1234567</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center gap-4">
                            <span className="text-4xl">📧</span>
                            <div>
                                <h3 className="font-bold text-gray-800">Email</h3>
                                <p className="text-gray-500 text-sm mt-1">info@tastybites.com</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center gap-4">
                            <span className="text-4xl">🕐</span>
                            <div>
                                <h3 className="font-bold text-gray-800">Hours</h3>
                                <p className="text-gray-500 text-sm mt-1">Mon-Sat: 9AM - 10PM</p>
                                <p className="text-gray-500 text-sm">Sun: 11AM - 8PM</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="col-span-2 bg-white rounded-xl shadow-md p-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">📝 Send us a Message</h2>

                    {submitted && (
                        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-6 text-center">
                            ✅ Message sent! Check "My Messages" below for replies.
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-orange-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    readOnly
                                    className="w-full p-3 border rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                            <textarea
                                placeholder="Write your message here..."
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                rows={6}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:border-orange-400 resize-none"
                            />
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-semibold transition-all disabled:opacity-50"
                        >
                            {loading ? 'Sending...' : '📤 Send Message'}
                        </button>
                    </div>
                </div>
            </div>

            {/* My Messages Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">📬 My Messages</h2>
                {myMessages.length === 0 ? (
                    <p className="text-center text-gray-400 py-4">No messages yet — send your first message above! 👆</p>
                ) : (
                    <div className="space-y-4">
                        {myMessages.map(msg => (
                            <div key={msg._id} className={`border rounded-xl p-4 ${msg.sender === 'admin' ? 'border-blue-200 bg-blue-50' : ''}`}>
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        {msg.sender === 'admin' ? (
                                            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">👑 Admin Message</span>
                                        ) : (
                                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">📝 Your Message</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400">📅 {new Date(msg.date).toLocaleDateString()}</p>
                                    {msg.sender === 'user' && (
                                        msg.reply ? (
                                            <span className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full">✅ Replied</span>
                                        ) : (
                                            <span className="bg-yellow-100 text-yellow-600 text-xs px-2 py-0.5 rounded-full">⏳ Pending</span>
                                        )
                                    )}
                                </div>

                                {/* Message Content */}
                                <div className={`p-3 rounded-lg mb-3 ${msg.sender === 'admin' ? 'bg-blue-100' : 'bg-gray-50'}`}>
                                    <p className="text-xs text-gray-500 mb-1">
                                        {msg.sender === 'admin' ? '👑 Admin:' : 'Your message:'}
                                    </p>
                                    <p className="text-gray-700">{msg.message}</p>
                                </div>

                                {/* Admin Reply to user message */}
                                {msg.sender === 'user' && msg.reply && (
                                    <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                                        <p className="text-xs text-blue-500 mb-1">
                                            ↩️ Admin Reply — {msg.repliedAt ? new Date(msg.repliedAt).toLocaleDateString() : ''}
                                        </p>
                                        <p className="text-gray-700">{msg.reply}</p>
                                    </div>
                                )}

                                {/* Pending reply */}
                                {msg.sender === 'user' && !msg.reply && (
                                    <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                                        <p className="text-xs text-yellow-600">⏳ Waiting for admin reply...</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactPage;