import React, { useState, useEffect } from 'react';
import { doctorService } from '../../services/doctorService';
import { patientService } from '../../services/patientService';
import { Star, User, Calendar, ThumbsUp, Flag, Filter, Search } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';

const DoctorReviews = ({ doctorId, doctorName, showAddReview = false }) => {
  const [reviews, setReviews] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchReviews();
    fetchStatistics();
  }, [doctorId, filterRating, sortBy]);

  const fetchReviews = async () => {
    try {
      // Mock data - replace with actual API call
      const mockReviews = [
        {
          id: 1,
          patientName: 'John D.',
          patientInitials: 'JD',
          rating: 5,
          reviewText: 'Excellent doctor! Very thorough examination and clear explanation of my condition. Highly recommend Dr. Smith.',
          reviewDate: '2025-10-15',
          appointmentDate: '2025-10-10',
          verified: true,
          helpful: 12,
          reported: false
        },
        {
          id: 2,
          patientName: 'Sarah M.',
          patientInitials: 'SM',
          rating: 4,
          reviewText: 'Good experience overall. Doctor was professional and knowledgeable. Wait time was a bit long but worth it.',
          reviewDate: '2025-10-12',
          appointmentDate: '2025-10-08',
          verified: true,
          helpful: 8,
          reported: false
        },
        {
          id: 3,
          patientName: 'Michael R.',
          patientInitials: 'MR',
          rating: 5,
          reviewText: 'Outstanding care! Dr. Smith took time to listen to my concerns and provided excellent treatment. Very satisfied.',
          reviewDate: '2025-10-10',
          appointmentDate: '2025-10-05',
          verified: true,
          helpful: 15,
          reported: false
        }
      ];

      // Apply filters
      let filteredReviews = mockReviews;
      
      if (filterRating !== 'all') {
        filteredReviews = filteredReviews.filter(review => review.rating === parseInt(filterRating));
      }

      if (searchTerm) {
        filteredReviews = filteredReviews.filter(review => 
          review.reviewText.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.patientName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          filteredReviews.sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate));
          break;
        case 'oldest':
          filteredReviews.sort((a, b) => new Date(a.reviewDate) - new Date(b.reviewDate));
          break;
        case 'highest':
          filteredReviews.sort((a, b) => b.rating - a.rating);
          break;
        case 'lowest':
          filteredReviews.sort((a, b) => a.rating - b.rating);
          break;
        case 'helpful':
          filteredReviews.sort((a, b) => b.helpful - a.helpful);
          break;
      }

      setReviews(filteredReviews);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      // Mock statistics - replace with actual API call
      const mockStats = {
        totalReviews: 45,
        averageRating: 4.6,
        ratingDistribution: {
          5: 28,
          4: 12,
          3: 3,
          2: 1,
          1: 1
        },
        verifiedReviews: 42,
        responseRate: 85
      };
      setStatistics(mockStats);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  const handleHelpful = async (reviewId) => {
    try {
      // await doctorService.markReviewHelpful(reviewId);
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { ...review, helpful: review.helpful + 1 }
          : review
      ));
    } catch (err) {
      console.error('Error marking review as helpful:', err);
    }
  };

  const handleReport = async (reviewId) => {
    if (window.confirm('Are you sure you want to report this review?')) {
      try {
        // await doctorService.reportReview(reviewId);
        setReviews(prev => prev.map(review => 
          review.id === reviewId 
            ? { ...review, reported: true }
            : review
        ));
      } catch (err) {
        console.error('Error reporting review:', err);
      }
    }
  };

  const renderStars = (rating, size = 'sm') => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    };

    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getRatingPercentage = (rating) => {
    if (!statistics.totalReviews) return 0;
    return Math.round((statistics.ratingDistribution[rating] / statistics.totalReviews) * 100);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Star className="h-6 w-6 text-yellow-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Patient Reviews</h3>
              <p className="text-gray-600">{doctorName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {statistics.averageRating?.toFixed(1) || '0.0'}
            </div>
            <div className="flex justify-center mb-2">
              {renderStars(Math.round(statistics.averageRating || 0), 'lg')}
            </div>
            <p className="text-gray-600">
              Based on {statistics.totalReviews || 0} reviews
            </p>
            <p className="text-sm text-green-600 mt-1">
              {statistics.verifiedReviews || 0} verified reviews
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700 w-8">
                  {rating}
                </span>
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${getRatingPercentage(rating)}%` }}
                  ></div>
                </div>
                
                <span className="text-sm text-gray-600 w-12">
                  {statistics.ratingDistribution?.[rating] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>

          <div className="text-sm text-gray-500">
            {reviews.length} of {statistics.totalReviews || 0} reviews
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterRating !== 'all' 
                ? 'No matching reviews found' 
                : 'No reviews yet'
              }
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterRating !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Be the first to leave a review for this doctor'
              }
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start space-x-4">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-blue-600">
                    {review.patientInitials}
                  </span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-gray-900">{review.patientName}</h4>
                      {review.verified && (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      {new Date(review.reviewDate).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-600">
                      Appointment on {new Date(review.appointmentDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {review.reviewText}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleHelpful(review.id)}
                        className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>Helpful ({review.helpful})</span>
                      </button>
                      
                      {!review.reported && (
                        <button
                          onClick={() => handleReport(review.id)}
                          className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600"
                        >
                          <Flag className="h-4 w-4" />
                          <span>Report</span>
                        </button>
                      )}
                      
                      {review.reported && (
                        <span className="text-sm text-red-600">Reported</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More Button */}
      {reviews.length < (statistics.totalReviews || 0) && (
        <div className="text-center">
          <Button variant="outline">
            Load More Reviews
          </Button>
        </div>
      )}
    </div>
  );
};

export default DoctorReviews;
