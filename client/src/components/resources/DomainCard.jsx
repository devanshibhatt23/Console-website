import { useNavigate } from "react-router-dom";

const CIRCUMFERENCE = 2 * Math.PI * 22; // r=22

/**
 * DomainCard – Displays a domain with icon, progress ring, description, and CTA
 */
export default function DomainCard({ domain, completed = 0, total = 0 }) {
  const navigate = useNavigate();
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;

  const handleClick = () => {
    navigate(`/resources/${domain.id}`);
  };

  return (
    <div
      className="domain-card"
      onClick={handleClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      style={{ "--domain-color": domain.color }}
    >
      {/* Hover gradient overlay */}
      <div
        className="domain-card-gradient"
        style={{ background: domain.gradient + "22" }}
      />

      <div className="domain-card-inner">
        <div className="domain-card-top">
          {/* Icon */}
          <div
            className="domain-icon-wrap"
            style={{
              background: domain.color + "22",
              border: `1.5px solid ${domain.color}44`,
            }}
          >
            <span aria-hidden="true">{domain.icon}</span>
          </div>

          {/* Title + desc */}
          <div style={{ flex: 1, textAlign: "left" }}>
            <p className="domain-card-title">{domain.name}</p>
            <p className="domain-card-desc" style={{ marginTop: 4 }}>
              {domain.description}
            </p>
          </div>

          {/* Progress ring */}
          <div className="progress-ring-wrap" aria-label={`${pct}% complete`}>
            <svg className="progress-ring-svg" viewBox="0 0 52 52">
              <circle
                className="progress-ring-track"
                cx="26"
                cy="26"
                r="22"
              />
              <circle
                className="progress-ring-fill"
                cx="26"
                cy="26"
                r="22"
                stroke={domain.color}
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={offset}
              />
            </svg>
            <div className="progress-ring-label" style={{ color: domain.color }}>
              {pct}%
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="domain-card-footer">
          <span className="domain-card-weeks">
            📅 {domain.totalWeeks} weeks · {total} resources
          </span>
          <span className="domain-cta" style={{ color: domain.color }}>
            {completed > 0 ? "Continue" : "Start"} →
          </span>
        </div>
      </div>
    </div>
  );
}
