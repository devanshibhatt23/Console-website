import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TrackMode from "../components/resources/TrackMode";
import LibraryMode from "../components/resources/LibraryMode";
import { DOMAINS, RESOURCES_BY_DOMAIN } from "../data/resourcesData";
import { getResources, getUserProgress, toggleProgress } from "../services/resourceService";
import "./Resources.css";

export default function ResourceDomain() {
  const { domain: domainId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // Mode: 'track' or 'library'
  const [mode, setMode] = useState(() => {
    return localStorage.getItem(`res-mode-${domainId}`) || "track";
  });

  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState([]);
  const [completedIds, setCompletedIds] = useState(new Set());

  // Find domain metadata
  const domain = DOMAINS.find((d) => d.id === domainId);

  useEffect(() => {
    if (!authLoading && !user) navigate("/");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!domain) {
      navigate("/resources");
      return;
    }
    if (user) loadData();
  }, [user, domainId]);

  useEffect(() => {
    localStorage.setItem(`res-mode-${domainId}`, mode);
  }, [mode, domainId]);

  // Removed localStorage progress tracking since we now use DB strictly

  async function loadData() {
    try {
      setLoading(true);
      const [dbResources, progress] = await Promise.all([
        getResources(domainId).catch(() => []),
        getUserProgress(user.id).catch(() => new Set()),
      ]);

      setResources(dbResources || []);
      setCompletedIds(progress || new Set());
    } catch (err) {
      console.error("Error loading domain resources:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggle(resource, isCompleted) {
    // Optimistic update in React state
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (isCompleted) next.delete(resource.id);
      else next.add(resource.id);
      return next;
    });


    // Real DB resource: save to Supabase
    try {
      await toggleProgress(user.id, resource.id, isCompleted);
    } catch (err) {
      console.error("Error saving progress:", err);
      // Rollback on error
      setCompletedIds((prev) => {
        const next = new Set(prev);
        if (isCompleted) next.add(resource.id);
        else next.delete(resource.id);
        return next;
      });
    }
  }

  if (!domain) return null;

  const completedCount = resources.filter((r) => completedIds.has(r.id)).length;
  const totalCount = resources.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="resource-domain-page">
      {/* Header */}
      <div className="domain-page-header">
        <button
          className="domain-back-btn"
          onClick={() => navigate("/resources")}
          aria-label="Back to all domains"
        >
          ← Back
        </button>
        <div className="domain-page-title-area">
          <span className="domain-page-icon">{domain.icon}</span>
          <div>
            <h1 className="domain-page-name">{domain.name}</h1>
            <p className="domain-page-sub">{domain.description}</p>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="domain-overall-progress">
        <div className="domain-progress-info">
          <p className="domain-progress-label">Overall Progress</p>
          <div className="domain-progress-bar-track">
            <div
              className="domain-progress-bar-fill"
              style={{ width: `${pct}%`, background: domain.gradient }}
            />
          </div>
        </div>
        <div className="domain-progress-stats">
          <div className="domain-progress-count" style={{ color: domain.color }}>
            {completedCount}
          </div>
          <div className="domain-progress-total">of {totalCount} completed</div>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="mode-toggle" role="tablist" aria-label="View mode">
        <button
          id="mode-track"
          className={`mode-toggle-btn ${mode === "track" ? "active" : ""}`}
          onClick={() => setMode("track")}
          role="tab"
          aria-selected={mode === "track"}
        >
          <span className="mode-icon">🗺️</span>
          Track Mode
        </button>
        <button
          id="mode-library"
          className={`mode-toggle-btn ${mode === "library" ? "active" : ""}`}
          onClick={() => setMode("library")}
          role="tab"
          aria-selected={mode === "library"}
        >
          <span className="mode-icon">📖</span>
          Library Mode
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="resources-loading">
          <div className="resources-spinner" />
          <p>Loading resources...</p>
        </div>
      ) : mode === "track" ? (
        <TrackMode
          resources={resources}
          completedIds={completedIds}
          onToggle={handleToggle}
          domainColor={domain.color}
          domainIcon={domain.icon}
        />
      ) : (
        <LibraryMode
          resources={resources}
          completedIds={completedIds}
          onToggle={handleToggle}
          domainColor={domain.color}
          domainId={domainId}
        />
      )}
    </div>
  );
}
