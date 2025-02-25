import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/RewardsCatalog.css"; // Importing styles

const RewardsCatalog = () => {
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/rewards")
      .then(res => setRewards(res.data))
      .catch(err => console.error("Error fetching rewards", err));
  }, []);

  return (
    <div className="rewards-catalog">
      <h3>🎁 Redeem Your E-Coins</h3>
      <p>Exchange your E-Coins for discount vouchers on premium products!</p>
      <div className="rewards-grid">
        {rewards.length > 0 ? (
          rewards.map(reward => (
            <div key={reward._id} className="voucher-card">
              <div className="voucher-header">
                <img src={reward.logoUrl} alt={`${reward.brand} Logo`} className="brand-logo" />
                <span className="brand-name">{reward.brand}</span>
              </div>
              <div className="voucher-body">
                <img src={reward.imageUrl} alt={reward.name} className="product-image" />
                <h3>{reward.name}</h3>
                <p>{reward.description}</p>
                <p className="ecoins-needed">🪙 {reward.eCoinsRequired} E-Coins</p>
              </div>
              <button className="redeem-btn">Redeem Now</button>
            </div>
          ))
        ) : (
          <p>No rewards available yet.</p>
        )}
      </div>
    </div>
  );
};

export default RewardsCatalog;
