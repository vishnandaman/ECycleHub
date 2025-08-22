import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { updateDoc, increment, arrayUnion, doc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import config from "../config";
import { 
  FaRecycle, 
  FaCamera, 
  FaUpload, 
  FaCalendarAlt, 
  FaClock, 
  FaWeightHanging,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaArrowRight,
  FaLeaf,
  FaMobile,
  FaLaptop,
  FaTv,
  FaPrint,
  FaBatteryFull,
  FaMouse,
  FaMicrochip
} from "react-icons/fa";
import "../styles/EwasteForm.css";

const EwasteForm = () => {
  const [formData, setFormData] = useState({
    product: "",
    category: "",
    condition: "excellent",
    process: "recycle",
    issues: "",
    selectedIssues: [],
    weight: "",
    pickupDate: "",
    pickupTime: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [mlPrediction, setMlPrediction] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const navigate = useNavigate();

  // Common issues mapping
  const commonIssuesMapping = {
    laptop: [
      { value: "battery", label: "Battery Issue", icon: FaBatteryFull },
      { value: "screen", label: "Screen Damage", icon: FaTv },
      { value: "keyboard", label: "Keyboard/Touchpad Issue", icon: FaLaptop },
      { value: "ports", label: "Ports/Connectivity Problem", icon: FaMicrochip },
      { value: "motherboard", label: "Motherboard Fault", icon: FaMicrochip },
      { value: "ssd", label: "SSD / Hard Drive Issue", icon: FaMicrochip },
      { value: "cooling", label: "Cooling System Issue", icon: FaSpinner },
    ],
    mobile: [
      { value: "battery", label: "Battery Issue", icon: FaBatteryFull },
      { value: "screen", label: "Screen Damage", icon: FaMobile },
      { value: "pcb", label: "PCB (Circuit Board) Issue", icon: FaMicrochip },
      { value: "camera", label: "Camera Module Issue", icon: FaCamera },
      { value: "casing", label: "Casing Damage", icon: FaMobile },
      { value: "speaker", label: "Speaker Issue", icon: FaMobile },
      { value: "buttons", label: "Buttons/Ports Issue", icon: FaMobile },
      { value: "sensors", label: "Sensor Issue", icon: FaMicrochip },
    ],
    tv: [
      { value: "screen", label: "Screen Panel Damage", icon: FaTv },
      { value: "power", label: "Power Supply Board Issue", icon: FaMicrochip },
      { value: "circuit", label: "Circuit Board Fault", icon: FaMicrochip },
      { value: "speakers", label: "Speaker Issues", icon: FaTv },
      { value: "casing", label: "Casing Damage", icon: FaTv },
    ],
    fridge: [
      { value: "compressor", label: "Compressor Issue", icon: FaSpinner },
      { value: "metal", label: "Metal Body Damage", icon: FaWeightHanging },
      { value: "circuit", label: "Circuit Board Issue", icon: FaMicrochip },
      { value: "refrigerant", label: "Refrigerant System Problem", icon: FaSpinner },
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
    setError("");
    setIsAnalyzing(true);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${config.ML_API_URL}/predict`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data && response.data.prediction) {
        const predictedCategory = response.data.prediction;
        const mappedProduct = productMapping[predictedCategory] || "miscellaneous";

        setFormData(prev => ({
          ...prev,
          product: mappedProduct,
          category: predictedCategory
        }));

        setMlPrediction({
          category: predictedCategory,
          confidence: response.data.confidence || 0.85
        });

        console.log(`✅ ML Prediction: ${predictedCategory}, Mapped to: ${mappedProduct}`);
      } else {
        throw new Error("Invalid response format from ML model.");
      }
    } catch (error) {
      console.error("ML prediction failed:", error);
      setError("Image analysis failed. Please select the category manually.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleIssueToggle = (issue) => {
    setFormData(prev => ({
      ...prev,
      selectedIssues: prev.selectedIssues.includes(issue)
        ? prev.selectedIssues.filter(i => i !== issue)
        : [...prev.selectedIssues, issue]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      const userRef = doc(db, "users", user.uid);
      
      // Calculate E-Coins based on item type and condition
      const ecoinsEarned = calculateEcoins(formData.product, formData.condition);

      await updateDoc(userRef, {
        ecoins: increment(ecoinsEarned),
        transactions: arrayUnion({
          type: "E-Waste Recycling",
          amount: ecoinsEarned,
          timestamp: new Date(),
          item: formData.product,
          category: formData.category
        }),
        eWasteListings: arrayUnion({
          item: formData.product,
          category: formData.category,
          condition: formData.condition,
          status: "Scheduled",
          date: new Date(),
          pickupDate: formData.pickupDate,
          pickupTime: formData.pickupTime,
          ecoinsEarned: ecoinsEarned
        })
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);

    } catch (error) {
      console.error("Form submission failed:", error);
      setError("Failed to submit form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateEcoins = (product, condition) => {
    const baseEcoins = {
      laptop: 50,
      mobile: 30,
      tv: 40,
      printer: 25,
      battery: 15,
      keyboard: 10,
      mouse: 8,
      pcb: 20,
      microwave: 35,
      washing_machine: 45,
      miscellaneous: 20
    };

    const conditionMultiplier = {
      excellent: 1.2,
      good: 1.0,
      fair: 0.8,
      poor: 0.6
    };

    return Math.round((baseEcoins[product] || 20) * conditionMultiplier[condition]);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (success) {
    return (
      <div className="success-container">
        <div className="success-content">
          <div className="success-animation">
            <FaCheckCircle className="success-icon" />
          </div>
          <h2>🎉 Pickup Scheduled Successfully!</h2>
          <p>Your e-waste pickup has been scheduled and you've earned E-Coins!</p>
          <div className="success-details">
            <div className="detail-item">
              <FaRecycle className="detail-icon" />
              <span>Item: {formData.product}</span>
            </div>
            <div className="detail-item">
              <FaCalendarAlt className="detail-icon" />
              <span>Date: {formData.pickupDate}</span>
            </div>
            <div className="detail-item">
              <FaClock className="detail-icon" />
              <span>Time: {formData.pickupTime}</span>
            </div>
          </div>
          <p className="redirect-text">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ewaste-form-container">
      {/* Header */}
      <div className="form-header">
        <div className="header-content">
          <h1 className="form-title">
            <FaRecycle className="title-icon" />
            Schedule E-Waste Pickup
          </h1>
          <p className="form-subtitle">
            Help us make the world greener by recycling your electronic waste responsibly
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="progress-steps">
        {[1, 2, 3].map((step) => (
          <div 
            key={step} 
            className={`step ${currentStep >= step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
          >
            <div className="step-number">{step}</div>
            <span className="step-label">
              {step === 1 ? 'Item Details' : step === 2 ? 'Pickup Info' : 'Review & Submit'}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="ewaste-form">
        {/* Step 1: Item Details */}
        {currentStep === 1 && (
          <div className="form-step step-1">
            <div className="step-content">
              <h3 className="step-title">
                <FaLeaf className="step-icon" />
                Tell us about your e-waste item
              </h3>

              {/* Image Upload Section */}
              <div className="image-upload-section">
                <div className="upload-area">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file-input"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="upload-label">
                    {imagePreview ? (
                      <div className="image-preview">
                        <img src={imagePreview} alt="Preview" />
                        <div className="preview-overlay">
                          <FaCamera className="overlay-icon" />
                          <span>Change Image</span>
                        </div>
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <FaCamera className="upload-icon" />
                        <span>Upload Image for AI Analysis</span>
                        <small>Click to select an image of your e-waste item</small>
                      </div>
                    )}
                  </label>
                </div>

                {isAnalyzing && (
                  <div className="analyzing">
                    <FaSpinner className="spinner" />
                    <span>Analyzing image with AI...</span>
                  </div>
                )}

                {mlPrediction && (
                  <div className="ml-prediction">
                    <FaCheckCircle className="prediction-icon" />
                    <div className="prediction-content">
                      <span className="prediction-text">
                        AI detected: <strong>{mlPrediction.category}</strong>
                      </span>
                      <span className="confidence-text">
                        Confidence: {Math.round(mlPrediction.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Product Type Selection */}
              <div className="form-group">
                <label className="form-label">
                  <FaRecycle className="label-icon" />
                  E-Waste Type
                </label>
                <select
                  value={formData.product}
                  onChange={(e) => handleInputChange('product', e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="">Select e-waste type</option>
                  <option value="laptop">Laptop/Computer</option>
                  <option value="mobile">Mobile Phone</option>
                  <option value="tv">Television</option>
                  <option value="printer">Printer</option>
                  <option value="battery">Battery</option>
                  <option value="keyboard">Keyboard</option>
                  <option value="mouse">Mouse</option>
                  <option value="pcb">PCB/Circuit Board</option>
                  <option value="microwave">Microwave</option>
                  <option value="washing_machine">Washing Machine</option>
                  <option value="miscellaneous">Other</option>
                </select>
              </div>

              {/* Category */}
              <div className="form-group">
                <label className="form-label">
                  <FaMicrochip className="label-icon" />
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="form-input"
                  placeholder="Category (auto-filled by AI)"
                  readOnly={!!mlPrediction}
                />
              </div>

              {/* Condition */}
              <div className="form-group">
                <label className="form-label">
                  <FaCheckCircle className="label-icon" />
                  Overall Condition
                </label>
                <div className="condition-options">
                  {['excellent', 'good', 'fair', 'poor'].map((condition) => (
                    <label key={condition} className="condition-option">
                      <input
                        type="radio"
                        name="condition"
                        value={condition}
                        checked={formData.condition === condition}
                        onChange={(e) => handleInputChange('condition', e.target.value)}
                      />
                      <span className="condition-label">{condition}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Issues Selection */}
              {commonIssuesMapping[formData.product] && (
                <div className="form-group">
                  <label className="form-label">
                    <FaExclamationTriangle className="label-icon" />
                    Common Issues (Select all that apply)
                  </label>
                  <div className="issues-grid">
                    {commonIssuesMapping[formData.product].map((issue) => {
                      const IconComponent = issue.icon;
                      return (
                        <label key={issue.value} className="issue-option">
                          <input
                            type="checkbox"
                            checked={formData.selectedIssues.includes(issue.value)}
                            onChange={() => handleIssueToggle(issue.value)}
                          />
                          <div className="issue-content">
                            <IconComponent className="issue-icon" />
                            <span>{issue.label}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Weight */}
              <div className="form-group">
                <label className="form-label">
                  <FaWeightHanging className="label-icon" />
                  Weight (Optional)
                </label>
                <input
                  type="text"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className="form-input"
                  placeholder="e.g., 2.5 kg"
                />
              </div>
            </div>

            <div className="step-actions">
              <button type="button" onClick={nextStep} className="next-btn">
                Next Step <FaArrowRight />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Pickup Information */}
        {currentStep === 2 && (
          <div className="form-step step-2">
            <div className="step-content">
              <h3 className="step-title">
                <FaCalendarAlt className="step-icon" />
                Schedule Pickup Details
              </h3>

              {/* Preferred Process */}
              <div className="form-group">
                <label className="form-label">
                  <FaRecycle className="label-icon" />
                  Preferred Process
                </label>
                <select
                  value={formData.process}
                  onChange={(e) => handleInputChange('process', e.target.value)}
                  className="form-select"
                >
                  <option value="recycle">Recycle</option>
                  <option value="refurbish">Refurbish</option>
                  <option value="donate">Donate</option>
                </select>
              </div>

              {/* Pickup Date */}
              <div className="form-group">
                <label className="form-label">
                  <FaCalendarAlt className="label-icon" />
                  Preferred Pickup Date
                </label>
                <input
                  type="date"
                  value={formData.pickupDate}
                  onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                  className="form-input"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              {/* Pickup Time */}
              <div className="form-group">
                <label className="form-label">
                  <FaClock className="label-icon" />
                  Preferred Pickup Time
                </label>
                <select
                  value={formData.pickupTime}
                  onChange={(e) => handleInputChange('pickupTime', e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="">Select time slot</option>
                  <option value="09:00-11:00">09:00 AM - 11:00 AM</option>
                  <option value="11:00-13:00">11:00 AM - 01:00 PM</option>
                  <option value="14:00-16:00">02:00 PM - 04:00 PM</option>
                  <option value="16:00-18:00">04:00 PM - 06:00 PM</option>
                </select>
              </div>

              {/* Additional Issues Description */}
              <div className="form-group">
                <label className="form-label">
                  <FaExclamationTriangle className="label-icon" />
                  Additional Issues Description
                </label>
                <textarea
                  value={formData.issues}
                  onChange={(e) => handleInputChange('issues', e.target.value)}
                  className="form-textarea"
                  placeholder="Describe any specific issues or concerns about your e-waste item..."
                  rows="4"
                />
              </div>
            </div>

            <div className="step-actions">
              <button type="button" onClick={prevStep} className="prev-btn">
                Previous
              </button>
              <button type="button" onClick={nextStep} className="next-btn">
                Next Step <FaArrowRight />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {currentStep === 3 && (
          <div className="form-step step-3">
            <div className="step-content">
              <h3 className="step-title">
                <FaCheckCircle className="step-icon" />
                Review & Submit
              </h3>

              <div className="review-summary">
                <div className="summary-section">
                  <h4>Item Details</h4>
                  <div className="summary-item">
                    <span className="summary-label">Type:</span>
                    <span className="summary-value">{formData.product}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Category:</span>
                    <span className="summary-value">{formData.category}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Condition:</span>
                    <span className="summary-value">{formData.condition}</span>
                  </div>
                  {formData.selectedIssues.length > 0 && (
                    <div className="summary-item">
                      <span className="summary-label">Issues:</span>
                      <span className="summary-value">{formData.selectedIssues.join(', ')}</span>
                    </div>
                  )}
                </div>

                <div className="summary-section">
                  <h4>Pickup Details</h4>
                  <div className="summary-item">
                    <span className="summary-label">Process:</span>
                    <span className="summary-value">{formData.process}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Date:</span>
                    <span className="summary-value">{formData.pickupDate}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Time:</span>
                    <span className="summary-value">{formData.pickupTime}</span>
                  </div>
                </div>

                <div className="ecoins-preview">
                  <FaRecycle className="ecoins-icon" />
                  <div className="ecoins-info">
                    <span className="ecoins-amount">+{calculateEcoins(formData.product, formData.condition)} E-Coins</span>
                    <span className="ecoins-text">You'll earn this for recycling!</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="error-message">
                  <FaExclamationTriangle className="error-icon" />
                  {error}
                </div>
              )}
            </div>

            <div className="step-actions">
              <button type="button" onClick={prevStep} className="prev-btn">
                Previous
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="spinner" />
                    Scheduling Pickup...
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    Schedule Pickup
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default EwasteForm;