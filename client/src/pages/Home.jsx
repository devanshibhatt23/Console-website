import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

export default function Home() {
  const { profile } = useAuth();

  return (
    <div className="home-container">
      <div className="home-content">
        <header className="home-header">
          <h1 className="home-title">Welcome to CONSOLE</h1>
          <p className="home-subtitle">
            Hello, {profile?.name || "Developer"}! Ready to code?
          </p>
        </header>

        <div className="home-grid">
          <Link to="/profile" className="home-card">
            <div className="home-card-icon">👤</div>
            <h2 className="home-card-title">My Profile</h2>
            <p className="home-card-desc">Manage your handles, resume, and details.</p>
          </Link>

          <Link to="/leaderboard" className="home-card">
            <div className="home-card-icon">🏆</div>
            <h2 className="home-card-title">Leaderboard</h2>
            <p className="home-card-desc">See where you stand among your peers.</p>
          </Link>

          <Link to="/problem-of-the-day" className="home-card">
            <div className="home-card-icon">🔥</div>
            <h2 className="home-card-title">POTD & Discussions</h2>
            <p className="home-card-desc">Solve the Problem of the Day and discuss.</p>
          </Link>

          <Link to="/" className="home-card">
            <div className="home-card-icon">📚</div>
            <h2 className="home-card-title">Resources</h2>
            <p className="home-card-desc">Curated guides and competitive programming materials.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
