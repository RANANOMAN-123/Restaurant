import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../../config/api.config';

interface Review {
    _id: string;
    userName: string;
    productName: string;
    rating: number;
    comment: string;
    date: string;
}

const ReviewsPage = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchReviews(); }, []);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await fetch(API_ENDPOINTS.GET_ALL_REVIEWS, {
                headers: { 'Authorization': localStorage.getItem('token') || '' }
            });
            const data = await res.json();
            if (data.success) setReviews(data.reviews);
        } catch (err) {
            toast.error('Failed to fetch reviews!');
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this review?')) return;
        try {
            const res = await fetch(API_ENDPOINTS.DELETE_REVIEW(id), {
                method: 'DELETE',
                headers: { 'Authorization': localStorage.getItem('token') || '' }
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Review deleted!');
                fetchReviews();
            }
        } catch (err) {
            toast.error('Failed to delete review!');
        }
    };

    const renderStars = (rating: number) => {
        return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : '0';

    return (
        <div className="ml-64 p-8 bg-gray-100 min-h-screen">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Reviews</h1>
                <p className="text-gray-500 mt-1">Customer product reviews</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500">
                    <p className="text-gray-500 text-sm">Total Reviews</p>
                    <h2 className="text-4xl font-bold text-gray-800 mt-1">{reviews.length}</h2>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
                    <p className="text-gray-500 text-sm">Average Rating</p>
                    <h2 className="text-4xl font-bold text-yellow-600 mt-1">⭐ {avgRating}</h2>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                    <p className="text-gray-500 text-sm">5 Star Reviews</p>
                    <h2 className="text-4xl font-bold text-green-600 mt-1">
                        {reviews.filter(r => r.rating === 5).length}
                    </h2>
                </div>
            </div>

            {/* Reviews List */}
            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.length === 0 && (
                        <div className="bg-white p-8 rounded-xl text-center text-gray-400">
                            No reviews yet
                        </div>
                    )}
                    {reviews.map(review => (
                        <div key={review._id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                                        {review.userName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">{review.userName}</h3>
                                        <p className="text-sm text-gray-500">🍔 {review.productName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</span>
                                    <button
                                        onClick={() => handleDelete(review._id)}
                                        className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-xs font-medium"
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                            <div className="mt-3">
                                <span className="text-xl">{renderStars(review.rating)}</span>
                                <span className="ml-2 text-sm text-gray-500">({review.rating}/5)</span>
                            </div>
                            {review.comment && (
                                <div className="mt-3 bg-gray-50 p-3 rounded-lg">
                                    <p className="text-gray-700">{review.comment}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewsPage;