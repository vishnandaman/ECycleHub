import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const EwasteCertificate = ({ name, eCoins, impactStats }) => {
  const certificateRef = useRef();

  const handleDownload = () => {
    const input = certificateRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a4");
      pdf.addImage(imgData, "PNG", 10, 10, 280, 200);
      pdf.save(`E-Waste_Certificate_${name}.pdf`);
    });
  };

  return (
    <div>
      {/* Certificate UI */}
      <div
        ref={certificateRef}
        style={{
          width: "800px",
          height: "600px",
          padding: "20px",
          textAlign: "center",
          border: "5px solid green",
          background: "#f4f4f4",
          margin: "auto",
        }}
      >
        <h1 style={{ color: "green" }}>E-Waste Recycling Certificate</h1>
        <h2>Presented to:</h2>
        <h2 style={{ fontSize: "30px", fontWeight: "bold" }}>{name}</h2>
        <p>For actively contributing to e-waste recycling and sustainability.</p>
        <p><b>E-Coins Earned:</b> {eCoins}</p>
        <p><b>Environmental Impact:</b></p>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>♻️ CO₂ Saved: {impactStats.co2Saved} kg</li>
          <li>🌍 Landfill Space Reduced: {impactStats.landfillReduced} m³</li>
          <li>⚡ Energy Saved: {impactStats.energySaved} kWh</li>
        </ul>
        <p>Thank you for making the world greener! 🌱</p>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "18px",
          background: "green",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Download Certificate 📜
      </button>
    </div>
  );
};

export default EwasteCertificate;
