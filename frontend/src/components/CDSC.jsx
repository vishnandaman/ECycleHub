import React from "react";
import "../styles/CDSC.css"; // Import your CSS file for styling

const CDSC = () => {
  return (
    <div className="cdsc-container">
      <h2 className="cdsc-title">Our Process</h2>
      <div className="cdsc-grid">
        {/* Collection */}
        <div className="cdsc-card" data-aos="fade-up">
          <div className="cdsc-icon">📦</div>
          <h3>Collection</h3>
          <p>
            For subsequent disposal, we carefully collect electronic and electric trash from homes, offices, and industries.
          </p>
          <button className="cdsc-button" onClick={() => alert("Learn more about Collection")}>
            Learn More
          </button>
        </div>

        {/* Sorting */}
        <div className="cdsc-card" data-aos="fade-up" data-aos-delay="200">
          <div className="cdsc-icon">🔍</div>
          <h3>Sorting</h3>
          <p>
            Our method ensures that discarded materials are properly categorized for recycling and reuse.
          </p>
          <button className="cdsc-button" onClick={() => alert("Learn more about Sorting")}>
            Learn More
          </button>
        </div>

        {/* Disposition */}
        <div className="cdsc-card" data-aos="fade-up" data-aos-delay="100">
          <div className="cdsc-icon">🚮</div>
          <h3>Disposition</h3>
          <p>
            After identifying toxic materials, we properly dispose of them to protect the environment and human health.
          </p>
          <button className="cdsc-button" onClick={() => alert("Learn more about Disposition")}>
            Learn More
          </button>
        </div>

        

        {/* Certification */}
        <div className="cdsc-card" data-aos="fade-up" data-aos-delay="300">
          <div className="cdsc-icon">🏆</div>
          <h3>Rewards Recycling</h3>
          <p>
          Recycle your e-waste and earn <strong>E-Coins</strong>! Redeem them for 
          vouchers, refurbished products, and exclusive discounts.
          </p>
          <button className="cdsc-button" onClick={() => alert("Discover Your Rewards!")}>
          Redeem Rewards
          </button>
        </div>
      </div>
    </div>
  );
};

export default CDSC;