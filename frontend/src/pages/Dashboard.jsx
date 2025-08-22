import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { 
  FaUserCircle, 
  FaCoins, 
  FaRecycle, 
  FaTrophy, 
  FaCertificate, 
  FaChartLine, 
  FaLeaf, 
  FaCalendarAlt, 
  FaMapMarkerAlt,
  FaArrowRight,
  FaGift,
  FaHistory,
  FaStar,
  FaAward
} from "react-icons/fa";
import RewardsCatalog from "../components/RewardsCatalog";
import EwasteCertificate from "../components/EwasteCertificate";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showRedeemSection, setShowRedeemSection] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, "users", currentUser.uid);

        const unsubscribeSnapshot = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            setUserData(doc.data());
            console.log("User data updated:", doc.data());
          } else {
            console.log("No such user!");
          }
          setIsLoading(false);
        });

        return () => unsubscribeSnapshot();
      } else {
        setUser(null);
        setUserData(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">
          <FaUserCircle className="spinner-icon" />
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="auth-required">
        <div className="auth-message">
          <FaUserCircle className="auth-icon" />
          <h2>Authentication Required</h2>
          <p>Please log in to access your dashboard.</p>
          <button onClick={() => navigate('/login')} className="login-btn">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const ecoins = userData?.ecoins || 0;
  const transactions = userData?.transactions || [];
  const eWasteListings = userData?.eWasteListings || [];

  return (
    <div className="dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <div className="user-avatar">
              <FaUserCircle className="avatar-icon" />
            </div>
            <div className="user-info">
              <h1 className="welcome-text">
                Welcome back, <span className="user-name">{userData?.name || "Eco Warrior"}</span>! 🌱
              </h1>
              <p className="user-email">{user.email}</p>
            </div>
          </div>
          <div className="quick-stats">
            <div className="stat-card">
              <FaCoins className="stat-icon" />
              <div className="stat-content">
                <span className="stat-number">{ecoins}</span>
                <span className="stat-label">E-Coins</span>
              </div>
            </div>
            <div className="stat-card">
              <FaRecycle className="stat-icon" />
              <div className="stat-content">
                <span className="stat-number">{eWasteListings.length}</span>
                <span className="stat-label">Items Recycled</span>
              </div>
            </div>
            <div className="stat-card">
              <FaTrophy className="stat-icon" />
              <div className="stat-content">
                <span className="stat-number">{Math.floor(ecoins / 50)}</span>
                <span className="stat-label">Achievements</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <FaChartLine className="tab-icon" />
          Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'wallet' ? 'active' : ''}`}
          onClick={() => setActiveTab('wallet')}
        >
          <FaCoins className="tab-icon" />
          E-Coins Wallet
        </button>
        <button 
          className={`tab-btn ${activeTab === 'rewards' ? 'active' : ''}`}
          onClick={() => setActiveTab('rewards')}
        >
          <FaGift className="tab-icon" />
          Rewards
        </button>
        <button 
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <FaHistory className="tab-icon" />
          History
        </button>
        <button 
          className={`tab-btn ${activeTab === 'certificate' ? 'active' : ''}`}
          onClick={() => setActiveTab('certificate')}
        >
          <FaCertificate className="tab-icon" />
          Certificate
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-content">
            <div className="overview-grid">
              {/* E-Coins Progress */}
              <div className="overview-card ecoins-progress">
                <div className="card-header">
                  <FaCoins className="card-icon" />
                  <h3>E-Coins Progress</h3>
                </div>
                <div className="progress-section">
                  <div className="progress-circle">
                    <svg viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" className="progress-bg" />
                      <circle 
                        cx="60" 
                        cy="60" 
                        r="50" 
                        className="progress-fill"
                        style={{
                          strokeDasharray: `${2 * Math.PI * 50}`,
                          strokeDashoffset: `${2 * Math.PI * 50 * (1 - (ecoins % 100) / 100)}`
                        }}
                      />
                    </svg>
                    <div className="progress-text">
                      <span className="progress-number">{ecoins % 100}</span>
                      <span className="progress-label">/ 100</span>
                    </div>
                  </div>
                  <p className="progress-message">
                    {ecoins % 100 === 0 ? '🎉 Level Up!' : `${100 - (ecoins % 100)} more E-Coins to next level`}
                  </p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="overview-card recent-activity">
                <div className="card-header">
                  <FaHistory className="card-icon" />
                  <h3>Recent Activity</h3>
                </div>
                <div className="activity-list">
                  {transactions.slice(0, 5).map((txn, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-icon">
                        <FaRecycle />
                      </div>
                      <div className="activity-content">
                        <span className="activity-text">{txn.type}</span>
                        <span className="activity-amount">+{txn.amount} E-Coins</span>
                      </div>
                    </div>
                  ))}
                  {transactions.length === 0 && (
                    <div className="empty-activity">
                      <FaLeaf className="empty-icon" />
                      <p>No activity yet. Start recycling to earn E-Coins!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="overview-card quick-actions">
                <div className="card-header">
                  <FaArrowRight className="card-icon" />
                  <h3>Quick Actions</h3>
                </div>
                <div className="actions-grid">
                  <button 
                    className="action-btn"
                    onClick={() => navigate('/ewaste-form')}
                  >
                    <FaRecycle className="action-icon" />
                    <span>Book Pickup</span>
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => setActiveTab('rewards')}
                  >
                    <FaGift className="action-icon" />
                    <span>Redeem Rewards</span>
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => setActiveTab('certificate')}
                  >
                    <FaCertificate className="action-icon" />
                    <span>View Certificate</span>
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => navigate('/tracking')}
                  >
                    <FaMapMarkerAlt className="action-icon" />
                    <span>Track Pickup</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* E-Coins Wallet Tab */}
        {activeTab === 'wallet' && (
          <div className="wallet-content">
            <div className="wallet-overview">
              <div className="wallet-balance">
                <FaCoins className="balance-icon" />
                <div className="balance-info">
                  <span className="balance-amount">{ecoins}</span>
                  <span className="balance-label">Total E-Coins</span>
                </div>
              </div>
              <div className="wallet-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${(ecoins % 100)}%` }}
                  ></div>
                </div>
                <p className="progress-text">
                  {ecoins % 100 === 0 ? '🎉 Ready for next level!' : `${100 - (ecoins % 100)} more E-Coins to unlock next reward`}
                </p>
              </div>
            </div>

            <div className="transaction-history">
              <h3>Transaction History</h3>
              <div className="transactions-list">
                {transactions.length > 0 ? (
                  transactions.map((txn, index) => (
                    <div key={index} className="transaction-item">
                      <div className="transaction-icon">
                        <FaRecycle />
                      </div>
                      <div className="transaction-details">
                        <span className="transaction-type">{txn.type}</span>
                        <span className="transaction-date">
                          <FaCalendarAlt className="date-icon" />
                          {new Date(txn.timestamp || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="transaction-amount">
                        <span className={`amount ${txn.amount > 0 ? 'positive' : 'negative'}`}>
                          {txn.amount > 0 ? '+' : ''}{txn.amount} E-Coins
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-transactions">
                    <FaCoins className="empty-icon" />
                    <p>No transactions yet. Start recycling to earn E-Coins!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Rewards Tab */}
        {activeTab === 'rewards' && (
          <div className="rewards-content">
            <RewardsCatalog />
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="history-content">
            <div className="history-section">
              <h3>E-Waste Recycling History</h3>
              <div className="history-list">
                {eWasteListings.length > 0 ? (
                  eWasteListings.map((listing, index) => (
                    <div key={index} className="history-item">
                      <div className="history-icon">
                        <FaRecycle />
                      </div>
                      <div className="history-details">
                        <span className="history-item-name">{listing.item}</span>
                        <span className="history-status">
                          <span className={`status-badge ${listing.status.toLowerCase()}`}>
                            {listing.status}
                          </span>
                        </span>
                      </div>
                      <div className="history-date">
                        <FaCalendarAlt className="date-icon" />
                        {new Date(listing.date || Date.now()).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-history">
                    <FaRecycle className="empty-icon" />
                    <p>No recycling history yet. Book your first pickup!</p>
                    <button 
                      className="book-pickup-btn"
                      onClick={() => navigate('/ewaste-form')}
                    >
                      Book Pickup
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Certificate Tab */}
        {activeTab === 'certificate' && (
          <div className="certificate-content">
            <EwasteCertificate 
              name={userData?.name || "Eco Warrior"}
              eCoins={ecoins}
              impactStats={{
                co2Saved: Math.floor(ecoins * 0.5),
                landfillReduced: Math.floor(ecoins * 0.02),
                energySaved: Math.floor(ecoins * 2.4)
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
