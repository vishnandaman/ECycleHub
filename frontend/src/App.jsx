import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EwasteForm from "./components/EwasteForm";
import Tracking from "./components/Tracking";
import RefurbishedStore from "./pages/RefurbishedStore";

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ewaste-form" element={<EwasteForm/>}/>
        <Route path="/tracking/:trackingId" element={<Tracking/>}/>
        <Route path="/refurbished-store" element={<RefurbishedStore />} />
      </Routes>
    </Router>
  );
}

export default App;
