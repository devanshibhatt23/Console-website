import { useState, useRef, useEffect } from "react";

const TYPE_ICONS = {
  video: "▶",
  article: "📄",
  exercise: "💪",
  docs: "📚",
  tool: "🔧",
};

/**
 * TrackMode – Candy Crush / Duolingo-style winding node path
 *
 * Rules:
 * - Resources unlock sequentially (can only access next resource after completing previous)
 * - Completed = green ✓ node
 * - Available = pulsing colored node (first incomplete)
 * - Locked = grey padlock
 *
 * @param {Object[]} resources  – sorted array of resource objects
 * @param {Set<string>} completedIds – set of completed resource IDs
 * @param {Function} onToggle   – (resource, isCompleted) => void
 * @param {string} domainColor  – hex color for accent
 * @param {string} domainIcon   – emoji icon
 */
export default function TrackMode({ resources, completedIds, onToggle, domainColor, domainIcon }) {
  const [activeCard, setActiveCard] = useState(null);
  const containerRef = useRef(null);

  // Sort resources by week then order
  const sorted = [...(resources || [])].sort((a, b) => {
    if (a.week_number !== b.week_number) return a.week_number - b.week_number;
    return (a.order_in_week || 0) - (b.order_in_week || 0);
  });

  // Determine node states
  const getNodeState = (res, index) => {
    if (completedIds.has(res.id)) return "completed";
    // First incomplete is available; the rest are locked
    const firstIncompleteIdx = sorted.findIndex((r) => !completedIds.has(r.id));
    if (index === firstIncompleteIdx) return "available";
    return "locked";
  };

  // Close card on outside click
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActiveCard(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!resources || resources.length === 0) {
    return (
      <div className="resources-loading" style={{ padding: "60px 0" }}>
        <p>No resources yet for this domain. Check back soon!</p>
      </div>
    );
  }

  // Group by week for labels
  const weekGroups = groupByWeek(sorted);
  const weekNumbers = Object.keys(weekGroups).map(Number).sort((a, b) => a - b);

  // Build a flat ordered list with week-break markers
  const items = [];
  for (const wk of weekNumbers) {
    items.push({ type: "label", week: wk });
    for (const res of weekGroups[wk]) {
      items.push({ type: "node", resource: res });
    }
  }

  // Alternate left-right to create winding path
  const nodeItems = items.filter((i) => i.type === "node");

  return (
    <div className="track-mode" ref={containerRef}>
      {weekNumbers.map((wk, wkIdx) => {
        const weekResources = weekGroups[wk];
        return (
          <div key={wk}>
            {/* Week label */}
            <div className="track-week-label">── Module {wk} ──</div>

            {/* Nodes for this week */}
            {weekResources.map((res, idx) => {
              const globalIdx = nodeItems.findIndex((n) => n.resource?.id === res.id);
              const state = getNodeState(res, globalIdx);
              const isActive = activeCard === res.id;
              const isCompleted = state === "completed";
              const isAvailable = state === "available";
              // Alternate alignment
              const side = globalIdx % 2 === 0 ? "left" : "right";

              return (
                <div key={res.id} className="track-segment">
                  {/* Connector line above (not for first node) */}
                  {(globalIdx > 0) && (
                    <ConnectorLine
                      filled={isCompleted || completedIds.has(sorted[globalIdx - 1]?.id)}
                      color={domainColor}
                    />
                  )}

                  {/* Node wrapper — card is a sibling here so it doesn't scale with node */}
                  <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
                    <div
                      className={`track-node ${state}`}
                      style={{
                        background: isCompleted
                          ? "#22c55e"
                          : isAvailable
                          ? domainColor
                          : "#94a3b8",
                        border: `3px solid ${isCompleted ? "#16a34a" : isAvailable ? domainColor + "99" : "#64748b"}`,
                        "--node-color-rgb": hexToRgb(domainColor),
                        marginLeft: side === "right" ? "80px" : "-80px",
                      }}
                      onClick={() => {
                        if (state === "locked") return;
                        setActiveCard(isActive ? null : res.id);
                      }}
                      aria-label={res.title}
                      role="button"
                      tabIndex={state !== "locked" ? 0 : -1}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && state !== "locked") {
                          setActiveCard(isActive ? null : res.id);
                        }
                      }}
                    >
                      <span className="track-node-icon">
                        {isCompleted ? "✓" : state === "locked" ? "🔒" : (TYPE_ICONS[res.type] || "📄")}
                      </span>
                      <span
                        className="track-node-number"
                        style={{ color: isCompleted ? "#16a34a" : isAvailable ? domainColor : "#64748b" }}
                      >
                        {globalIdx + 1}
                      </span>
                    </div>

                    {/* Card is a SIBLING of the node — not affected by node's transform */}
                    {state !== "locked" && (
                      <NodeCard
                        resource={res}
                        isCompleted={isCompleted}
                        isVisible={isActive}
                        domainColor={domainColor}
                        onToggle={onToggle}
                        onClose={() => setActiveCard(null)}
                        side={side}
                        nodeOffset={side === "right" ? 80 : -80}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Final star node */}
      <div className="track-segment">
        <ConnectorLine filled={sorted.every((r) => completedIds.has(r.id))} color={domainColor} />
        <div
          className="track-node"
          style={{
            background: sorted.every((r) => completedIds.has(r.id))
              ? "linear-gradient(135deg, #fbbf24, #f59e0b)"
              : "#94a3b8",
            border: "3px solid #f59e0b",
            fontSize: "24px",
            cursor: "default",
          }}
          aria-label="Course complete!"
        >
          🏆
        </div>
        <p style={{ fontSize: 13, color: "var(--res-muted, var(--text))", marginTop: 8 }}>
          {sorted.every((r) => completedIds.has(r.id)) ? "🎉 Completed!" : "Finish all to unlock"}
        </p>
      </div>
    </div>
  );
}

/* ---- Connector Line ---- */
function ConnectorLine({ filled, color }) {
  return (
    <div className="track-connector">
      <div className="track-connector-bg" />
      <div
        className="track-connector-fill"
        style={{
          height: filled ? "100%" : "0%",
          background: color,
        }}
      />
    </div>
  );
}

/* ---- Node Card ---- */
function NodeCard({ resource, isCompleted, isVisible, domainColor, onToggle, onClose, side, nodeOffset = 0 }) {
  const [toggling, setToggling] = useState(false);

  async function handleToggle() {
    if (toggling) return;
    setToggling(true);
    try {
      await onToggle(resource, isCompleted);
    } finally {
      setToggling(false);
    }
  }

  // Position card to the opposite side of the node offset so it doesn't overlap
  // The node is offset by nodeOffset px from center. Card goes to the other side.
  const nodeRadius = 28; // half of 56px node size
  const gap = 12;
  const cardStyle = side === "right"
    ? { right: `calc(50% + ${Math.abs(nodeOffset) + nodeRadius + gap}px)`, left: "auto" }
    : { left: `calc(50% + ${Math.abs(nodeOffset) + nodeRadius + gap}px)`, right: "auto" };

  return (
    <div
      className={`track-node-card ${isVisible ? "visible" : ""}`}
      style={cardStyle}
      onClick={(e) => e.stopPropagation()}
    >
      <span className={`type-badge ${resource.type || "article"}`}>
        {TYPE_ICONS[resource.type] || "📄"} {resource.type || "article"}
      </span>
      <p className="track-node-card-title">{resource.title}</p>
      {resource.description && (
        <p className="track-node-card-desc">{resource.description}</p>
      )}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {resource.alt_url ? (
          <>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="track-node-card-btn"
              style={{ background: domainColor, color: "#fff", fontSize: 12 }}
              onClick={() => { if (!isCompleted) handleToggle(); }}
            >
              🇬🇧 English ↗
            </a>
            <a
              href={resource.alt_url}
              target="_blank"
              rel="noopener noreferrer"
              className="track-node-card-btn"
              style={{ background: "#f97316", color: "#fff", fontSize: 12 }}
              onClick={() => { if (!isCompleted) handleToggle(); }}
              title={resource.alt_source || "Hindi"}
            >
              🇮🇳 {resource.alt_source || "Hindi"} ↗
            </a>
          </>
        ) : (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="track-node-card-btn"
            style={{ background: domainColor, color: "#fff" }}
            onClick={() => { if (!isCompleted) handleToggle(); }}
          >
            Open ↗
          </a>
        )}
        <button
          className="track-node-card-btn"
          onClick={handleToggle}
          disabled={toggling}
          style={{
            background: isCompleted ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)",
            color: isCompleted ? "#ef4444" : "#22c55e",
            border: "none",
          }}
        >
          {toggling ? "..." : isCompleted ? "↩ Undo" : "✓ Done"}
        </button>
      </div>
    </div>
  );
}

/* ---- Helpers ---- */
function groupByWeek(resources) {
  const groups = {};
  for (const r of resources) {
    const wk = r.week_number || 1;
    if (!groups[wk]) groups[wk] = [];
    groups[wk].push(r);
  }
  for (const wk of Object.keys(groups)) {
    groups[wk].sort((a, b) => (a.order_in_week || 0) - (b.order_in_week || 0));
  }
  return groups;
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}
