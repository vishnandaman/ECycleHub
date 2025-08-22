import { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaRecycle, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../styles/Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in:", userCredential.user); // Debugging log
      toast.success("Welcome back! 🎉");
    } catch (error) {
      console.error("Login error:", error); // Debugging log
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background"></div>
      
      <div className="auth-container login-container">
        <div className="auth-header">
          <div className="auth-logo">
            <FaRecycle className="logo-icon" />
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to continue your eco-friendly journey</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
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
              <FaLock />
            </div>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Enter your password" 
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
            className="auth-button login-btn"
            disabled={loading}
          >
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              <>
                <span>Sign In</span>
                <FaArrowRight className="btn-icon" />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link></p>
        </div>

        <div className="auth-features">
          <div className="feature-item">
            <div className="feature-icon">
              <FaRecycle />
            </div>
            <div className="feature-text">
              <h4>Smart Waste Management</h4>
              <p>AI-powered waste classification</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;