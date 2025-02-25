import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../styles/Tracking.css";
import LiveTrackingMap from "./LiveTrackingMap";

const initialLocation = { lat: 28.6139, lng: 77.2090 }; // Example vehicle location
const recyclingCenter = { lat: 28.7041, lng: 77.1025 }; // Example recycling center

const statusStages = [
  { label: "Scheduled", value: "scheduled" },
  { label: "On The Way", value: "onTheWay" },
  { label: "Picked Up", value: "pickedUp" },
  { label: "Recycled", value: "recycled" }
];

const Tracking = () => {
  const { trackingId } = useParams();
  const [pickup, setPickup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("scheduled"); // Initial status
  const [cashback, setCashback] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchPickupStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tracking/${trackingId}`);
        if (response.data) {
          setPickup(response.data);
          setStatus(response.data.status || "scheduled"); // Set initial status
          const cashbackAmount = calculateCashback(response.data);
          setCashback(cashbackAmount);
          const progressPercentage = calculateProgress(cashbackAmount);
          setProgress(progressPercentage);
        } else {
          setError("⚠️ No tracking details found.");
        }
      } catch (err) {
        setError("❌ Failed to fetch pickup status.");
      } finally {
        setLoading(false);
      }
    };

    fetchPickupStatus();
  }, [trackingId]);

  const handleStatusChange = () => {
    const currentIndex = statusStages.findIndex(s => s.value === status);
    if (currentIndex < statusStages.length - 1) {
      const nextStatus = statusStages[currentIndex + 1].value;
      setStatus(nextStatus);
    }
  };

  const calculateCashback = (pickup) => {
    const baseCashback = { laptop: 1000, mobile: 500, tv: 1500, fridge: 2000 };
    const conditionMultiplier = { excellent: 1.0, average: 0.7, poor: 0.5 };
    const processMultiplier = { recycle: 1.0, repair: 0.8, dispose: 0.5 };
    const product = pickup.product || "laptop";
    const condition = pickup.condition || "excellent";
    const process = pickup.process || "recycle";
    return ((baseCashback[product] || 0) * (conditionMultiplier[condition] || 0) * (processMultiplier[process] || 0)).toFixed(2);
  };

  const calculateProgress = (cashback) => {
    const milestones = [500, 1000, 2000, 5000];
    const nextMilestone = milestones.find(m => m > cashback) || milestones[milestones.length - 1];
    return (cashback / nextMilestone) * 100;
  };

  if (loading) return <p className="loading">⏳ Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="tracking">
      <h2>📦 Track Your E-Waste Pickup</h2>
      {pickup && (
        <div className="pickup-details">
          <p><strong>Product:</strong> {pickup.product}</p>
          <p><strong>Condition:</strong> {pickup.condition}</p>
          <p><strong>Process:</strong> {pickup.process}</p>
          <p><strong>Pickup Date:</strong> {pickup.pickupDate}</p>
          <p><strong>Pickup Time:</strong> {pickup.pickupTime}</p>
          <p><strong>Status:</strong> {status}</p>

          {/* Status Tracker */}
          <div className="status-tracker">
            {statusStages.map((stage, index) => (
              <div key={stage.value} className={`status-step ${status === stage.value ? "active" : ""}`}>
                <div className="step-number">{index + 1}</div>
                <div className="step-label">{stage.label}</div>
              </div>
            ))}
          </div>

          {/* Button to Simulate Status Update */}
          {status !== "recycled" && (
            <button className="status-button" onClick={handleStatusChange}>
              Next Status: {statusStages.find(s => s.value === status)?.label || "Scheduled"}
            </button>
          )}
          
          {/* 🗺️ Live Tracking Map */}
          <h3>🚚 Live Vehicle Tracking</h3>
          <LiveTrackingMap initialLocation={initialLocation} destination={recyclingCenter} />


          {/* Cashback */}
          <div className="cashback-section">
            <h3>💰 Estimated Cashback: ₹{cashback}</h3>
            <p>You're earning money while saving the planet! 🌍</p>
          </div>

          {/* Progress Bar */}
          <div className="progress-section">
            <h3>🚀 Progress Toward Next Milestone</h3>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${progress}%` }}></div>
            </div>
            <p>{progress.toFixed(2)}% completed</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tracking;
