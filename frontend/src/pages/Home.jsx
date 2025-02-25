import { useNavigate } from "react-router-dom";
import RecyclingMap from "../components/RecyclingMap";
import "../styles/Home.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import Footer from "./Footer";
import CDSC from "../components/CDSC";
import backgroundVideo from "../assets/video1.mp4"; // 🎥 Import the video

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  
    // 🚀 Animate Progress Bar on Load
    setTimeout(() => {
      const progressBar = document.querySelector(".progress");
      if (progressBar) {
        progressBar.style.width = "60%"; // Adjust dynamically
      }
    }, 500);
  }, []);
  return (
    <div className="home-container">
      {/* Hero Section with Video Background */}
      <div className="hero-section">
        <video autoPlay loop muted className="background-video">
          <source src={backgroundVideo} type="video/mp4" />
        </video>
        {/* Overlay for Readability */}
        <div className="video-overlay"></div>

        {/* Hero Content */}
        <div className="hero-content" data-aos="fade-up">
          <h1 className="home-title">Welcome to E-Cycle Hub</h1>
          <p className="home-description">
            A smart marketplace for responsible e-waste recycling.
          </p>
          <button
            className="home-button"
            onClick={() => navigate("/ewaste-form")}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Start Recycling
          </button>
        </div>
      </div>

      {/* CDSC Section */}
      <div className="cdsc-section" data-aos="fade-up">
        <CDSC />
      </div>

      {/* Gamification Section */}
        <div className="gamification-section" data-aos="fade-up">
            <h2>Earn E-Coins and Save the Planet!</h2>
            <div className="progress-bar">
            <div className="progress animated-progress"></div>
            </div>
        <p>Recycle more to unlock rewards and discounts.</p>
        </div>


      {/* Recycling Map */}
      <div className="map-section" data-aos="fade-up">
        <h2>Find Nearest Recycling Centers</h2>
        <RecyclingMap />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
