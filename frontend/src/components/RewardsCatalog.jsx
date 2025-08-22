import { useEffect, useState } from "react";
import axios from "axios";
import { FaGift, FaCoins, FaStar, FaShoppingCart, FaHeart, FaCheck } from "react-icons/fa";
import "../styles/RewardsCatalog.css";

const RewardsCatalog = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReward, setSelectedReward] = useState(null);
  const [redeeming, setRedeeming] = useState(false);
  const [userEcoins, setUserEcoins] = useState(0);

  useEffect(() => {
    fetchRewards();
    // Simulate user E-coins (in real app, get from user context)
    setUserEcoins(150);
  }, []);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/rewards");
      setRewards(response.data);
    } catch (error) {
      console.error("Error fetching rewards:", error);
      // Fallback data if API fails
      setRewards([
        {
          _id: "1",
          brand: "EcoStore",
          name: "Organic Cotton Tote Bag",
          description: "Sustainable shopping companion made from 100% organic cotton",
          eCoinsRequired: 50,
          imageUrl: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=400",
          logoUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100"
        },
        {
          _id: "2",
          brand: "GreenTech",
          name: "Solar Power Bank",
          description: "Charge your devices with clean solar energy",
          eCoinsRequired: 100,
          imageUrl: "https://images.unsplash.com/photo-1609592806596-b43bada2f2d4?w=400",
          logoUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100"
        },
        {
          _id: "3",
          brand: "RecyclePlus",
          name: "Bamboo Water Bottle",
          description: "Eco-friendly alternative to plastic bottles",
          eCoinsRequired: 75,
          imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
          logoUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (reward) => {
    if (userEcoins < reward.eCoinsRequired) {
      alert("Insufficient E-Coins! Keep recycling to earn more.");
      return;
    }

    setRedeeming(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, call backend API to redeem
      // await axios.post(`http://localhost:5000/api/rewards/${reward._id}/redeem`);
      
      setUserEcoins(prev => prev - reward.eCoinsRequired);
      setSelectedReward(reward);
      
      setTimeout(() => {
        setSelectedReward(null);
        setRedeeming(false);
      }, 3000);
      
    } catch (error) {
      console.error("Redeem failed:", error);
      setRedeeming(false);
    }
  };

  if (loading) {
    return (
      <div className="rewards-loading">
        <div className="loading-spinner">
          <FaGift className="spinner-icon" />
          <p>Loading amazing rewards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rewards-catalog">
      {/* Header Section */}
      <div className="rewards-header">
        <div className="header-content">
          <h2 className="rewards-title">
            <FaGift className="title-icon" />
            Redeem Your E-Coins
          </h2>
          <p className="rewards-subtitle">
            Exchange your hard-earned E-Coins for exclusive eco-friendly products and discounts!
          </p>
          <div className="user-balance">
            <FaCoins className="balance-icon" />
            <span className="balance-text">Your Balance: <strong>{userEcoins} E-Coins</strong></span>
          </div>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="rewards-grid">
        {rewards.map((reward, index) => (
          <div 
            key={reward._id} 
            className={`reward-card ${index % 2 === 0 ? 'slide-in-left' : 'slide-in-right'}`}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            {/* Card Header */}
            <div className="card-header">
              <div className="brand-info">
                <img 
                  src={reward.logoUrl} 
                  alt={`${reward.brand} Logo`} 
                  className="brand-logo"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/50x50/4CAF50/FFFFFF?text=🌱";
                  }}
                />
                <span className="brand-name">{reward.brand}</span>
              </div>
              <div className="card-badge">
                <FaStar className="badge-icon" />
                <span>Premium</span>
              </div>
            </div>

            {/* Product Image */}
            <div className="product-image-container">
              <img 
                src={reward.imageUrl} 
                alt={reward.name} 
                className="product-image"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=🌿";
                }}
              />
              <div className="image-overlay">
                <FaHeart className="wishlist-icon" />
              </div>
            </div>

            {/* Product Info */}
            <div className="product-info">
              <h3 className="product-name">{reward.name}</h3>
              <p className="product-description">{reward.description}</p>
              
              <div className="ecoins-required">
                <FaCoins className="ecoins-icon" />
                <span className="ecoins-text">{reward.eCoinsRequired} E-Coins</span>
              </div>

              {/* Progress Bar */}
              <div className="progress-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${Math.min((userEcoins / reward.eCoinsRequired) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
                <span className="progress-text">
                  {userEcoins >= reward.eCoinsRequired ? 'Ready to Redeem!' : `${userEcoins}/${reward.eCoinsRequired}`}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="card-actions">
              <button 
                className={`redeem-btn ${userEcoins >= reward.eCoinsRequired ? 'available' : 'unavailable'}`}
                onClick={() => handleRedeem(reward)}
                disabled={userEcoins < reward.eCoinsRequired || redeeming}
              >
                {redeeming ? (
                  <>
                    <div className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    Redeeming...
                  </>
                ) : (
                  <>
                    <FaShoppingCart className="redeem-icon" />
                    {userEcoins >= reward.eCoinsRequired ? 'Redeem Now' : 'Need More Coins'}
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Success Modal */}
      {selectedReward && (
        <div className="success-modal">
          <div className="modal-content">
            <div className="success-animation">
              <FaCheck className="success-icon" />
            </div>
            <h3>🎉 Successfully Redeemed!</h3>
            <p>You've redeemed <strong>{selectedReward.name}</strong></p>
            <p>Check your email for redemption details.</p>
            <button 
              className="modal-close-btn"
              onClick={() => setSelectedReward(null)}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {rewards.length === 0 && (
        <div className="empty-state">
          <FaGift className="empty-icon" />
          <h3>No Rewards Available</h3>
          <p>Check back soon for new eco-friendly rewards!</p>
        </div>
      )}
    </div>
  );
};

export default RewardsCatalog;
