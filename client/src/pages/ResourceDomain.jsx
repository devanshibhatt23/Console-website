import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { roadmapsData } from "../data/roadmapsData";
import "./Resources.css";

export default function ResourceDomain() {
  const { domain: domainId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // Find track data
  const track = roadmapsData[domainId];

  // Redirect to directory if track not found or user not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!track) {
      navigate("/resources");
    }
  }, [track, navigate]);

  // Load progress from localStorage
  const [completedModules, setCompletedModules] = useState({});

  useEffect(() => {
    if (track) {
      const saved = {};
      track.modules.forEach((mod) => {
        const key = `roadmap-progress-${track.id}-${mod.id}`;
        saved[mod.id] = localStorage.getItem(key) === "true";
      });
      setCompletedModules(saved);
    }
  }, [track]);

  if (!track) return null;

  // Toggle completion of a module
  const toggleModule = (modId) => {
    const nextState = !completedModules[modId];
    setCompletedModules((prev) => ({
      ...prev,
      [modId]: nextState,
    }));
    localStorage.setItem(`roadmap-progress-${track.id}-${modId}`, String(nextState));
  };

  // Calculate progress stats
  const totalModules = track.modules.length;
  const completedCount = Object.values(completedModules).filter(Boolean).length;
  const progressPercent = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  return (
    <div className="resources-page dark" style={{ "--track-color": track.color }}>
      <div className="resources-bg-glow" />

      {/* Navigation / Breadcrumb */}
      <div className="resources-nav-bar">
        <button
          onClick={() => navigate("/resources")}
          className="resources-back-home-btn"
        >
          <span className="btn-icon">←</span> Back to Roadmaps
        </button>
      </div>

      {/* Track Detail Header */}
      <div className="track-detail-header">
        <div className="track-header-left">
          <div className="track-header-icon-wrap">
            <span className="track-header-icon">{track.icon}</span>
          </div>
          <div>
            <h1 className="track-title-main">{track.title}</h1>
            <p className="track-subtitle-main">{track.subtitle}</p>
          </div>
        </div>
        <p className="track-description-text">{track.intro}</p>
      </div>

      {/* Progress & Tools Dashboard */}
      <div className="track-dashboard-grid">
        {/* Progress Tracker Card */}
        <div className="track-dashboard-card progress-card">
          <h3 className="card-label">Track Progress</h3>
          <div className="progress-value-container">
            <span className="progress-number">{completedCount}</span>
            <span className="progress-total">/ {totalModules} Modules</span>
          </div>
          
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="progress-percent-label">{progressPercent}% Completed</div>
        </div>

        {/* Tools Card */}
        <div className="track-dashboard-card tools-card">
          <h3 className="card-label">Required Tools</h3>
          <p className="tools-text">{track.generalTools}</p>
        </div>

        {/* Prefer Reading Alternative Card */}
        <div className="track-dashboard-card reading-card">
          <h3 className="card-label">📖 Prefer Reading?</h3>
          <ul className="reading-list-links">
            {track.preferReading.map((item, idx) => (
              <li key={idx}>
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="reading-link-item"
                >
                  <span className="link-title">{item.label}</span>
                  {item.desc && <span className="link-desc"> — {item.desc}</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* General Tips Section if present */}
      {track.generalTips && track.generalTips.length > 0 && (
        <div className="general-tips-container">
          <h3 className="tips-title">💡 Pro Tips for this Track</h3>
          <ul className="tips-list">
            {track.generalTips.map((tip, idx) => (
              <li key={idx} className="tip-item">{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Stepper Timeline Header */}
      <div className="timeline-section-title">
        <h2>Learning Journey</h2>
        <p>Complete each module and tick off your progress as you learn.</p>
      </div>

      {/* Stepper / Timeline Layout */}
      <div className="roadmap-stepper-timeline">
        <div className="timeline-connector-line" />

        {track.modules.map((mod, idx) => {
          const isCompleted = !!completedModules[mod.id];
          return (
            <div 
              key={mod.id} 
              className={`timeline-step-block ${isCompleted ? "completed" : ""}`}
            >
              {/* Stepper Node Indicator */}
              <div 
                className={`timeline-node ${isCompleted ? "completed" : ""}`}
                onClick={() => toggleModule(mod.id)}
                title={isCompleted ? "Mark incomplete" : "Mark complete"}
              >
                <span className="node-num">{mod.id}</span>
                {isCompleted && <span className="node-checkmark">✓</span>}
              </div>

              {/* Module Content Card */}
              <div className="timeline-card">
                <div className="module-card-header">
                  <div className="module-info-title-wrap">
                    <span className="module-scope-label">Module {mod.id}</span>
                    <h3 className="module-title">{mod.title}</h3>
                  </div>
                  {/* Action checkbox */}
                  <button 
                    onClick={() => toggleModule(mod.id)}
                    className={`module-complete-toggle-btn ${isCompleted ? "active" : ""}`}
                  >
                    {isCompleted ? "✓ Completed" : "Mark Complete"}
                  </button>
                </div>

                <div className="module-card-body">
                  {/* Learn Section */}
                  <div className="module-section learn-section">
                    <h4>📚 What You'll Learn</h4>
                    <ul className="learn-checklist">
                      {mod.learn.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Study Material Section */}
                  <div className="module-section resources-section">
                    <h4>🔗 Learning Resources</h4>
                    <div className="resources-links-container">
                      {/* Videos */}
                      {mod.videos.map((vid, i) => (
                        <div key={i} className="resource-link-row video-type">
                          <span className="link-type-icon">📺</span>
                          <div className="link-info">
                            {vid.url ? (
                              <a 
                                href={vid.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="resource-url"
                              >
                                {vid.track ? <span className="track-badge">{vid.track}</span> : null}
                                <span className="url-text">{vid.text}</span>
                                <span className="external-arrow">↗</span>
                              </a>
                            ) : (
                              <span className="non-link-text">{vid.text}</span>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Readings */}
                      {mod.readings.map((rd, i) => (
                        <div key={i} className="resource-link-row reading-type">
                          <span className="link-type-icon">📖</span>
                          <div className="link-info">
                            <a 
                              href={rd.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="resource-url"
                            >
                              <span className="url-text">{rd.text}</span>
                              <span className="external-arrow">↗</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Practice Section */}
                  <div className="module-section practice-section">
                    <h4>💻 Hands-on Practice</h4>
                    <p className="practice-text">{mod.practice}</p>
                  </div>

                  {/* Checkpoint Section */}
                  <div className="module-section checkpoint-section">
                    <h4>🎯 Move On Checkpoint</h4>
                    <div className="checkpoint-card">
                      <span className="checkpoint-icon">🏁</span>
                      <p className="checkpoint-text">
                        <strong>Move on when:</strong> {mod.checkpoint}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
