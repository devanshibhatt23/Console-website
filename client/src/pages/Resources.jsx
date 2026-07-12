import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DomainCard from "../components/resources/DomainCard";
import { DOMAINS, RESOURCES_BY_DOMAIN } from "../data/resourcesData";
import { getResources, getUserProgress } from "../services/resourceService";
import "./Resources.css";

export default function Resources() {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [completedIds, setCompletedIds] = useState(new Set());
  const [dbResources, setDbResources] = useState([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  async function loadData() {
    try {
      setLoading(true);
      const [resources, progress] = await Promise.all([
        getResources().catch(() => []),
        getUserProgress(user.id).catch(() => new Set()),
      ]);
      setDbResources(resources || []);
      setCompletedIds(progress);
    } catch (err) {
      console.error("Error loading resources:", err);
    } finally {
      setLoading(false);
    }
  }

  // Compute per-domain progress
  function getDomainProgress(domainId) {
    const dbDomainResources = dbResources.filter((r) => r.domain === domainId);

    return {
      total: dbDomainResources.length,
      completed: dbDomainResources.filter((r) => completedIds.has(r.id)).length,
    };
  }

  return (
    <div className="resources-page" style={{ position: "relative" }}>
      {/* Back to Dashboard Button */}
      <button
        onClick={() => navigate("/home")}
        style={{
          position: "absolute",
          top: "24px",
          left: "24px",
          padding: "8px 16px",
          borderRadius: "8px",
          border: "1px solid var(--res-card-border, rgba(255,255,255,0.08))",
          background: "var(--res-card-bg, rgba(22, 23, 29, 0.85))",
          color: "var(--res-text, #e8e9ed)",
          cursor: "pointer",
          zIndex: 10,
          fontWeight: "600",
          fontSize: "14px",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px"
        }}
      >
        ← Back to Dashboard
      </button>

      {/* Header */}
      <div className="resources-header">
        <div className="resources-header-badge">
          📚 Tech Guide
        </div>
        <h1>Learning Domains</h1>
        <p>
          Pick a domain and start your journey. Track your progress, unlock
          resources, and level up your skills.
        </p>
      </div>

      {/* Domain Grid */}
      {loading ? (
        <div className="resources-loading">
          <div className="resources-spinner" />
          <p>Loading your progress...</p>
        </div>
      ) : (
        <div className="domain-grid">
          {DOMAINS.map((domain) => {
            const { total, completed } = getDomainProgress(domain.id);
            return (
              <DomainCard
                key={domain.id}
                domain={domain}
                completed={completed}
                total={total}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
