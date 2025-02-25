import React from "react";
import "../styles/Footer.css"; // Import CSS

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h3>🌿 Join Us in Making a Greener Future!</h3>
        <p>
          Together, we can revolutionize e-waste recycling and build a sustainable tomorrow.  
          <strong>We, Team AIRIT</strong>, are committed to driving change through innovation. 🚀  
        </p>
        <button className="cta-button" onClick={() => alert("Thanks for supporting sustainability!")}>
          Get Involved
        </button>
        <p className="copyright">© 2024 <strong>Team AIRIT</strong>. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
