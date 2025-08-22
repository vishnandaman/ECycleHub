import React, { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { FaDownload, FaLeaf, FaRecycle, FaTrophy, FaStar } from "react-icons/fa";
import "../styles/EwasteCertificate.css";

const EwasteCertificate = ({ name, eCoins, impactStats }) => {
  const certificateRef = useRef();
  const [isAnimating, setIsAnimating] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Animation effects on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = async () => {
    setDownloadProgress(0);
    setIsAnimating(true);
    
    try {
      const input = certificateRef.current;
      const canvas = await html2canvas(input, { 
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      setDownloadProgress(50);
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a4");
      pdf.addImage(imgData, "PNG", 10, 10, 280, 200);
      
      setDownloadProgress(90);
      
      pdf.save(`E-Waste_Certificate_${name || 'User'}.pdf`);
      
      setDownloadProgress(100);
      setTimeout(() => setDownloadProgress(0), 2000);
    } catch (error) {
      console.error("Download failed:", error);
      setDownloadProgress(0);
    }
  };

  return (
    <div className="certificate-container">
      {/* Animated Background Elements */}
      <div className="certificate-bg-elements">
        <div className="floating-leaf leaf-1">🌿</div>
        <div className="floating-leaf leaf-2">🍃</div>
        <div className="floating-leaf leaf-3">🌱</div>
        <div className="floating-leaf leaf-4">🌿</div>
      </div>

      {/* Certificate */}
      <div 
        ref={certificateRef}
        className={`certificate ${isAnimating ? 'animate-in' : ''}`}
      >
        {/* Certificate Header */}
        <div className="certificate-header">
          <div className="header-decoration">
            <FaLeaf className="header-icon" />
            <div className="header-line"></div>
            <FaRecycle className="header-icon" />
          </div>
          <h1 className="certificate-title">
            <span className="title-main">E-Waste Recycling</span>
            <span className="title-sub">Certificate of Achievement</span>
          </h1>
          <div className="header-decoration">
            <FaRecycle className="header-icon" />
            <div className="header-line"></div>
            <FaLeaf className="header-icon" />
          </div>
        </div>

        {/* Certificate Body */}
        <div className="certificate-body">
          <div className="presented-to">
            <p className="presented-text">This certificate is proudly presented to</p>
            <h2 className="recipient-name">{name || "Eco Warrior"}</h2>
            <p className="achievement-text">
              For outstanding contribution to environmental sustainability through 
              responsible e-waste recycling and commitment to a greener future.
            </p>
          </div>

          {/* Achievement Stats */}
          <div className="achievement-stats">
            <div className="stat-item">
              <div className="stat-icon">
                <FaTrophy />
              </div>
              <div className="stat-content">
                <span className="stat-number">{eCoins || 0}</span>
                <span className="stat-label">E-Coins Earned</span>
              </div>
            </div>
          </div>

          {/* Environmental Impact */}
          <div className="impact-section">
            <h3 className="impact-title">
              <FaStar className="impact-icon" />
              Environmental Impact Achieved
            </h3>
            <div className="impact-grid">
              <div className="impact-item">
                <div className="impact-icon">♻️</div>
                <div className="impact-content">
                  <span className="impact-value">{impactStats?.co2Saved || 25} kg</span>
                  <span className="impact-label">CO₂ Saved</span>
                </div>
              </div>
              <div className="impact-item">
                <div className="impact-icon">🌍</div>
                <div className="impact-content">
                  <span className="impact-value">{impactStats?.landfillReduced || 0.5} m³</span>
                  <span className="impact-label">Landfill Space Reduced</span>
                </div>
              </div>
              <div className="impact-item">
                <div className="impact-icon">⚡</div>
                <div className="impact-content">
                  <span className="impact-value">{impactStats?.energySaved || 120} kWh</span>
                  <span className="impact-label">Energy Saved</span>
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Footer */}
          <div className="certificate-footer">
            <div className="footer-content">
              <p className="footer-text">
                Thank you for making the world greener! 🌱
              </p>
              <p className="certificate-date">
                Issued on {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="certificate-seal">
              <div className="seal-circle">
                <FaLeaf className="seal-icon" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="download-section">
        <button 
          onClick={handleDownload}
          className={`download-btn ${downloadProgress > 0 ? 'downloading' : ''}`}
          disabled={downloadProgress > 0}
        >
          <FaDownload className="download-icon" />
          <span className="download-text">
            {downloadProgress > 0 ? `Downloading... ${downloadProgress}%` : 'Download Certificate'}
          </span>
          {downloadProgress > 0 && (
            <div className="download-progress">
              <div 
                className="progress-bar" 
                style={{ width: `${downloadProgress}%` }}
              ></div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default EwasteCertificate;
