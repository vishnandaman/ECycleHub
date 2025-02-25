import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import vehicleMarker from "../assets/vehicle-marker.png";
const vehicleIcon = L.icon({
    iconUrl: vehicleMarker, // Replace with actual truck icon path
    iconSize: [240, 120], // Size of the icon
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

const userIcon = new L.Icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [30, 45],  // Default Leaflet marker size
    shadowSize: [41, 41], 
    iconAnchor: [12, 41], 
    popupAnchor: [1, -34],
  });

const LiveTrackingMap = ({ initialLocation, destination }) => {
  const [vehicleLocation, setVehicleLocation] = useState(initialLocation);

  useEffect(() => {
    const interval = setInterval(() => {
      setVehicleLocation(prev => ({
        lat: prev.lat + (destination.lat - prev.lat) * 0.1,
        lng: prev.lng + (destination.lng - prev.lng) * 0.1
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [destination]);

  return (
    <MapContainer center={vehicleLocation} zoom={13} style={{ height: "300px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={vehicleLocation} icon={vehicleIcon}>
        <Popup>Pickup Vehicle</Popup>
      </Marker>
      <Marker position={destination} icon={userIcon}>
        <Popup>User</Popup>
      </Marker>
    </MapContainer>
  );
};

export default LiveTrackingMap;
