import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Landing.css";

const GALLERY_ROW1 = [
  "/images/IMG_0051.jpg",
  "/images/IMG_0207.jpg",
  "/images/IMG_1594.JPG",
  "/images/IMG_2003.jpg",
  "/images/IMG_20260117_134333116_HDR.jpg",
  "/images/IMG_2055.jpg",
  "/images/IMG_4105.jpg",
  "/images/IMG_4412.jpg",
  "/images/WhatsApp Image 2026-04-14 at 13.34.04.jpeg"
];

const GALLERY_ROW2 = [
  "/images/IMG_0079.jpg",
  "/images/IMG_1590.jpg",
  "/images/IMG_1599.jpg",
  "/images/IMG_2011.jpg",
  "/images/IMG_20260117_151044965_HDR.jpg",
  "/images/IMG_2065.jpg",
  "/images/IMG_4394.jpg",
  "/images/WhatsApp Image 2026-04-14 at 13.36.52.jpeg",
  "/images/WhatsApp Image 2026-04-14 at 15.39.56.jpeg"
];

const TEAM_MEMBERS = [
  "Bhavya", "Parth Gandhi", "Rishi Kataria", "Raghunandan Jhawar",
  "Shivam Pareek", "Sujal Maurya", "Shivam Jat", "Yuvraj", "Neel Shah",
  "Shubham Singh", "Amit Kumar", "Mahek Patel", "Rashi Jangid",
  "Mridul Trivedi", "Prashant Chaudhary", "Krrish Sharma", "Ritesh Singh",
  "Abhinav Singh", "Siddhi Agarwal", "Aagam Jain", "Aditya Dhiman",
  "Akshat Agrawal", "Chiranjeev Goyal", "Devanshi Bhatt", "Dishank Viradiya",
  "Het Shah", "Meet Van", "Pallvi", "Param Chauhan", "Prarthana",
  "Ridhima Garg", "Saarvik Singh", "Sahil Kumar", "Siddharth Kumar", "Shlok Patel"
];

function getInitials(name) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase();
}

// Standalone Scramble text component for hero CONSOLE
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const CONSOLE_ORIGINAL = "CONSOLE";

