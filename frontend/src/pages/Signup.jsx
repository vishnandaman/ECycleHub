import { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaRecycle, FaArrowRight, FaUser, FaPhone } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../styles/Auth.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Prepare user data
      const userData = {
        name,
        email,
        phone,
        eCoins: 0, // Initialize E-Coins balance
        transactions: [], // Empty transaction history
        eWasteListings: [], // Empty e-waste list
        joinedAt: new Date().toISOString(),
      };

      // Store user details in Firestore
      await setDoc(doc(db, "users", user.uid), userData);

      console.log("User data written to Firestore:", userData); // Debugging log
      toast.success("Account created successfully! 🎉");
    } catch (error) {
      console.error("Signup error:", error); // Debugging log
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="auth-particles"></div>
        <div className="auth-particles"></div>
        <div className="auth-particles"></div>
      </div>
      
      <div className="auth-container signup-container">
        <div className="auth-header">
          <div className="auth-logo">
            <FaRecycle className="logo-icon" />
          </div>
          <h2>Join Our Community</h2>
          <p>Start your sustainable waste management journey today</p>
        </div>

        <form onSubmit={handleSignup} className="auth-form">
          <div className="input-group">
            <div className="input-icon">
              <FaUser />
            </div>
            <input 
              type="text" 
              placeholder="Enter your full name" 
              value={name}
              onChange={(e) => setName(e.target.value)} 
              required 
              className="auth-input" 
            />
          </div>

          <div className="input-group">
            <div className="input-icon">
              <FaEnvelope />
            </div>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="auth-input" 
            />
          </div>

          <div className="input-group">
            <div className="input-icon">
              <FaPhone />
            </div>
            <input 
              type="tel" 
              placeholder="Enter your phone number" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)} 
              required 
              className="auth-input" 
            />
          </div>

          <div className="input-group">
            <div className="input-icon">
              <FaLock />
            </div>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Create a password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="auth-input" 
            />
            <button 
              type="button" 
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button 
            type="submit" 
            className="auth-button signup-btn"
            disabled={loading}
          >
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              <>
                <span>Create Account</span>
                <FaArrowRight className="btn-icon" />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login" className="auth-link">Sign In</Link></p>
        </div>

        <div className="auth-features">
          <div className="feature-item">
            <div className="feature-icon">
              <FaRecycle />
            </div>
            <div className="feature-text">
              <h4>Earn Rewards</h4>
              <p>Get E-Coins for every waste contribution</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <FaRecycle />
            </div>
            <div className="feature-text">
              <h4>AI Detection</h4>
              <p>Smart waste classification technology</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;