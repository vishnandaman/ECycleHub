import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig"; // Firebase auth & Firestore
import { onAuthStateChanged, signOut } from "firebase/auth"; // Firebase methods
import { doc, onSnapshot } from "firebase/firestore"; // Firestore methods
import { FaUserCircle, FaCoins, FaMapMarkerAlt } from "react-icons/fa"; // React Icons
import "../styles/Navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [prevEcoins, setPrevEcoins] = useState(0);
  const [location, setLocation] = useState("Fetching...");

  useEffect(() => {
    // Fetch user authentication status
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, "users", currentUser.uid);

        // Listen for real-time E-Coins updates
        const unsubscribeSnapshot = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            const newUserData = doc.data();
            setUserData(newUserData);

            // Trigger glow effect if E-Coins increased
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

    return () => unsubscribeAuth(); // Cleanup on unmount
  }, [prevEcoins]);

  // Function to fetch user's location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Reverse geocoding to fetch city name
          fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
            .then((response) => response.json())
            .then((data) => {
              setLocation(data.address.city || data.address.town || data.address.village || "Unknown");
            })
            .catch(() => setLocation("Location not found"));
        },
        () => setLocation("Location blocked") // Error handling if user denies permission
      );
    } else {
      setLocation("Geolocation not supported");
    }
  }, []);

  // Function to trigger glow animation for E-Coins
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
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <h1 className="logo">
          <Link to="/">E-Cycle Hub</Link>
        </h1>

        {/* Navigation Links */}
        <ul className="nav-links">
          <li>
            <Link to="/" className="nav-item">Home</Link>
          </li>
          <li>
            <Link to="/refurbished-store" className="nav-item">Refurbished Store</Link>
          </li>
          <li className="location-display">
            <FaMapMarkerAlt className="location-icon" />
            <span>{location}</span>
          </li>

          {/* Show Profile Section Only When Logged In */}
          {user ? (
            <div className="profile-section">
              {/* E-Coins Display with Animation */}
              <div className="ecoins-display">
                <FaCoins />
                <span>{userData?.ecoins || 0} E-Coins</span>
              </div>

              {/* Profile Icon */}
              <Link to="/dashboard">
                <FaUserCircle className="profile-icon" />
              </Link>

              {/* Logout Button */}
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
          ) : (
            <>
              {/* Sign Up and Login Buttons */}
              <li><Link to="/signup" className="signup-button">Sign Up</Link></li>
              <li><Link to="/login" className="login-button">Login</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
