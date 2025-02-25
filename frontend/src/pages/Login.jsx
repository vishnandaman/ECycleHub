import { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import "../styles/Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in:", userCredential.user); // Debugging log
      toast.success("Logged in successfully! 🎉");
    } catch (error) {
      console.error("Login error:", error); // Debugging log
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required className="auth-input" />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required className="auth-input" />
        <button type="submit" className="auth-button">Login</button>
      </form>
    </div>
  );
};

export default Login;