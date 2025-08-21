import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { FaUserCircle, FaCoins, FaMapMarkerAlt, FaHome, FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import "../styles/Navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [prevEcoins, setPrevEcoins] = useState(0);
  const [location, setLocation] = useState("Fetching...");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, "users", currentUser.uid);

        const unsubscribeSnapshot = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            const newUserData = doc.data();
            setUserData(newUserData);

            if (newUserData.ecoins > prevEcoins) {
              triggerCoinGlow();
            }
            setPrevEcoins(newUserData.ecoins);
          }
        });

        return () => unsubscribeSnapshot();
      } else {
        setUser(null);
        setUserData(null);
      }
    });

    return () => unsubscribeAuth();
  }, [prevEcoins]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
            .then((response) => response.json())
            .then((data) => {
              setLocation(data.address.city || data.address.town || data.address.village || "Unknown");
            })
            .catch(() => setLocation("Location not found"));
        },
        () => setLocation("Location blocked")
      );
    } else {
      setLocation("Geolocation not supported");
    }
  }, []);

  const triggerCoinGlow = () => {
    const eCoinsElement = document.querySelector(".ecoins-display");
    if (eCoinsElement) {
      eCoinsElement.classList.add("gain");
      setTimeout(() => {
        eCoinsElement.classList.remove("gain");
      }, 1000);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="logo-section">
          <img 
            src="/suvidha_logo-removebg-preview.png" 
            alt="आपली सुविधा Logo" 
            className="logo-image"
          />
          <h1 className="logo">
            <Link to="/">आपली सुविधा</Link>
          </h1>
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navigation Links */}
        <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/" className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>
              <FaHome /> Home
            </Link>
          </li>
          <li>
            <Link to="/refurbished-store" className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>
              Upcycled Store
            </Link>
          </li>
			<li>
				<Link to="/about" className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>
					About
				</Link>
			</li>
          <li className="location-display">
            <FaMapMarkerAlt className="location-icon" />
            <span>{location}</span>
          </li>

          {/* Show Profile Section Only When Logged In */}
          {user ? (
            <div className="profile-section">
              {/* E-Coins Display */}
              <div className="ecoins-display">
                <FaCoins />
                <span>{userData?.ecoins || 0}</span>
              </div>

              {/* Profile Icon */}
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                <FaUserCircle className="profile-icon" />
              </Link>

              {/* Logout Button */}
              <button onClick={handleLogout} className="logout-button">
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <>
              {/* Sign Up and Login Buttons */}
              <li>
                <Link to="/signup" className="signup-button" onClick={() => setIsMobileMenuOpen(false)}>
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/login" className="login-button" onClick={() => setIsMobileMenuOpen(false)}>
                  Login
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
