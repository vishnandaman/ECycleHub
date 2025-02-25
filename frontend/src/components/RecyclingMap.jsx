import { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { updateDoc, increment, arrayUnion, doc } from "firebase/firestore"; // Add doc import
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { auth, db } from "../firebaseConfig"; // Import auth and db
import "../styles/Map.css";

// User location marker (blue icon)
const userIcon = new L.Icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [30, 45],  // Default Leaflet marker size
    shadowSize: [41, 41], 
    iconAnchor: [12, 41], 
    popupAnchor: [1, -34],
  });

// Recycler marker (green bin icon)
const recyclerIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png", 
    shadowUrl: markerShadow,
    iconSize: [25, 41], 
    shadowSize: [41, 41], 
    iconAnchor: [12, 41], 
    popupAnchor: [1, -34],
  });
  

// Hardcoded authorized recyclers
const recyclers = [
  {
    id: 1,
    name: "Hi-Tech Recycling (I) Pvt. Ltd",
    lat: 18.1500,
    lon: 73.8500,
    address: "Property No.193, Gat No. 89, Pune-Satara Road, Shindewadi, Tal: Bhor, Dist. Pune",
    phone: "9860602601",
  },
  {
    id: 2,
    name: "Green Enviro Management Solutions LLP",
    lat: 18.7662,
    lon: 73.5972,
    address: "Plot No. 51, Gat No. 376, Kanhe Phata, Tal. Mawal, Dist. Pune",
    phone: "9766110860",
  },
  {
    id: 3,
    name: "Ambar Enterprises",
    lat: 18.6881,
    lon: 73.7923,
    address: "Awutade, Handewadi, Tal. Haveli, Dist. Pune 411028",
    phone: "9890812746",
  },
  {
    "id": 4,
    "name": "National Traders",
    "lat": 18.48691278902787,
    "lon": 73.93910611974681,
    "address": "S. No. 103/1/2, Undri-Saswad Road, Autade, Handewadi, Tal. Haveli, Dist. Pune",
    "phone": "9850757587"
  },
  {
    "id": 5,
    "name": "AG Enterprises",
    "lat": 18.675705579672396,
    "lon": 73.81626244142696,
    "address": "Gat No. 815 (1), Kudalwadi, Chikhali, Pune 411062",
    "phone": "9822783051"
  },
  {
    "id": 6,
    "name": "Pune Greens Electronic Waste Recycler Pvt. Ltd.",
    "lat": 18.431130107758886,
    "lon": 73.88423215386418,
    "address": "Sr. No. 63/1, B-4/1, Handewadi Road, Hadapsar, Pune",
    "phone": "9922071877"
  },
  {
    "id": 7,
    "name": "Poona E-Waste Solutions",
    "lat": 18.45888330404195,
    "lon": 73.95000946672884,
    "address": "1/1009, Gat No. 2334/4, Wagholi, Pune 412207",
    "phone": "8888999362"
  },
  {
    "id": 8,
    "name": "Eco Tantra LLP",
    "lat": 18.47011311598069,
    "lon": 73.79314199556498,
    "address": "M-365, Raviwar Peth, Bohari Lane, Tal. & Dist. Pune",
    "phone": "8981473653"
  },
  {
    "id": 9,
    "name": "Prabhunath Traders",
    "lat": 18.4700,
    "lon": 73.9700,
    "address": "Sr. No. 314, H. No. 2, Uruli Devachi, Tal. Haveli, Dist. Pune",
    "phone": "9326262223"
  },
  {
    "id": 10,
    "name": "Sultan Disposal Stores",
    "lat": 18.44519473596473,
    "lon": 73.85799687228132,
    "address": "68/03, near jain mandir, Santosh Nagar, Katraj, Pune, Maharashtra 411046",
    "phone": "9822082794"
  },
  {
    "id": 11,
    "name": "Harshita Green Recyclers",
    "lat": 18.50750425786666,
    "lon": 73.85343059556592,
    "address": "1937, Bajirao Rd, opposite to Bharat Sanchar Nigam Limited Bajirao road, Madiwale Colony, Sadashiv Peth, Pune, Maharashtra 411030",
    "phone": "9850205186"
  },
  {
    "id": 12,
    "name": "Green IT Recycling Center Pvt Ltd",
    "lat": 18.512971694752157, 
    "lon": 73.84875504479758,
    "address": "Plot No. D-222, MIDC Ranjangaon, Dist.- Pune - 412209",
    "phone": "9822356062"
  },
  {
    "id": 13,
    "name": "Anand Computer System",
    "lat": 18.504240279938774, 
    "lon": 73.84805907790916,
    "address": "2160 B, Sadashiv Peth, Swamipuram Bldg, Shop No. 7,8,9, Pune - 411030",
    "phone": "9371015373"
  },
  {
    "id": 14,
    "name": "Greenscape Eco Management Private Limited",
    "lat": 12.849435906851426,
    "lon": 77.68944112524032,
    "address": "MIDC Chakan Industrial Area (Ph-II), Pune - 410501",
    "phone": "7558426313"
  },
  {
    "id": 15,
    "name": "Kuldeep E-Waste Disposals",
    "lat": 18.449947252079447, 
    "lon": 73.85756684533968,
    "address": "Sr. No. 50, Waghjainagar, Mabegaon Khurd, Katraj-Ambegaon Road, Katraj, Pune - 411046",
    "phone": "9850289885"
  },
  {
    "id": 16,
    "name": "Connect Info Solutions India Private Limited",
    "lat": 19.12399031846611, 
    "lon": 72.82507444910374,
    "address": "c/o: A-one Logistics Shop No 4, Saibaba Apartment, Plot No 12, Sector 9, Near Corporation Bank, Khanda Colony, New Panvel - 410206",
    "phone": "9820297108"
  },
  {
    "id":17,
    "name": "Mac Fix Station",
    "lat": 19.056530258245026, 
    "lon": 72.83871993745053,
    "address": "Office No. 201, Makhija Arcade, 35th Road, Khar Bandra Linking Road, Bandra, Mumbai Suburban - 400052",
    "phone": "8879765306"
  },
  {
    "id": 18,
    "name": "Manish Metal",
    "lat": 19.019206062965214, 
    "lon": 72.84120060862939,
    "address": "Gat No 925, Near Ashtekar Bangla, A/P- Theur, Dist- Pune - 412110",
    "phone": "9850059804"
  },
  {
    "id": 19,
    "name": "Nagraj E-Waste Recycling",
    "lat": 21.153457028876623, 
    "lon": 79.11914766408994,
    "address": "S.No.41 Vill Asoli Mouza Mahalgaon Tah Kamptee Dist Nagpur - 441202",
    "phone": "9595105301"
  },
  {
    "id": 21,
    "name": "Green Valley E Waste Management Pvt Ltd",
    "lat": 19.492762278085667, 
    "lon": 73.07993080677532,
    "address": "Gut No. 525/10, Village-Ghonsai, Saza-Met, Tal. Wada, Ghonsai, Palghar - 421312",
    "phone": "9821021395"
  },
  {
    "id": 22,
    "name": "New Ecotech Recycling",
    "lat": 19.5579835588148, 
    "lon": 73.11851463371843,
    "address": "Survey no. 136, Hissa no. 364, At Post - Khaniwade, Taluka Vasai, District. Palghar-401305",
    "phone": "9096088943"
  },
  {
    "id": 23,
    "name": "R.K.E-Recycling International LLP",
    "lat": 19.11861949304426, 
    "lon": 72.87044860677366,
    "address": "Gala no.-2, Tirupati Industrial Park, Sativali Road, Vasai East- 401208",
    "phone": "9004211892"
  },
  {
    "id": 24,
    "name": "CBS E-Waste Recycling Industries",
    "lat": 19.098633204127957, 
    "lon": 72.88773373562022,
    "address": "G.No. 18/63/2, At. Khanapur, Tal. Akole, Dist. Ahmednagar",
    "phone": "8275451169"
  },
  {
    "id": 25,
    "name": "J.S. Enterprises",
    "lat": 18.623177641449857, 
    "lon": 73.79992855097937,
    "address": "Gat No-132, Khalumbre, Chakan - 410501",
    "phone": "9921280827"
  },
  {
    "id": 26,
    "name": "Scape E Recycler Private Limited",
    "lat": 19.180736098503623, 
    "lon": 77.0408843221353,
    "address": "Near Bus Stand, Behind Hotel Chandralok, Shikshak Colony, Purna Dist. Parbhani, Purna, Parbhani - 431511",
    "phone": "9970062892"
  },
  {
    "id": 27,
    "name": "Nicholas Recycling Private Limited",
    "lat": 19.407146769366026, 
    "lon": 72.86610076258923,
    "address": "Nicholas Compound, Sativali Road, Valiv.",
    "phone": "9821010148"
  },
  {
    "id": 28,
    "name": "Wonder Print Technologies",
    "lat": 20.027146515759117, 
    "lon": 73.71442647943134,
    "address": "Plot No. M-36, MIDC Ambad, Dist. Nashik",
    "phone": "9373522555"
  },
  {
    "id": 29,
    "name": "Process Recycling",
    "lat": 19.476131129352908, 
    "lon": 72.89269773387934,
    "address": "Gala No,2, S. No 302, Richard Compound, Near Maharashtra Vajan Kata, Umang pharma road, Vasaiphata, Dist. Palghar",
    "phone": "7757967675"
  }
];

