import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { updateDoc, increment, arrayUnion, doc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import "../styles/EwasteForm.css";

const EwasteForm = () => {
  const [product, setProduct] = useState(""); // E-Waste product type
  const [category, setCategory] = useState(""); // Category
  const [condition, setCondition] = useState("excellent"); // Overall condition
  const [process, setProcess] = useState("recycle"); // Preferred process
  const [issues, setIssues] = useState(""); // Description of issues
  const [selectedIssues, setSelectedIssues] = useState([]); // Common issues
  const [weight, setWeight] = useState(""); // Weight (optional)
  const [pickupDate, setPickupDate] = useState(""); // Pickup date
  const [pickupTime, setPickupTime] = useState(""); // Pickup time
  const [image, setImage] = useState(null); // Uploaded image
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error message
  const navigate = useNavigate();

  // Common issues mapping
  const commonIssuesMapping = {
    laptop: [
      { value: "battery", label: "Battery Issue" },
      { value: "screen", label: "Screen Damage" },
      { value: "keyboard", label: "Keyboard/Touchpad Issue" },
      { value: "ports", label: "Ports/Connectivity Problem" },
      { value: "motherboard", label: "Motherboard Fault" },
      { value: "ssd", label: "SSD / Hard Drive Issue" },
      { value: "cooling", label: "Cooling System (Fan/Heatsink) Issue" },
    ],
    mobile: [
      { value: "battery", label: "Battery Issue" },
      { value: "screen", label: "Screen Damage" },
      { value: "pcb", label: "PCB (Circuit Board) Issue" },
      { value: "camera", label: "Camera Module Issue" },
      { value: "casing", label: "Casing Damage" },
      { value: "speaker", label: "Speaker Issue" },
      { value: "buttons", label: "Buttons/Ports Issue" },
      { value: "sensors", label: "Sensor Issue" },
    ],
    tv: [
      { value: "screen", label: "Screen Panel Damage" },
      { value: "power", label: "Power Supply Board Issue" },
      { value: "circuit", label: "Circuit Board Fault" },
      { value: "speakers", label: "Speaker Issues" },
      { value: "casing", label: "Casing Damage" },
    ],
    fridge: [
      { value: "compressor", label: "Compressor Issue" },
      { value: "metal", label: "Metal Body Damage" },
      { value: "circuit", label: "Circuit Board Issue" },
      { value: "refrigerant", label: "Refrigerant System Problem" },
    ],
  };

  // Mapping ML predictions to product categories
  const productMapping = {
    Battery: "battery",
  Keyboard: "keyboard",
  Microwave: "microwave",
  Mobile: "mobile",
  Mouse: "mouse",
  PCB: "pcb",
  Player: "player",
  Printer: "printer",
  Television: "television",
  "Washing Machine": "washing_machine",
  };

  // Handle image upload and predict category
  const handleImageUpload = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setError(""); // Reset errors

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5001/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data && response.data.prediction) {
        const predictedCategory = response.data.prediction;
        const mappedProduct = productMapping[predictedCategory] || "miscellaneous";

        setProduct(mappedProduct); // Autofill E-Waste Type
        setCategory(predictedCategory); // Autofill Category

        console.log(`✅ ML Prediction: ${predictedCategory}, Mapped to: ${mappedProduct}`);
      } else {
        throw new Error("Invalid response format from ML model.");
      }
    } catch (err) {
      console.error("❌ ML Prediction Error:", err);
      setError("Failed to predict category. Please select manually.");
    }
  };
  const handleProductChange = (e) => {
    const selectedProduct = e.target.value;
    setProduct(selectedProduct);
    setSelectedIssues([]); // Reset selected issues when product changes
  };

  // Handle common issues selection
  const handleIssueSelection = (e) => {
    const { value, checked } = e.target;
    setSelectedIssues((prev) =>
      checked ? [...prev, value] : prev.filter((issue) => issue !== value)
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to schedule a pickup!");
      setLoading(false);
      return;
    }

    const requestData = {
      product,
      category: category || "Miscellaneous",
      condition,
      process,
      issues,
      selectedIssues,
      weight: weight || "1",
      pickupDate: pickupDate || new Date().toISOString().split("T")[0],
      pickupTime: pickupTime || "10:00",
      image:image?URL.createObjectURL(image):null,
    };

    try {
      const response = await axios.post("http://localhost:5000/api/schedule-pickup", requestData);
      if (response.data.success) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { ecoins: increment(50) });

        await updateDoc(userRef, {
          transactions: arrayUnion({
            type: "Pickup Scheduled",
            amount: 50,
            timestamp: new Date().toISOString(),
          }),
        });

        if (!response.data || !response.data.trackingId) {
            setError("Invalid response from server.");
            setLoading(false);
            return;
        }
        navigate(`/tracking/${response.data.trackingId}`);
      } else {
        throw new Error("Pickup request failed.");
      }
    } catch (err) {
      console.error("❌ Pickup Request Error:", err);
      setError("Failed to schedule pickup. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ewaste-form">
      <h2>♻️ Schedule E-Waste Pickup & Valuation</h2>
      <form onSubmit={handleSubmit}>
        {/* Image Upload */}
        <div className="form-group">
          <label>Upload E-Waste Image (Optional):</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>

        {/* Product Selection */}
        <div className="form-group">
          <label>Select Your E-Waste:</label>
          <select value={product} onChange={(e) => setProduct(e.target.value)} required>
            <option value="">-- Select --</option>
            <option value="battery">Battery</option>
            <option value="keyboard">Keyboard</option>
            <option value="microwave">Microwave</option>
            <option value="mobile">Mobile Phone</option>
            <option value="mouse">Mouse</option>
            <option value="pcb">PCB (Circuit Board)</option>
            <option value="player">Music Player</option>
            <option value="printer">Printer</option>
            <option value="television">Television</option>
            <option value="washing_machine">Washing Machine</option>
          </select>
        </div>

        {/* Category */}
        <div className="form-group">
          <label>Category (Optional):</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Auto-filled from image or enter manually"
          />
        </div>

        {/* Condition */}
        <div className="form-group">
          <label>Overall Condition:</label>
          <select value={condition} onChange={(e) => setCondition(e.target.value)} required>
            <option value="excellent">Excellent / Like New</option>
            <option value="average">Average / Minor Issues</option>
            <option value="poor">Poor / Major Faults</option>
          </select>
        </div>

        {/* Preferred Process */}
        <div className="form-group">
          <label>Preferred Process:</label>
          <select value={process} onChange={(e) => setProcess(e.target.value)} required>
            <option value="recycle">Recycle</option>
            <option value="repair">Repair</option>
            <option value="dispose">Dispose</option>
          </select>
        </div>

        {/* Issues Description */}
        <div className="form-group">
          <label>Describe the issues (briefly):</label>
          <textarea
            value={issues}
            onChange={(e) => setIssues(e.target.value)}
            placeholder="e.g., Battery drains fast, screen has dead pixels..."
          />
        </div>


        {/* Weight */}
        <div className="form-group">
          <label>Weight (kg) (Optional):</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter or leave blank"
          />
        </div>

        {/* Pickup Date */}
        <div className="form-group">
          <label>Pickup Date (Optional):</label>
          <input
            type="date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        {/* Pickup Time */}
        <div className="form-group">
          <label>Pickup Time (Optional):</label>
          <input
            type="time"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Schedule Pickup & Get Valuation"}
        </button>

        {/* Error Message */}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default EwasteForm;