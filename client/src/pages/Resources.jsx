import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { roadmapsData } from "../data/roadmapsData";
import "./Resources.css";

export default function Resources() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const tracks = Object.values(roadmapsData);

  return (
    <div className="res-page">
      <div className="res-bg-glow" />

      <div className="res-layout">
        {/* Navigation */}
        <div className="res-topbar">
          <button onClick={() => navigate("/")} className="res-back-btn">
            <span>←</span> Dashboard
          </button>
        </div>

        {/* Header */}
        <div className="res-header">
          <p className="res-header-label">Learning Roadmaps</p>
          <h1 className="res-header-title">Pick a Track</h1>
          <p className="res-header-sub">
            Structured, module-by-module roadmaps built from the best free resources. 
            Each track follows a fixed progression — no fluff, no detours.
          </p>
        </div>

        {/* Vertical Track List */}
        <div className="res-track-list">
          {tracks.map((track, idx) => (
            <button
              key={track.id}
              className="res-track-row"
              style={{ "--track-color": track.color }}
              onClick={() => navigate(`/resources/${track.id}`)}
            >
              <span className="res-track-num">
                {String(idx + 1).padStart(2, "0")}
              </span>

              <div className="res-track-info">
                <span className="res-track-name">{track.title}</span>
                <span className="res-track-sub">{track.subtitle}</span>
              </div>

              <div className="res-track-right">
                <span className="res-track-scope">{track.scope}</span>
                <span className="res-track-arrow">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