// Hook to handle map clicks (for future gamification)
const ClickHandler = ({ onVisit }) => {
  useMapEvents({
    click: (e) => {
      onVisit(e.latlng);
    },
  });
  return null;
};

const RecyclingMap = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [visitedRecyclers, setVisitedRecyclers] = useState(new Set());
    const [minDistance, setMinDistance] = useState(null);
  
    useEffect(() => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation([position.coords.latitude, position.coords.longitude]);
          },
          (error) => {
            console.error("Geolocation error:", error);
          }
        );
      }
    }, []);
  
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      if (!lat1 || !lon1 || !lat2 || !lon2) return null;
      const point1 = L.latLng(lat1, lon1);
      const point2 = L.latLng(lat2, lon2);
      return Math.round(point1.distanceTo(point2));
    };
  
    const updateNearestRecycler = useCallback(() => {
      if (!userLocation || !recyclers.length) return;
  
      const distances = recyclers.map((recycler) => ({
        id: recycler.id,
        distance: calculateDistance(userLocation[0], userLocation[1], recycler.lat, recycler.lon),
      }));
  
      const nearest = distances.reduce((min, current) => (current.distance < min.distance ? current : min));
  
      setMinDistance(nearest);
    }, [userLocation]);
  
    useEffect(() => {
      updateNearestRecycler();
    }, [userLocation, updateNearestRecycler]);
  
    const handleVisit = async (recyclerId) => {
        if (visitedRecyclers.has(recyclerId)) return; // Prevent duplicate visits
    
        const user = auth.currentUser;
        if (!user) {
          alert("Please log in to earn E-Coins!");
          return;
        }
    
        try {
          const userRef = doc(db, "users", user.uid);
    
          // Update E-Coins in Firestore
          await updateDoc(userRef, {
            ecoins: increment(10), // Increment E-Coins by 10
          });
    
          // Add transaction history
          await updateDoc(userRef, {
            transactions: arrayUnion({
              type: "Recycler Visit",
              amount: 10,
              timestamp: new Date().toISOString(),
            }),
          });
    
          setVisitedRecyclers((prev) => new Set(prev).add(recyclerId));
          alert("🎉 You earned 10 E-Coins for visiting a recycling center!");
        } catch (error) {
          console.error("Error updating E-Coins:", error);
        }
      };
  
    return (
      <div className="map-container">
        <p className="map-info">Click a recycler to mark it as visited & earn E-Coins!</p>
  
        <MapContainer center={userLocation || [20.5937, 78.9629]} zoom={6} style={{ height: "500px", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  
          {/* User Location Marker */}
          {userLocation && (
            <Marker position={userLocation} icon={userIcon}>
              <Popup><strong>You are here!</strong></Popup>
            </Marker>
          )}
  
          {/* Recycler Markers */}
          {recyclers.map((recycler) => {
            const distance = userLocation ? calculateDistance(userLocation[0], userLocation[1], recycler.lat, recycler.lon) : null;
  
            return (
              <Marker key={recycler.id} position={[recycler.lat, recycler.lon]} icon={recyclerIcon} eventHandlers={{ click: () => handleVisit(recycler.id) }}>
                <Popup>
                  <strong>{recycler.name}</strong>
                  <br />
                  📍 {recycler.address}
                  <br />
                  📞 {recycler.phone}
                  <br />
                  {distance && <div>📏 Distance: {distance} meters</div>}
                  <br />
                  {visitedRecyclers.has(recycler.id) ? "✅ Visited!" : "👆 Click to visit & earn E-Coins"}
                </Popup>
              </Marker>
            );
          })}
  
          <ClickHandler onVisit={() => {}} />
        </MapContainer>
  
        {/* Nearest Recycler Alert */}
        {minDistance && (
          <div className="min-distance-alert">
            <strong>Nearest Recycler Found! 👉</strong><br />
            {recyclers.find((r) => r.id === minDistance.id)?.name}<br />
            Only {minDistance.distance} meters away!
          </div>
        )}
      </div>
    );
  };
  
  export default RecyclingMap;