import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { roadmapsData } from "../data/roadmapsData";
import "./Resources.css";

export default function ResourceDomain() {
  const { domain: domainId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const track = roadmapsData[domainId];

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!authLoading && !track) navigate("/resources");
  }, [track, authLoading, navigate]);

  const [completedModules, setCompletedModules] = useState({});

  useEffect(() => {
    if (track) {
      const saved = {};
      track.modules.forEach((mod) => {
        saved[mod.id] = localStorage.getItem(`rp-${track.id}-${mod.id}`) === "true";
      });
      setCompletedModules(saved);
    }
  }, [track]);

  if (!track) return null;

  const toggleModule = (modId) => {
    const next = !completedModules[modId];
    setCompletedModules((prev) => ({ ...prev, [modId]: next }));
    localStorage.setItem(`rp-${track.id}-${modId}`, String(next));
  };

  const totalModules = track.modules.length;
  const completedCount = Object.values(completedModules).filter(Boolean).length;
  const progressPercent = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  return (
    <div className="res-page" style={{ "--track-color": track.color }}>
      <div className="res-bg-glow" />

      <div className="res-layout">
        {/* Track Header */}
        <div className="rd-header">
          <div className="rd-header-top">
            <div className="rd-title-block">
              <h1 className="rd-title">{track.title}</h1>
              <p className="rd-intro">{track.intro}</p>

              {/* Progress — shown below the description, centered and full width */}
              <div className="rd-progress-block">
                <div className="rd-progress-nums">
                  <span className="rd-prog-done">{completedCount}</span>
                  <span className="rd-prog-sep">/</span>
                  <span className="rd-prog-total">{totalModules}</span>
                </div>
                <div className="rd-progress-bar">
                  <div className="rd-progress-fill" style={{ width: `${progressPercent}%` }} />
                </div>
                <p className="rd-progress-label">{progressPercent}% complete</p>
              </div>
            </div>
          </div>

          {/* Compact Info Strip — replaces 3 cards */}
          <div className="rd-info-strip">
            <div className="rd-info-row">
              <span className="rd-info-key">Tools</span>
              <span className="rd-info-val">{track.generalTools}</span>
            </div>
            <div className="rd-info-divider" />
            <div className="rd-info-row">
              <span className="rd-info-key">Reading</span>
              <span className="rd-info-val rd-reading-links">
                {track.preferReading.map((item, i) => (
                  <span key={i}>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="rd-reading-link">
                      {item.label}
                    </a>
                    {i < track.preferReading.length - 1 && <span className="rd-link-sep"> · </span>}
                  </span>
                ))}
              </span>
            </div>
          </div>
        </div>

        {/* Stepper Timeline */}
        <div className="rd-timeline">
          <div className="rd-spine" />

          {track.modules.map((mod) => {
            const done = !!completedModules[mod.id];
            return (
              <div key={mod.id} className={`rd-step ${done ? "done" : ""}`}>
                {/* Node */}
                <button
                  className={`rd-node ${done ? "done" : ""}`}
                  onClick={() => toggleModule(mod.id)}
                  title={done ? "Mark incomplete" : "Mark complete"}
                >
                  {done ? <span className="rd-node-check">✓</span> : <span className="rd-node-num">{mod.id}</span>}
                </button>

                {/* Card */}
                <div className="rd-card">
                  {/* Card Header */}
                  <div className="rd-card-head">
                    <h3 className="rd-mod-title">{mod.title}</h3>
                  </div>

                  {/* Card Body */}
                  <div className="rd-card-body">
                    {/* Learn */}
                    <div className="rd-section">
                      <p className="rd-section-label">Learn</p>
                      <ul className="rd-learn-list">
                        {mod.learn.map((pt, i) => (
                          <li key={i}>{pt}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Resources */}
                    <div className="rd-section">
                      <p className="rd-section-label">Resources</p>
                      <div className="rd-res-list">
                        {mod.videos.map((v, i) => (
                          <div key={i} className="rd-res-row">
                            <span className="rd-res-type rd-res-video">Video</span>
                            <a href={v.url} target="_blank" rel="noopener noreferrer" className="rd-res-link">
                              {v.text} <span className="rd-ext-icon">↗</span>
                            </a>
                          </div>
                        ))}
                        {mod.readings.map((r, i) => (
                          <div key={i} className="rd-res-row">
                            <span className="rd-res-type rd-res-read">Read</span>
                            <a href={r.url} target="_blank" rel="noopener noreferrer" className="rd-res-link">
                              {r.text} <span className="rd-ext-icon">↗</span>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Practice */}
                    <div className="rd-section">
                      <p className="rd-section-label">Practice</p>
                      <p className="rd-practice-text">{mod.practice}</p>
                    </div>

                    {/* Checkpoint */}
                    <div className="rd-checkpoint">
                      <span className="rd-checkpoint-label">Move on when:</span>
                      <span className="rd-checkpoint-text">{mod.checkpoint}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
