import { useState } from "react";
import { MODULE_TITLES } from "../../data/resourcesData";

const TYPE_ICONS = {
  video: "▶",
  article: "📄",
  exercise: "💪",
  docs: "📚",
  tool: "🔧",
};

const TYPE_LABELS = {
  video: "Video",
  article: "Article",
  exercise: "Exercise",
  docs: "Docs",
  tool: "Tool",
};

/**
 * LibraryMode – Week accordion view with checkboxes for each resource.
 *
 * @param {Object[]} resources  – array of resource objects (from Supabase or seed)
 * @param {Set<string>} completedIds – set of completed resource IDs
 * @param {Function} onToggle   – (resource, isCompleted) => void
 * @param {string} domainColor  – hex color for accent
 * @param {string} domainId     – domain slug for looking up week titles
 */
export default function LibraryMode({ resources, completedIds, onToggle, domainColor, domainId }) {
  // Group by week
  const weeks = groupByWeek(resources);
  const weekNumbers = Object.keys(weeks).map(Number).sort((a, b) => a - b);

  // Track which weeks are open (all open by default)
  const [openWeeks, setOpenWeeks] = useState(() => new Set(weekNumbers));

  function toggleWeek(wk) {
    setOpenWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(wk)) next.delete(wk);
      else next.add(wk);
      return next;
    });
  }

  if (!resources || resources.length === 0) {
    return (
      <div className="resources-loading" style={{ padding: "60px 0" }}>
        <p>No resources yet for this domain. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="library-mode">
      {weekNumbers.map((wk) => {
        const weekResources = weeks[wk];
        const completedInWeek = weekResources.filter((r) => completedIds.has(r.id)).length;
        const isOpen = openWeeks.has(wk);
        const pct = weekResources.length > 0
          ? Math.round((completedInWeek / weekResources.length) * 100)
          : 0;
        // Look up the descriptive topic title
        const weekTitle = (MODULE_TITLES[domainId] && MODULE_TITLES[domainId][wk])
          ? MODULE_TITLES[domainId][wk]
          : `${weekResources.length} resource${weekResources.length !== 1 ? "s" : ""}`;

        return (
          <div key={wk} className={`library-week ${isOpen ? "open" : ""}`}>
            {/* Week Header */}
            <div
              className="library-week-header"
              onClick={() => toggleWeek(wk)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && toggleWeek(wk)}
              aria-expanded={isOpen}
            >
              <div className="library-week-left">
                <span
                  className="library-week-num"
                  style={{
                    background: domainColor + "22",
                    color: domainColor,
                  }}
                >
                  Module {wk}
                </span>
                <p className="library-week-title">{weekTitle}</p>
              </div>

              <div className="library-week-progress">
                <div className="library-week-mini-bar">
                  <div
                    className="library-week-mini-bar-fill"
                    style={{
                      width: `${pct}%`,
                      background: domainColor,
                    }}
                  />
                </div>
                <span className="library-week-count">
                  {completedInWeek}/{weekResources.length}
                </span>
                <span className="library-week-chevron">▼</span>
              </div>
            </div>

            {/* Week Body */}
            <div className="library-week-body">
              <div className="library-resource-list">
                {weekResources.map((res) => {
                  const isDone = completedIds.has(res.id);
                  return (
                    <ResourceRow
                      key={res.id}
                      resource={res}
                      isDone={isDone}
                      onToggle={onToggle}
                      domainColor={domainColor}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---- Resource Row ---- */
function ResourceRow({ resource, isDone, onToggle, domainColor }) {
  const [toggling, setToggling] = useState(false);

  async function handleToggle(e) {
    e.stopPropagation();
    if (toggling) return;
    setToggling(true);
    try {
      await onToggle(resource, isDone);
    } finally {
      setToggling(false);
    }
  }

  return (
    <div className={`library-resource-row ${isDone ? "completed" : ""}`}>
      {/* Checkbox */}
      <div
        className={`resource-checkbox ${isDone ? "checked" : ""}`}
        style={isDone ? { background: domainColor, borderColor: domainColor } : {}}
        onClick={handleToggle}
        role="checkbox"
        aria-checked={isDone}
        tabIndex={0}
        onKeyDown={(e) => e.key === " " && handleToggle(e)}
        title={isDone ? "Mark incomplete" : "Mark complete"}
      >
        <span className="resource-checkbox-check">✓</span>
      </div>

      {/* Info */}
      <div className="library-resource-info">
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span className={`type-badge ${resource.type || "article"}`}>
            {TYPE_ICONS[resource.type] || "📄"} {TYPE_LABELS[resource.type] || "Article"}
          </span>
        </div>
        <p className="library-resource-title">{resource.title}</p>
        {resource.description && (
          <p className="library-resource-desc">{resource.description}</p>
        )}
      </div>

      {/* External Links */}
      <div className="library-resource-actions">
        {resource.alt_url ? (
          <>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="library-resource-lang-btn eng"
              onClick={(e) => e.stopPropagation()}
              title="Watch in English"
              aria-label={`Open ${resource.title} in English`}
            >
              🇬🇧
            </a>
            <a
              href={resource.alt_url}
              target="_blank"
              rel="noopener noreferrer"
              className="library-resource-lang-btn hin"
              onClick={(e) => e.stopPropagation()}
              title={`Watch in Hindi (${resource.alt_source || "Hindi"})`}
              aria-label={`Open ${resource.title} in Hindi`}
            >
              🇮🇳
            </a>
          </>
        ) : (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="library-resource-link"
            onClick={(e) => e.stopPropagation()}
            title="Open resource"
            aria-label={`Open ${resource.title}`}
          >
            ↗
          </a>
        )}
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
  // Sort each week's resources by order_in_week
  for (const wk of Object.keys(groups)) {
    groups[wk].sort((a, b) => (a.order_in_week || 0) - (b.order_in_week || 0));
  }
  return groups;
}

function getWeekTitle(resources) {
  // Derive a title from the resource titles in this week
  if (!resources || resources.length === 0) return "Resources";
  // Use a hand-crafted mapping or fall back to "X resources"
  return `${resources.length} resource${resources.length !== 1 ? "s" : ""}`;
}
