import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./PlacementPlaybook.css";

/* ============================================================
   PLACEMENT PLAYBOOK – Skill Tree Data
   ============================================================ */

const SKILL_TREE = [
  {
    id: "foundation",
    icon: "🏗️",
    color: "#8b5cf6",
    label: "Step 1",
    title: "Build Your Foundation",
    desc: "Set up your professional presence before anything else.",
    items: [
      { text: "Create a strong GitHub profile (pinned repos, README)" },
      { text: "Build a clean LinkedIn profile with a professional photo" },
      { text: "Write a 1-page resume using a clean template (Overleaf)" },
      { text: "Complete your college email & professional email setup" },
      { text: "Get a GitHub Student Developer Pack (free tools!)" },
    ],
    links: [
      { label: "Overleaf Resume Templates", url: "https://www.overleaf.com/gallery/tagged/cv" },
      { label: "GitHub Student Pack", url: "https://education.github.com/pack" },
    ],
  },
  {
    id: "dsa",
    icon: "🧠",
    color: "#22c55e",
    label: "Step 2",
    title: "DSA Mastery",
    desc: "The #1 thing that gets you through technical rounds.",
    items: [
      { text: "Learn Arrays, Strings, Hashing (LeetCode Easy)" },
      { text: "Master Two Pointers, Sliding Window, Binary Search" },
      { text: "Trees, Graphs — BFS/DFS (LeetCode Medium)" },
      { text: "Dynamic Programming — Knapsack, LCS, LIS" },
      { text: "Solve 150+ problems before interview season" },
      { text: "Practice on NeetCode Roadmap (structured approach)" },
    ],
    links: [
      { label: "NeetCode Roadmap", url: "https://neetcode.io/roadmap" },
      { label: "Striver's DSA Sheet", url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/" },
    ],
  },
  {
    id: "core",
    icon: "📚",
    color: "#f59e0b",
    label: "Step 3",
    title: "Core CS Subjects",
    desc: "Asked in almost every product company interview.",
    items: [
      { text: "Operating Systems: Processes, Threads, Deadlock, Memory" },
      { text: "DBMS: SQL, Normalization, Transactions, Indexing" },
      { text: "Computer Networks: OSI model, TCP/IP, HTTP, DNS" },
      { text: "OOP Concepts: Inheritance, Polymorphism, Abstraction" },
      { text: "System Design basics (for 2+ years experience)" },
    ],
    links: [
      { label: "OS Notes — Gate Smashers", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p" },
      { label: "Interviewbit CS Fundamentals", url: "https://www.interviewbit.com/courses/programming/" },
    ],
  },
  {
    id: "projects",
    icon: "🛠️",
    color: "#4f8ef7",
    label: "Step 4",
    title: "Projects & Open Source",
    desc: "Proof of what you can build — your strongest differentiator.",
    items: [
      { text: "Build 2-3 solid projects (not just to-do apps)" },
      { text: "Deploy every project (Vercel, Netlify, or Render)" },
      { text: "Add a proper README with screenshots & demo links" },
      { text: "Contribute to open source (good first issues on GitHub)" },
      { text: "Write about what you built (LinkedIn or a blog)" },
    ],
    links: [
      { label: "Good First Issues", url: "https://goodfirstissue.dev/" },
      { label: "Project Ideas", url: "https://github.com/practical-tutorials/project-based-learning" },
    ],
  },
  {
    id: "internships",
    icon: "🎯",
    color: "#ef4444",
    label: "Step 5",
    title: "Internship Hunt",
    desc: "Start early. Apply wide. Track everything.",
    items: [
      { text: "Start applying 4-5 months before the internship start" },
      { text: "Platforms: LinkedIn, Internshala, Wellfound, Unstop" },
      { text: "Target: startups first for experience, then big tech" },
      { text: "Cold DM to founders/engineers on LinkedIn (it works!)" },
      { text: "Aim for 50+ applications per cycle — don't just wait" },
      { text: "Track applications in a spreadsheet" },
    ],
    links: [
      { label: "Internshala", url: "https://internshala.com" },
      { label: "Wellfound (AngelList)", url: "https://wellfound.com/jobs" },
    ],
  },
  {
    id: "interview",
    icon: "💼",
    color: "#ec4899",
    label: "Step 6",
    title: "Interview Preparation",
    desc: "Crack every round — technical, project, and HR.",
    items: [
      { text: "Technical: 2-3 DSA problems (timed, explain aloud)" },
      { text: "Project round: Know every line of your projects" },
      { text: "HR round: STAR method for behavioral questions" },
      { text: "Mock interviews on Pramp or with friends" },
      { text: "Research the company before every interview" },
      { text: "Prepare questions to ask the interviewer" },
    ],
    links: [
      { label: "Pramp — Mock Interviews", url: "https://www.pramp.com" },
      { label: "HR Questions (Glassdoor)", url: "https://www.glassdoor.co.in/Interview/index.htm" },
    ],
  },
];

/* ============================================================
   PAGE COMPONENT
   ============================================================ */

export default function PlacementPlaybook() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [expandedSkill, setExpandedSkill] = useState(null);

  if (!authLoading && !user) {
    navigate("/");
    return null;
  }

  return (
    <div className="playbook-page">
      <div className="playbook-content">
        <div className="playbook-intro">
          <h2>🏆 The Placement Playbook</h2>
          <p>
            From building your first profile to cracking your first offer — a structured skill tree
            covering everything: internships, DSA, core CS, open source, and the interview grind.
            Click any node to expand the full checklist.
          </p>
          <button
            onClick={() => navigate("/tech-guide")}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              borderRadius: "8px",
              background: "var(--code-bg)",
              border: "1px solid var(--border)",
              color: "var(--text-h)",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            ← Back to Tech Guide
          </button>
        </div>

        {/* Skill Tree */}
        <div className="skill-tree">
          {SKILL_TREE.map((skill, idx) => {
            const isExpanded = expandedSkill === skill.id;
            return (
              <div key={skill.id} className="skill-level">
                {idx % 2 === 0 ? (
                  <>
                    <SkillCard
                      skill={skill}
                      isExpanded={isExpanded}
                      onToggle={() => setExpandedSkill(isExpanded ? null : skill.id)}
                    />
                    <div className="skill-level-spacer" />
                    <CenterNode skill={skill} />
                    <div className="skill-level-spacer" />
                  </>
                ) : (
                  <>
                    <div className="skill-level-spacer" />
                    <CenterNode skill={skill} />
                    <div className="skill-level-spacer" />
                    <SkillCard
                      skill={skill}
                      isExpanded={isExpanded}
                      onToggle={() => setExpandedSkill(isExpanded ? null : skill.id)}
                    />
                  </>
                )}
              </div>
            );
          })}

          {/* Final node */}
          <div className="placed-node">
            <div style={{ fontSize: 40, marginBottom: 10 }}>🎉</div>
            <h3>Placed!</h3>
            <p>You've done the work. Now go get that offer.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Center Node ---- */
function CenterNode({ skill }) {
  return (
    <div
      className="skill-center-node"
      style={{ borderColor: skill.color, color: skill.color }}
      aria-hidden="true"
    >
      {skill.icon}
    </div>
  );
}

/* ---- Skill Card ---- */
function SkillCard({ skill, isExpanded, onToggle }) {
  return (
    <div
      className={`skill-card ${isExpanded ? "expanded" : ""}`}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onToggle()}
      aria-expanded={isExpanded}
      id={`skill-${skill.id}`}
    >
      <span
        className="skill-card-label"
        style={{ background: skill.color + "22", color: skill.color }}
      >
        {skill.label}
      </span>
      <div className="skill-card-top">
        <div>
          <p className="skill-card-title">{skill.title}</p>
          <p className="skill-card-desc">{skill.desc}</p>
        </div>
        <span className="skill-chevron">▼</span>
      </div>

      <div className="skill-card-body">
        <div className="skill-checklist">
          {skill.items.map((item, i) => (
            <div key={i} className="skill-check-item">
              <div
                className="skill-check-dot"
                style={{ borderColor: skill.color + "66" }}
              />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
        {skill.links && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
            {skill.links.map((l) => (
              <a
                key={l.label}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="skill-link"
                onClick={(e) => e.stopPropagation()}
              >
                {l.label} ↗
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
