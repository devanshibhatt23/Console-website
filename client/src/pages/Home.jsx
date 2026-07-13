import { useEffect, useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { searchProfiles, deriveCollegeIdFromEmail } from "../services/ProfileService";
import "./Home.css";

export default function Home() {
  const { profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        setLoadingSearch(false);
        return;
      }

      setLoadingSearch(true);
      try {
        const data = await searchProfiles(searchTerm.trim());
        setSearchResults(data || []);
      } catch (err) {
        console.error("Home search failed:", err);
        setSearchResults([]);
      } finally {
        setLoadingSearch(false);
      }
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  const quickLinks = useMemo(() => [
    { to: "/leaderboard", label: "Leaderboard", icon: "🏆" },
    { to: "/resources", label: "Resources", icon: "📚" },
    { to: "/problem-of-the-day", label: "POTD", icon: "🔥" },
    { to: "/tech-guide", label: "Tech Guide", icon: "🗺️" },
    { to: "/home#team", label: "Team", icon: "🤝" },
    { to: "/home#developers", label: "Developers", icon: "💡" },
  ], []);

  return (
    <div className="home-container">
      <div className="home-nav">
        <div className="home-nav-brand">
          <span className="home-nav-logo">CONSOLE</span>
          <span className="home-nav-pill">Community</span>
        </div>

        <div className="home-nav-links">
          {quickLinks.map((item) => (
            <NavLink key={item.to} to={item.to} className="home-nav-link">
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="home-search-shell">
          <span className="home-search-icon">🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search people"
            className="home-search-input"
          />
          {(searchTerm || loadingSearch) && (
            <div className="home-search-dropdown">
              {loadingSearch ? (
                <div className="home-search-empty">Searching people…</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((person) => (
                  <Link key={person.id} to={`/profile/${person.id}`} className="home-search-result">
                    <span className="home-search-meta">
                      <strong>{person.name || "Anonymous Member"}</strong>
                      <small>{person.college_id || deriveCollegeIdFromEmail(person.email || "") || "Member"}</small>
                    </span>
                  </Link>
                ))
              ) : (
                <div className="home-search-empty">No members found yet.</div>
              )}
            </div>
          )}
        </div>
      </div>

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

          <Link to="/resources" className="home-card">
            <div className="home-card-icon">📚</div>
            <h2 className="home-card-title">Resources</h2>
            <p className="home-card-desc">Curated guides and competitive programming materials.</p>
          </Link>

          <Link to="/tech-guide" className="home-card">
            <div className="home-card-icon">🗺️</div>
            <h2 className="home-card-title">Tech Guide</h2>
            <p className="home-card-desc">Step-by-step roadmaps for your software engineering journey.</p>
          </Link>

          <Link to="/events" className="home-card">
            <div className="home-card-icon">📅</div>
            <h2 className="home-card-title">Events</h2>
            <p className="home-card-desc">Explore previous Console Club events.</p>
          </Link>
        </div>

        <div id="team" className="home-section-card">
          <h2>Team</h2>
          <p>Collaborate, share progress, and keep the community moving together.</p>
        </div>

        <div id="developers" className="home-section-card alt">
          <h2>Developers</h2>
          <p>Discover peers, exchange ideas, and build your next milestone with the community.</p>
        </div>
      </div>
    </div>
  );
}
