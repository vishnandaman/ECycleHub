import React from "react";
import { FaArrowRight, FaRecycle, FaUsers, FaHandshake, FaStar, FaLinkedin, FaBuilding, FaTrophy, FaCalendarAlt, FaMapMarkerAlt, FaClipboardList, FaTrashAlt, FaLightbulb, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../styles/Home.css";

const About = () => {
	const [currentGlimpse, setCurrentGlimpse] = React.useState(0);
	const glimpses = [
		{ src: "/img1.png", alt: "Survey and Research" },
		{ src: "/img2.png", alt: "Waste Collection" },
		{ src: "/img3.png", alt: "Innovation and Development" }
	];

	const nextGlimpse = () => {
		setCurrentGlimpse((prev) => (prev + 1) % glimpses.length);
	};

	const prevGlimpse = () => {
		setCurrentGlimpse((prev) => (prev - 1 + glimpses.length) % glimpses.length);
	};

	return (
		<div style={{ paddingTop: 100 }}>
			<div className="container" style={{ padding: "40px 20px" }}>
				<h2 className="section-title">About Our Mission</h2>
				<p style={{ color: "var(--color-muted)", maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
					Urban waste crisis needs fast, reliable and transparent solutions. We connect local collectors and
					recyclers through a digital platform, ensuring fair pricing and efficient waste management.
				</p>
			</div>

			{/* Problem Statement */}
			<section className="problem-section">
				<div className="container">
					<div className="problem-content">
						<div className="problem-text">
							<h2>Problem Statement</h2>
							<ul style={{ color: "var(--color-muted)", lineHeight: 1.8 }}>
								<li>Urban waste crisis: Overwhelming waste, poor segregation, and growing landfills.</li>
								<li>Informal waste collectors: Underpaid and undervalued despite crucial role.</li>
								<li>Economic loss: Valuable recyclables wasted due to inefficient processing.</li>
								<li>Systemic imbalance: Large agents dominate; small vendors exploited.</li>
							</ul>
						</div>
						<div className="problem-image">
							<img src="/suvidha_logo-removebg-preview.png" alt="Logo" className="problem-logo" />
						</div>
					</div>
				</div>
			</section>

			{/* Solution */}
			<section className="features-section">
				<div className="container">
					<h2 className="section-title">Our Solution</h2>
					<div className="features-grid">
						<div className="feature-card">
							<div className="feature-icon"><FaUsers /></div>
							<h3>Digital Platform</h3>
							<p>Connect small-scale collectors directly to our platform for fair pricing and efficient management.</p>
						</div>
						<div className="feature-card">
							<div className="feature-icon"><FaRecycle /></div>
							<h3>Streamlined Collection</h3>
							<p>Convenient scheduling and tracking for waste pickups to ensure reliability and transparency.</p>
						</div>
						<div className="feature-card">
							<div className="feature-icon"><FaHandshake /></div>
							<h3>Collaborative Growth</h3>
							<p>Create a circular economy by incentivizing segregation and processing recyclables.</p>
						</div>
					</div>
				</div>
			</section>

			{/* Journey Glimpses Carousel */}
			<section style={{ 
				background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-2))", 
				padding: "4rem 0",
				position: "relative"
			}}>
				<div className="container">
					<div style={{ 
						position: "relative", 
						maxWidth: 800, 
						margin: "0 auto",
						height: "400px",
						borderRadius: "var(--radius-lg)",
						overflow: "hidden",
						boxShadow: "var(--shadow-lg)"
					}}>
						<img 
							src={glimpses[currentGlimpse].src} 
							alt={glimpses[currentGlimpse].alt} 
							style={{
								width: "100%",
								height: "100%",
								objectFit: "cover",
								transition: "opacity 0.5s ease"
							}}
						/>
						<button 
							onClick={prevGlimpse}
							style={{
								position: "absolute",
								left: "1rem",
								top: "50%",
								transform: "translateY(-50%)",
								background: "rgba(255,255,255,0.9)",
								border: "none",
								borderRadius: "50%",
								width: "50px",
								height: "50px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								cursor: "pointer",
								transition: "all 0.3s ease",
								zIndex: 10
							}}
							onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,1)"}
							onMouseLeave={(e) => e.target.style.background = "rgba(255,255,255,0.9)"}
						>
							<FaChevronLeft style={{ color: "var(--color-primary)" }} />
						</button>
						<button 
							onClick={nextGlimpse}
							style={{
								position: "absolute",
								right: "1rem",
								top: "50%",
								transform: "translateY(-50%)",
								background: "rgba(255,255,255,0.9)",
								border: "none",
								borderRadius: "50%",
								width: "50px",
								height: "50px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								cursor: "pointer",
								transition: "all 0.3s ease",
								zIndex: 10
							}}
							onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,1)"}
							onMouseLeave={(e) => e.target.style.background = "rgba(255,255,255,0.9)"}
						>
							<FaChevronRight style={{ color: "var(--color-primary)" }} />
						</button>
						<div style={{
							position: "absolute",
							bottom: "1rem",
							left: "50%",
							transform: "translateX(-50%)",
							display: "flex",
							gap: "0.5rem"
						}}>
							{glimpses.map((_, index) => (
								<button
									key={index}
									onClick={() => setCurrentGlimpse(index)}
									style={{
										width: "12px",
										height: "12px",
										borderRadius: "50%",
										border: "none",
										background: index === currentGlimpse ? "#fff" : "rgba(255,255,255,0.5)",
										cursor: "pointer",
										transition: "all 0.3s ease"
									}}
								/>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Founding Team */}
			<section className="student-built-section">
				<div className="container">
					<h2 className="section-title">Founding Team</h2>
					<div style={{ textAlign: "center", marginBottom: "3rem" }}>
						<p style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.1rem", maxWidth: 800, margin: "0 auto" }}>
							Built by passionate students who experienced waste management challenges firsthand. 
							From conducting surveys to collecting garbage and plastic, we've learned valuable lessons about sustainability.
						</p>
					</div>
					
					{/* Founding Team Image */}
					<div style={{ 
						background: "rgba(255,255,255,0.1)", 
						borderRadius: "var(--radius-lg)", 
						padding: "1.5rem", 
						border: "1px solid rgba(255,255,255,0.2)",
						maxWidth: 800,
						margin: "0 auto 3rem auto"
					}}>
						<img 
							src="/founding team.png" 
							alt="Founding Team - Complete Team" 
							style={{
								width: "100%",
								height: "auto",
								maxHeight: "300px",
								objectFit: "contain",
								borderRadius: "var(--radius-md)",
								boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
							}}
						/>
					</div>

					{/* Cofounders Cards */}
					<div style={{ 
						display: "grid", 
						gridTemplateColumns: "repeat(4, 1fr)", 
						gap: "1.5rem", 
						marginTop: "2rem" 
					}}>
						<div style={{ 
							background: "#fff", 
							padding: "2rem", 
							borderRadius: "var(--radius-md)", 
							textAlign: "center", 
							boxShadow: "var(--shadow-md)", 
							transition: "transform .3s ease", 
							borderTop: "4px solid var(--color-primary)",
							cursor: "pointer"
						}} 
						onClick={() => window.open("https://www.linkedin.com/in/vivek-vitekari/", "_blank")}
						onMouseEnter={(e) => e.target.style.transform = "translateY(-5px)"}
						onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
						>
							<div style={{ fontSize: "3rem", color: "var(--color-primary)", marginBottom: "1rem" }}>
								<FaUsers />
							</div>
							<h3 style={{ fontSize: "1.5rem", fontWeight: "600", color: "var(--color-text)", marginBottom: "1rem" }}>
								Vivek Vitekari
							</h3>
							<p style={{ color: "var(--color-muted)", lineHeight: "1.6", marginBottom: "1.5rem" }}>
								Developer & Cofounder
							</p>
							<a 
								href="https://www.linkedin.com/in/vivek-vitekari/" 
								target="_blank" 
								rel="noopener noreferrer"
								style={{
									display: "inline-flex",
									alignItems: "center",
									gap: "0.5rem",
									padding: "0.5rem 1rem",
									background: "var(--color-primary)",
									color: "#fff",
									borderRadius: "20px",
									textDecoration: "none",
									fontWeight: "600",
									transition: "all .3s ease"
								}}
								onMouseEnter={(e) => e.target.style.background = "var(--color-primary-2)"}
								onMouseLeave={(e) => e.target.style.background = "var(--color-primary)"}
							>
								<FaLinkedin />
								View Profile
							</a>
						</div>

						<div style={{ 
							background: "#fff", 
							padding: "2rem", 
							borderRadius: "var(--radius-md)", 
							textAlign: "center", 
							boxShadow: "var(--shadow-md)", 
							transition: "transform .3s ease", 
							borderTop: "4px solid var(--color-primary)",
							cursor: "pointer"
						}} 
						onClick={() => window.open("https://www.linkedin.com/in/prasad-koli-025123261/", "_blank")}
						onMouseEnter={(e) => e.target.style.transform = "translateY(-5px)"}
						onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
						>
							<div style={{ fontSize: "3rem", color: "var(--color-primary)", marginBottom: "1rem" }}>
								<FaUsers />
							</div>
							<h3 style={{ fontSize: "1.5rem", fontWeight: "600", color: "var(--color-text)", marginBottom: "1rem" }}>
								Prasad Koli
							</h3>
							<p style={{ color: "var(--color-muted)", lineHeight: "1.6", marginBottom: "1.5rem" }}>
								Founder
							</p>
							<a 
								href="https://www.linkedin.com/in/prasad-koli-025123261/" 
								target="_blank" 
								rel="noopener noreferrer"
								style={{
									display: "inline-flex",
									alignItems: "center",
									gap: "0.5rem",
									padding: "0.5rem 1rem",
									background: "var(--color-primary)",
									color: "#fff",
									borderRadius: "20px",
									textDecoration: "none",
									fontWeight: "600",
									transition: "all .3s ease"
								}}
								onMouseEnter={(e) => e.target.style.background = "var(--color-primary-2)"}
								onMouseLeave={(e) => e.target.style.background = "var(--color-primary)"}
							>
								<FaLinkedin />
								View Profile
							</a>
						</div>

						<div style={{ 
							background: "#fff", 
							padding: "2rem", 
							borderRadius: "var(--radius-md)", 
							textAlign: "center", 
							boxShadow: "var(--shadow-md)", 
							transition: "transform .3s ease", 
							borderTop: "4px solid var(--color-primary)",
							cursor: "pointer"
						}}
						onClick={() => window.open("https://www.linkedin.com/in/sakshi-pawar-19a84a345/", "_blank")}
						onMouseEnter={(e) => e.target.style.transform = "translateY(-5px)"}
						onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
						>
							<div style={{ fontSize: "3rem", color: "var(--color-primary)", marginBottom: "1rem" }}>
								<FaUsers />
							</div>
							<h3 style={{ fontSize: "1.5rem", fontWeight: "600", color: "var(--color-text)", marginBottom: "1rem" }}>
								Sakshi Pawar
							</h3>
							<p style={{ color: "var(--color-muted)", lineHeight: "1.6", marginBottom: "1.5rem" }}>
								Cofounder Operations & Logistics
							</p>
							<a 
								href="https://www.linkedin.com/in/sakshi-pawar-19a84a345/" 
								target="_blank" 
								rel="noopener noreferrer"
								style={{
									display: "inline-flex",
									alignItems: "center",
									gap: "0.5rem",
									padding: "0.5rem 1rem",
									background: "var(--color-primary)",
									color: "#fff",
									borderRadius: "20px",
									textDecoration: "none",
									fontWeight: "600",
									transition: "all .3s ease"
								}}
								onMouseEnter={(e) => e.target.style.background = "var(--color-primary-2)"}
								onMouseLeave={(e) => e.target.style.background = "var(--color-primary)"}
							>
								<FaLinkedin />
								View Profile
							</a>
						</div>

						<div style={{ 
							background: "#fff", 
							padding: "2rem", 
							borderRadius: "var(--radius-md)", 
							textAlign: "center", 
							boxShadow: "var(--shadow-md)", 
							transition: "transform .3s ease", 
							borderTop: "4px solid var(--color-primary)",
							cursor: "pointer"
						}}
						onClick={() => window.open("https://www.linkedin.com/in/aman-vishwakarma-x018730/", "_blank")}
						onMouseEnter={(e) => e.target.style.transform = "translateY(-5px)"}
						onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
						>
							<div style={{ fontSize: "3rem", color: "var(--color-primary)", marginBottom: "1rem" }}>
								<FaUsers />
							</div>
							<h3 style={{ fontSize: "1.5rem", fontWeight: "600", color: "var(--color-text)", marginBottom: "1rem" }}>
								Aman Vishwakarma
							</h3>
							<p style={{ color: "var(--color-muted)", lineHeight: "1.6", marginBottom: "1.5rem" }}>
								Developer & Cofounder
							</p>
							<a 
								href="https://www.linkedin.com/in/aman-vishwakarma-x018730/" 
								target="_blank" 
								rel="noopener noreferrer"
								style={{
									display: "inline-flex",
									alignItems: "center",
									gap: "0.5rem",
									padding: "0.5rem 1rem",
									background: "var(--color-primary)",
									color: "#fff",
									borderRadius: "20px",
									textDecoration: "none",
									fontWeight: "600",
									transition: "all .3s ease"
								}}
								onMouseEnter={(e) => e.target.style.background = "var(--color-primary-2)"}
								onMouseLeave={(e) => e.target.style.background = "var(--color-primary)"}
							>
								<FaLinkedin />
								View Profile
							</a>
						</div>
					</div>

					{/* Journey Details */}
					<div style={{ 
						background: "rgba(255,255,255,0.1)", 
						borderRadius: "var(--radius-lg)", 
						padding: "2rem", 
						border: "1px solid rgba(255,255,255,0.2)",
						maxWidth: 900,
						margin: "3rem auto 0 auto"
					}}>
						<h3 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "1.5rem", textAlign: "center" }}>
							Our Journey - From Idea to Impact
						</h3>
						<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
							<div style={{ 
								display: "flex", 
								alignItems: "center", 
								gap: "1rem",
								padding: "1rem",
								background: "rgba(255,255,255,0.1)",
								borderRadius: "var(--radius-sm)",
								border: "1px solid rgba(255,255,255,0.2)"
							}}>
								<FaCalendarAlt style={{ color: "var(--color-accent)", fontSize: "1.5rem" }} />
								<div>
									<div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>Started</div>
									<div style={{ fontSize: "0.9rem", opacity: "0.9" }}>December 9, 2023</div>
								</div>
							</div>
							<div style={{ 
								display: "flex", 
								alignItems: "center", 
								gap: "1rem",
								padding: "1rem",
								background: "rgba(255,255,255,0.1)",
								borderRadius: "var(--radius-sm)",
								border: "1px solid rgba(255,255,255,0.2)"
							}}>
								<FaTrophy style={{ color: "var(--color-accent)", fontSize: "1.5rem" }} />
								<div>
									<div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>Won</div>
									<div style={{ fontSize: "0.9rem", opacity: "0.9" }}>9+ Ideathons</div>
								</div>
							</div>
							<div style={{ 
								display: "flex", 
								alignItems: "center", 
								gap: "1rem",
								padding: "1rem",
								background: "rgba(255,255,255,0.1)",
								borderRadius: "var(--radius-sm)",
								border: "1px solid rgba(255,255,255,0.2)"
							}}>
								<FaMapMarkerAlt style={{ color: "var(--color-accent)", fontSize: "1.5rem" }} />
								<div>
									<div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>Participated</div>
									<div style={{ fontSize: "0.9rem", opacity: "0.9" }}>20+ Ideathons across India</div>
								</div>
							</div>

						</div>
						<p style={{ 
							textAlign: "center", 
							marginTop: "1.5rem", 
							fontSize: "1rem", 
							opacity: "0.9",
							fontStyle: "italic"
						}}>
							"Sometimes we failed, but learned valuable lessons. Even though we shut down, the idea was so good that it continues to inspire."
						</p>
					</div>

					{/* Company LinkedIn */}
					<div style={{ 
						textAlign: "center", 
						marginTop: "4rem", 
						padding: "2rem", 
						background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-2))", 
						borderRadius: "var(--radius-lg)", 
						color: "#fff" 
					}}>
						<h3 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "1rem" }}>
							Connect With Our Company
						</h3>
						<p style={{ fontSize: "1.1rem", marginBottom: "2rem", opacity: "0.9" }}>
							Follow our journey in waste management and sustainability
						</p>
						<a 
							href="https://www.linkedin.com/company/aapli-suvidha" 
							target="_blank" 
							rel="noopener noreferrer"
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: "0.5rem",
								padding: "1rem 2rem",
								background: "rgba(255,255,255,0.1)",
								color: "#fff",
								borderRadius: "25px",
								textDecoration: "none",
								fontWeight: "600",
								border: "1px solid rgba(255,255,255,0.2)",
								transition: "all .3s ease"
							}}
							onMouseEnter={(e) => {
								e.target.style.background = "rgba(255,255,255,0.2)";
								e.target.style.transform = "translateY(-2px)";
							}}
							onMouseLeave={(e) => {
								e.target.style.background = "rgba(255,255,255,0.1)";
								e.target.style.transform = "translateY(0)";
							}}
						>
							<FaBuilding />
							Follow Aapli Suvidha on LinkedIn
						</a>
					</div>
				</div>
			</section>
		</div>
	);
};

export default About;
