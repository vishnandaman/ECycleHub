import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaRecycle, FaMapMarkerAlt, FaUsers, FaLeaf, FaTruck, FaChartLine, FaStar, FaHandshake, FaArrowRight } from "react-icons/fa";
import "../styles/Home.css";
import AOS from "aos";
import "aos/dist/aos.css";
import Footer from "./Footer";
import CDSC from "../components/CDSC";
import backgroundVideo from "../assets/video1.mp4";

const Home = () => {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState("");
  const fullText = "Do you want to sell your waste or plastic?";
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText]);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <video className="background-video" autoPlay loop muted>
          <source src="/src/assets/video1.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
        <div className="hero-gradient-overlay"></div>
        
        <div className="hero-content">
          <h1 className="brand-name">आपली सुविधा</h1>
          <p className="hero-description">
            Connect with local scrap vendors and recyclers. Book pickups, earn rewards,
            and contribute to a sustainable future.
          </p>

          {/* Typewriter Call to Action */}
          <div className="cta-section" data-aos="fade-up" data-aos-delay="300">
            <h3 className="cta-question">
              {typedText}
              <span className="cursor">|</span>
            </h3>
          </div>

          <div className="hero-buttons">
            <button
              className="book-pickup-btn"
              onClick={() => navigate("/ewaste-form")}
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <FaRecycle /> Book Pickup
            </button>
            <button
              className="secondary-btn"
              onClick={() => navigate("/refurbished-store")}
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <FaHandshake /> Browse Store
            </button>
          </div>

          <div className="hero-stats" data-aos="fade-up" data-aos-delay="600">
            <div className="stat-item">
              <span className="stat-number">10+</span>
              <span className="stat-label">Recycling Centers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">400+</span>
              <span className="stat-label">Kg Waste Collected</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">3+</span>
              <span className="stat-label">Cities Covered</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <h2 className="section-title">Our Impact</h2>
          <div className="stats-grid">
            <div className="stat-card" data-aos="fade-up" data-aos-delay="100">
              <div className="stat-icon">
                <FaRecycle />
              </div>
              <div className="stat-number">10+</div>
              <div className="stat-label">Recycling Centers Connected</div>
            </div>
            <div className="stat-card" data-aos="fade-up" data-aos-delay="200">
              <div className="stat-icon">
                <FaTruck />
              </div>
              <div className="stat-number">400+</div>
              <div className="stat-label">Kg Waste Collected</div>
            </div>
            <div className="stat-card" data-aos="fade-up" data-aos-delay="300">
              <div className="stat-icon">
                <FaMapMarkerAlt />
              </div>
              <div className="stat-number">3+</div>
              <div className="stat-label">Cities Covered</div>
            </div>
            <div className="stat-card" data-aos="fade-up" data-aos-delay="400">
              <div className="stat-icon">
                <FaChartLine />
              </div>
              <div className="stat-number">60K</div>
              <div className="stat-label">Sq. M Area Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="problem-section">
        <div className="container">
          <div className="problem-content">
            <div className="problem-text">
              <h2>Urban Waste Crisis</h2>
              <p>
                Inadequate waste segregation in urban areas, particularly in commercial sectors, 
                leads to inefficient waste collection and missed pickups. Sustainable recycling 
                systems are needed to address mixed waste and create a circular economy.
              </p>
              <div className="problem-stats">
                <div className="problem-stat">
                  <span className="stat-highlight">10+</span>
                  <span>Recycling Centers were in connection which says yes to accept the waste</span>
                </div>
                <div className="problem-stat">
                  <span className="stat-highlight">400+</span>
                  <span>Generated from the segregation of collected waste (including the logistic expenses)</span>
                </div>
                <div className="problem-stat">
                  <span className="stat-highlight">27kg</span>
                  <span>Solid waste collected in 60k sq. m area of Urun-Islampur. Out of which, 27 kg waste is non-recyclable</span>
                </div>
              </div>
            </div>
            <div className="problem-image">
              <img
                src="/suvidha_logo-removebg-preview.png"
                alt="Waste Management"
                className="problem-logo"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Our Platform?</h2>
          <div className="features-grid">
            <div className="feature-card" data-aos="fade-up" data-aos-delay="100">
              <div className="feature-icon">
                <FaRecycle />
              </div>
              <h3>Fast & Quick</h3>
              <p>Book pickups instantly and get real-time tracking for your waste collection.</p>
            </div>
            <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
              <div className="feature-icon">
                <FaStar />
              </div>
              <h3>Reliable</h3>
              <p>Trusted network of verified recyclers and transparent pricing for all transactions.</p>
            </div>
            <div className="feature-card" data-aos="fade-up" data-aos-delay="300">
              <div className="feature-icon">
                <FaHandshake />
              </div>
              <h3>Professional</h3>
              <p>Professional service with proper documentation and eco-friendly disposal methods.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Student-Built Highlight */}
      <div className="student-built-section" data-aos="fade-up">
        <div className="container">
          <div className="student-content">
            <h2>Built by Students, For Everyone</h2>
            <p>
              This platform was developed by passionate students who experienced the waste management 
              challenges firsthand. From conducting surveys to collecting garbage and plastic, 
              we've learned valuable lessons about sustainability and community impact.
            </p>
            <div className="student-highlights">
              <div className="highlight-item">
                <FaUsers />
                <span>Student-Led Innovation</span>
              </div>
              <div className="highlight-item">
                <FaRecycle />
                <span>Real-World Experience</span>
              </div>
              <div className="highlight-item">
                <FaHandshake />
                <span>Community Focused</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Waste Detection Section */}
      <section className="ai-section">
        <div className="container">
          <h2 className="section-title">AI-Powered Waste Detection</h2>
          <p className="section-subtitle">Smart technology for accurate waste classification</p>
          
          <div className="ai-content" data-aos="fade-up">
            <div className="ai-stats">
              <div className="ai-stat">
                <span className="stat-number">95%</span>
                <span className="stat-label">Accuracy</span>
              </div>
              <div className="ai-stat">
                <span className="stat-number">2s</span>
                <span className="stat-label">Response</span>
              </div>
              <div className="ai-stat">
                <span className="stat-number">10+</span>
                <span className="stat-label">Types</span>
              </div>
            </div>

            <div className="ai-features">
              <div className="ai-feature" data-aos="fade-up" data-aos-delay="100">
                <FaRecycle className="feature-icon" />
                <h4>Instant Classification</h4>
                <p>Upload photos for immediate waste identification</p>
              </div>
              <div className="ai-feature" data-aos="fade-up" data-aos-delay="200">
                <FaChartLine className="feature-icon" />
                <h4>Smart Pricing</h4>
                <p>Get accurate market value estimates</p>
              </div>
              <div className="ai-feature" data-aos="fade-up" data-aos-delay="300">
                <FaLeaf className="feature-icon" />
                <h4>Eco Impact</h4>
                <p>Track your environmental contribution</p>
              </div>
            </div>

            <button
              className="primary-btn ai-btn"
              onClick={() => navigate("/ewaste-form")}
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <FaArrowRight /> Try AI Detection
            </button>
          </div>
        </div>
      </section>



      {/* Map Section */}
      <section className="map-section">
        <div className="container">
          <h2 className="section-title">Find Recycling Centers Near You</h2>
          <div className="map-content">
            <div className="map-text">
              <h3>Interactive Recycling Map</h3>
              <p>
                Discover nearby recycling centers, track your pickups, and explore sustainable 
                options in your area. Our interactive map makes waste management easy and accessible.
              </p>
              <button
                className="primary-btn"
                onClick={() => navigate("/recycling-map")}
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <FaMapMarkerAlt /> Explore Map
              </button>
            </div>
            <div className="map-preview">
              <img
                src="/suvidha_logo-removebg-preview.png"
                alt="Recycling Map"
                className="map-logo"
              />
            </div>
            </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
