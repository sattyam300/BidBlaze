import React from 'react';

const AuctionCard = ({ auction, onViewDetails }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'ended':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={auction.image}
        alt={auction.title}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
        }}
      />
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {auction.title}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(auction.status)}`}>
            {auction.status}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {auction.description}
        </p>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Current Price:</span>
            <span className="text-lg font-bold text-green-600">
              {formatPrice(auction.price)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Category:</span>
            <span className="text-sm font-medium capitalize">
              {auction.category}
            </span>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Starts:</span>
              <span>{formatDate(auction.startTime)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Ends:</span>
              <span>{formatDate(auction.endTime)}</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => onViewDetails(auction._id)}
          className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default AuctionCard;