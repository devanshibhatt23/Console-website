import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { searchProfiles, deriveCollegeIdFromEmail } from "../services/ProfileService";
import "./SearchUsers.css";

export default function SearchUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounceFn = window.setTimeout(async () => {
      setError("");
      setLoading(true);
      try {
        const data = await searchProfiles(searchTerm.trim());
        setResults(data || []);
      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to fetch search results.");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => window.clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="search-page-container">
      <div className="search-content">
        <header className="search-header">
          <button onClick={() => navigate("/home")} className="back-btn">
            &larr; Back to Home
          </button>
          <h1 className="search-title">Search Members</h1>
          <p className="search-subtitle">Find and connect with other developers in the CONSOLE community.</p>
        </header>

        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by Name or College ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-btn" onClick={() => setSearchTerm("")}>
              &times;
            </button>
          )}
        </div>

        {error && <div className="search-error">{error}</div>}

        {loading ? (
          <div className="search-loading">Searching profiles...</div>
        ) : (
          <div className="search-results-list">
            {results.length > 0 ? (
              results.map((profile) => (
                <Link key={profile.id} to={`/profile/${profile.id}`} className="profile-search-card">
                  <div className="profile-card-left">
                    <div className="profile-avatar">
                      {profile.name ? profile.name.charAt(0).toUpperCase() : "?"}
                    </div>
                    <div className="profile-info">
                      <h3 className="profile-name">{profile.name || "Anonymous Member"}</h3>
                      <p className="profile-subinfo">
                        {(profile.college_id || deriveCollegeIdFromEmail(profile.email || "")) && (
                          <span className="profile-id">
                            {profile.college_id || deriveCollegeIdFromEmail(profile.email || "")}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="profile-card-right">
                    <span className="view-profile-btn">Open Profile</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="no-results">
                {searchTerm ? "No members found matching your search." : "Type above to search for members."}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
