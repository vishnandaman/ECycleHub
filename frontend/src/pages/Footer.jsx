import React from "react";
import {FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-sections">
          {/* Brand Section */}
          <div className="footer-section">
            <div className="footer-brand">
              <img 
                src="/suvidha_logo-removebg-preview.png" 
                alt="आपली सुविधा Logo" 
                className="footer-logo"
              />
              <h3>आपली सुविधा</h3>
            </div>
            <p>
              Smart waste management platform connecting communities with local recyclers. 
              Together, we build a sustainable future through responsible e-waste recycling.
            </p>
            <div className="social-links">
              <a href="#" className="social-link"><FaFacebook /></a>
              <a href="#" className="social-link"><FaTwitter /></a>
              <a href="#" className="social-link"><FaInstagram /></a>
              <a href="#" className="social-link"><FaLinkedin /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/ewaste-form">Book Pickup</a></li>
              <li><a href="/refurbished-store">Upcycled Store</a></li>
              <li><a href="/dashboard">Dashboard</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4>Our Services</h4>
            <ul className="footer-links">
              <li>E-Waste Collection</li>
              <li>Local Pickup</li>
              <li>Recycling Centers</li>
              <li>Rewards Program</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4>Contact Us</h4>
            <div className="contact-info">
              <div className="contact-item">
                <FaMapMarkerAlt />
                <span>Akshar Colony, Road no.9, Urun-Islampur, 415409</span>
              </div>
              <div className="contact-item">
                <FaPhone />
                <span>+91 91583 03533</span>
              </div>
              <div className="contact-item">
                <FaEnvelope />
                <span>2203051@ritindia.edu</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-stats">
            <div className="stat">
              <span className="stat-number">10+</span>
              <span className="stat-label">Recycling Centers</span>
            </div>
            <div className="stat">
              <span className="stat-number">400+</span>
              <span className="stat-label">Kg Waste Collected</span>
            </div>
            <div className="stat">
              <span className="stat-number">3+</span>
              <span className="stat-label">Cities Covered</span>
            </div>
          </div>
          
          <div className="footer-cta">
            <button className="cta-button" onClick={() => alert("Thanks for supporting sustainability!")}>
              Join Our Mission
            </button>
          </div>
        </div>

        <div className="copyright">
          <p>© 2024 <strong>आपली सुविधा</strong>. All rights reserved. | Made with ❤️ for a sustainable future</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
