import { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "../styles/Auth.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input type="text" placeholder="Full Name" onChange={(e) => setName(e.target.value)} required className="auth-input" />
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required className="auth-input" />
        <input type="text" placeholder="Phone Number" onChange={(e) => setPhone(e.target.value)} required className="auth-input" />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required className="auth-input" />
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Signup;