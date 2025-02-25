import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { FaUserCircle, FaCoins, FaRecycle, FaTrophy,FaCertificate } from "react-icons/fa";
import RewardsCatalog from "../components/RewardsCatalog"; // Importing the RewardsCatalog component
import EwasteCertificate from "../components/EwasteCertificate";
import "../styles/Dashboard.css";


const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showRedeemSection, setShowRedeemSection] = useState(false); // Toggle state

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, "users", currentUser.uid);

        // Listen for real-time updates
        const unsubscribeSnapshot = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            setUserData(doc.data());
            console.log("User data updated:", doc.data());
          } else {
            console.log("No such user!");
          }
        });

        return () => unsubscribeSnapshot();
      } else {
        setUser(null);
        setUserData(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  if (!user) {
    return <p>Please log in to access your dashboard.</p>;
  }

  return (
    <div className="dashboard">
      {/* Profile Section */}
      <div className="profile-card">
        <div className="profile-icon">
          <FaUserCircle />
        </div>
        <h2>{userData?.name || "User"}</h2>
        <p>{user.email}</p>
        <div className="ecoins-balance">
          <FaCoins />
          <span>{userData?.ecoins || 0} E-Coins</span>
        </div>
      </div>

      {/* E-Coins Wallet */}
      <div className="wallet">
        <h3><FaCoins /> E-Coins Wallet</h3>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${(userData?.ecoins || 0) % 100}%` }}></div>
        </div>
        <p>Earn {100 - ((userData?.ecoins || 0) % 100)} more E-Coins to unlock the next reward!</p>
        <ul>
          {userData?.transactions?.length > 0 ? (
            userData.transactions.map((txn, index) => (
              <li key={index}>
                {txn.type}: <strong>{txn.amount} E-Coins</strong>
              </li>
            ))
          ) : (
            <p>No transactions yet.</p>
          )}
        </ul>

        {/* Toggle Redeem Section */}
        <button className="redeem-button" onClick={() => setShowRedeemSection(!showRedeemSection)}>
          {showRedeemSection ? "Hide Redemption" : "Redeem E-Coins"}
        </button>

        {/* Conditional Rendering of Rewards Catalog */}
        {showRedeemSection && <RewardsCatalog />}
      </div>

      {/* E-Waste Listings */}
      <div className="ewaste-list">
        <h3><FaRecycle /> Your E-Waste Listings</h3>
        <ul>
          {userData?.eWasteListings?.length > 0 ? (
            userData.eWasteListings.map((listing, index) => (
              <li key={index}>
                {listing.item} - <strong>{listing.status}</strong>
              </li>
            ))
          ) : (
            <p>No e-waste listings yet.</p>
          )}
        </ul>
        <button className="schedule-button" onClick={()=>navigate("/ewaste-form")}>Schedule New Pickup</button>
      </div>

      {/* Gamification Section */}
      <div className="gamification">
        <h3><FaTrophy /> Achievements</h3>
        <div className="badges">
          <div className="badge">Recycled 5 Items</div>
          <div className="badge">Earned 100 E-Coins</div>
          <div className="badge">Top Recycler</div>
        </div>
      </div>

      <div className="certificate-section">
        <h3><FaCertificate /> Download Your E-Waste Certificate</h3>
        <EwasteCertificate
          name={userData?.name || "User"}
          eCoins={userData?.ecoins || 0}
          impactStats={{
            co2Saved: userData?.impactStats?.co2Saved || 0,
            landfillReduced: userData?.impactStats?.landfillReduced || 0,
            energySaved: userData?.impactStats?.energySaved || 0,
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