function ScrambleText({ text = CONSOLE_ORIGINAL }) {
  const [displayed, setDisplayed] = useState(text);
  const intervalRef = useRef(null);
  const iterRef = useRef(0);

  const startScramble = () => {
    iterRef.current = 0;
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const iter = iterRef.current;
      setDisplayed(
        text.split("").map((_, i) => {
          if (i < iter) return text[i];
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }).join("")
      );
      iterRef.current += 0.35;
      if (iterRef.current >= text.length) {
        clearInterval(intervalRef.current);
        setDisplayed(text);
      }
    }, 35);
  };

  const stopScramble = () => {
    clearInterval(intervalRef.current);
    iterRef.current = 0;
    setDisplayed(text);
  };

  // Auto-trigger once on mount for a nice intro
  useEffect(() => {
    const timer = setTimeout(() => startScramble(), 600);
    return () => {
      clearTimeout(timer);
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <span
      className="gradient-text scramble-target"
      onMouseEnter={startScramble}
      onMouseLeave={stopScramble}
      style={{ cursor: "default" }}
    >
      {displayed}
    </span>
  );
}

export default function Landing() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("home");
  const spotlightRef = useRef(null);

  // Mouse-tracking radial spotlight effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (spotlightRef.current) {
        spotlightRef.current.style.setProperty("--x", `${e.clientX}px`);
        spotlightRef.current.style.setProperty("--y", `${e.clientY}px`);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // IntersectionObserver to highlight active nav link
  useEffect(() => {
    const sections = ["home", "about", "gallery", "team"];
    const observers = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) setActiveSection(id);
            });
          },
          { threshold: 0.4 }
        );
        observer.observe(el);
        observers.push({ observer, el });
      }
    });

    return () => observers.forEach(({ observer, el }) => observer.unobserve(el));
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const teamHalf = Math.ceil(TEAM_MEMBERS.length / 2);
  const teamRow1 = TEAM_MEMBERS.slice(0, teamHalf);
  const teamRow2 = TEAM_MEMBERS.slice(teamHalf);

  return (
    <div className="landing-layout">
      {/* Spotlight */}
      <div ref={spotlightRef} className="spotlight-layer"></div>

      {/* Navbar */}
      <header className="landing-navbar">
        <div className="nav-container">
          <a
            href="#"
            className="nav-logo"
            onClick={(e) => handleNavClick(e, "home")}
          >
            <span className="gradient-text">CONSOLE</span>
          </a>
          <nav className="nav-links">
            <a href="#home" className={activeSection === "home" ? "active" : ""} onClick={(e) => handleNavClick(e, "home")}>home</a>
            <a href="#about" className={activeSection === "about" ? "active" : ""} onClick={(e) => handleNavClick(e, "about")}>about</a>
            <a href="#gallery" className={activeSection === "gallery" ? "active" : ""} onClick={(e) => handleNavClick(e, "gallery")}>gallery</a>
            <a href="#team" className={activeSection === "team" ? "active" : ""} onClick={(e) => handleNavClick(e, "team")}>team</a>
            {user ? (
              <Link to="/home" className="nav-auth-btn">Dashboard</Link>
            ) : (
              <Link to="/login" className="nav-auth-btn">login</Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="landing-section hero-section">
        {/* Background image with scrim */}
        <div className="hero-bg">
          <img src="/images/IMG_1590.jpg" alt="" className="hero-bg-img" />
          <div className="hero-scrim"></div>
        </div>

        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <ScrambleText text="CONSOLE" />
          </h1>
          <p className="hero-subtitle">Tech Community of MNIT</p>
          <div className="hero-actions">
            {user ? (
              <Link to="/home" className="hero-btn primary-btn">Enter Dashboard</Link>
            ) : (
              <Link to="/login" className="hero-btn primary-btn">Join Community</Link>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="landing-section about-section">
        <div className="section-container">
          <div className="about-card">
            <h2 className="section-title">
              <span className="gradient-text">CONSOLE</span>
            </h2>
            <p className="about-lead">A tech community to learn and grow, together.</p>
            <p className="about-description">
              A place where people brainstorm, build and push each other forward.
            </p>
            <p className="about-description">
              We aim at developing skills that actually shape careers - not just DSA, but teamwork, problem-solving, networking, and the ability to take an idea from concept to execution.
            </p>
            <p className="about-description">
              We keep the community up with what's next in tech, and offer mentorship, provide resources and a platform to grow alongside your peers.
            </p>
            <div className="about-encouragement">
              You think you need any experience to join? You don't! Just show up curious - We will take it from there!
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="landing-section gallery-section">
        <div className="gallery-header">
          <h2 className="section-title">Life at <span className="gradient-text">CONSOLE</span></h2>
          <p className="section-subtitle">Moments from our tech sessions, hackathons, and meetups</p>
        </div>
        <div className="infinite-scroller-container">
          <div className="scroll-row left-to-right">
            <div className="scroll-track">
              {GALLERY_ROW1.concat(GALLERY_ROW1).map((src, i) => (
                <div className="gallery-item-wrapper" key={`g1-${i}`}>
                  <img src={src} alt="Console Moment" className="gallery-img" />
                </div>
              ))}
            </div>
          </div>
          <div className="scroll-row right-to-left">
            <div className="scroll-track">
              {GALLERY_ROW2.concat(GALLERY_ROW2).map((src, i) => (
                <div className="gallery-item-wrapper" key={`g2-${i}`}>
                  <img src={src} alt="Console Moment" className="gallery-img" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="landing-section team-section">
        <div className="team-header">
          <h2 className="section-title">Meet Our Team</h2>
          <p className="section-subtitle">The minds driving the community forward</p>
        </div>
        <div className="infinite-scroller-container">
          <div className="scroll-row left-to-right">
            <div className="scroll-track">
              {teamRow1.concat(teamRow1).map((name, i) => (
                <div className="team-member-card glassmorphic" key={`t1-${i}`}>
                  <div className="avatar-placeholder">{getInitials(name)}</div>
                  <h4 className="member-name">{name}</h4>
                  <span className="member-role">Core Member</span>
                </div>
              ))}
            </div>
          </div>
          <div className="scroll-row right-to-left">
            <div className="scroll-track">
              {teamRow2.concat(teamRow2).map((name, i) => (
                <div className="team-member-card glassmorphic" key={`t2-${i}`}>
                  <div className="avatar-placeholder">{getInitials(name)}</div>
                  <h4 className="member-name">{name}</h4>
                  <span className="member-role">Core Member</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-left">
            <h3>connect</h3>
            <div className="footer-social-links">
              <a href="https://www.instagram.com/console.comm" target="_blank" rel="noopener noreferrer" className="social-link">
                Instagram
              </a>
              <a href="https://www.linkedin.com/company/consolecommunity/" target="_blank" rel="noopener noreferrer" className="social-link">
                LinkedIn
              </a>
            </div>
          </div>
          <div className="footer-right">
            <nav className="footer-nav">
              <a href="#home" onClick={(e) => handleNavClick(e, "home")}>home</a>
              <a href="#about" onClick={(e) => handleNavClick(e, "about")}>about</a>
              <a href="#gallery" onClick={(e) => handleNavClick(e, "gallery")}>gallery</a>
              <a href="#team" onClick={(e) => handleNavClick(e, "team")}>team</a>
              {user ? (
                <Link to="/home">dashboard</Link>
              ) : (
                <Link to="/login">login</Link>
              )}
            </nav>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} CONSOLE MNIT. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
