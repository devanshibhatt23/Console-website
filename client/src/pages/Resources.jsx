import { useState, useEffect } from "react";
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
    <div className="resources-page dark">
      {/* Background gradients for visual depth */}
      <div className="resources-bg-glow" />

      {/* Navigation / Back Button */}
      <div className="resources-nav-bar">
        <button
          onClick={() => navigate("/")}
          className="resources-back-home-btn"
        >
          <span className="btn-icon">←</span> Back to Dashboard
        </button>
      </div>

      {/* Header Section */}
      <div className="resources-header">
        <div className="resources-header-badge">
          <span>📚</span> Learning Directory
        </div>
        <h1>Master the Stack</h1>
        <p>
          Structured, module-by-module learning roadmaps compiled from the best free resources. 
          Pick a track and follow a step-by-step journey to building real understanding.
        </p>
      </div>

      {/* Track Gallery Grid */}
      <div className="domain-grid">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="domain-card"
            style={{ "--track-color": track.color }}
            onClick={() => navigate(`/resources/${track.id}`)}
          >
            {/* Custom glow effect color-matched to the track */}
            <div className="domain-card-glow-bg" />
            
            <div className="domain-card-inner">
              <div className="domain-card-header">
                {/* Track icon / motif */}
                <div className="domain-icon-wrapper">
                  <span className="domain-icon-glyph">{track.icon}</span>
                </div>
                {/* Scope Badge */}
                <div className="domain-scope-badge">
                  {track.scope}
                </div>
              </div>

              <div className="domain-card-content">
                <h3 className="domain-card-title">{track.title}</h3>
                <p className="domain-card-subtitle">{track.subtitle}</p>
                <p className="domain-card-desc">{track.description}</p>
              </div>

              <div className="domain-card-footer">
                <span className="start-learning-text">Start Roadmap</span>
                <span className="arrow-icon">→</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
