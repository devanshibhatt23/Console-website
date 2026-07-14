import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./TechGuide.css";

/* ============================================================
   DATA — 1st Year Guide
   ============================================================ */

const TOOLS = [
  {
    id: "vscode",
    color: "#007acc",
    name: "Visual Studio Code",
    tagline: "Your primary coding environment",
    what: "A free, open-source code editor by Microsoft - the digital workshop where you'll spend most of your time as a developer.",
    points: [
      "Industry Standard: Used by 70%+ of developers worldwide",
      "Extensible: Thousands of extensions for any language",
      "IntelliSense: Smart code completion & error detection",
      "Integrated Terminal: Run commands without leaving the editor",
      "Git Integration: Built-in version control features",
      "Free & Cross-platform: Windows, Mac, and Linux",
    ],
    links: [
      { label: "Download VS Code", url: "https://code.visualstudio.com/", primary: true },
      { label: "Watch Tutorial", url: "https://www.youtube.com/watch?v=VqCgcpAypFQ", primary: false },
      { label: "Tips & Tricks", url: "https://code.visualstudio.com/docs/getstarted/tips-and-tricks", primary: false },
    ],
  },
  {
    id: "git",
    color: "#f34f29",
    name: "Git & GitHub",
    tagline: "Version control & collaboration",
    what: "Git tracks changes in your code like a time machine. GitHub hosts your repositories and enables collaboration. Think of Git as snapshots and GitHub as the shared photo album.",
    points: [
      "Version Control: Never lose your work - track every change",
      "Collaboration: Work with teams on the same project",
      "Portfolio: Showcase projects to employers",
      "Open Source: Contribute to projects used by millions",
      "Industry Standard: Every company uses Git",
    ],
    commands: [
      { cmd: "git init", desc: "Start a new repository" },
      { cmd: "git clone", desc: "Copy a repository" },
      { cmd: "git add", desc: "Stage changes" },
      { cmd: "git commit", desc: "Save a snapshot" },
      { cmd: "git push", desc: "Upload to GitHub" },
      { cmd: "git pull", desc: "Download updates" },
    ],
    links: [
      { label: "Join GitHub", url: "https://github.com", primary: true },
      { label: "Git Tutorial", url: "https://www.youtube.com/watch?v=RGOj5yH7evk", primary: false },
      { label: "GitHub Guide", url: "https://docs.github.com/en/get-started", primary: false },
    ],
  },
  {
    id: "platforms",
    color: "#22c55e",
    name: "Coding Platforms",
    tagline: "Practice, compete, and grow",
    what: "Websites where you practice programming, solve real problems, and track your progress. Most tech companies use similar problems in their interviews.",
    points: [
      "Interview Prep: Most companies test on these problems",
      "Skill Assessment: Track progress & identify weak areas",
      "Community: Learn from solutions and discussions",
      "Portfolio: Showcase your problem-solving ability",
    ],
    platforms: [
      { name: "LeetCode", url: "https://leetcode.com", color: "#f89f1b", bg: "rgba(248,159,27,0.12)", goal: "DSA & Interviews" },
      { name: "Codeforces", url: "https://codeforces.com", color: "#1fa7df", bg: "rgba(31,167,223,0.12)", goal: "Competitive Programming" },
      { name: "CodeChef", url: "https://codechef.com", color: "#5b4638", bg: "rgba(91,70,56,0.12)", goal: "CP Contests" },
      { name: "HackerRank", url: "https://hackerrank.com", color: "#2ec866", bg: "rgba(46,200,102,0.12)", goal: "Certifications" },
      { name: "FreeCodeCamp", url: "https://freecodecamp.org", color: "#4f8ef7", bg: "rgba(79,142,247,0.1)", goal: "Web Dev Projects" },
    ],
  },
];

const PATHS = [
  {
    title: "Competitive Programming",
    color: "#1fa7df",
    desc: "Fast logic solving under time pressure.",
    platforms: "Codeforces, CodeChef",
    bullets: ["Time-based challenges", "Algorithm optimization", "Problem-solving speed"],
  },
  {
    title: "Data Structures & Algorithms",
    color: "#22c55e",
    desc: "Structured thinking and systematic coding.",
    platforms: "LeetCode, HackerRank",
    bullets: ["Systematic problem solving", "Interview preparation", "Core CS concepts"],
  },
  {
    title: "Development",
    color: "#f59e0b",
    desc: "Building real-world projects end-to-end.",
    platforms: "FreeCodeCamp, GitHub",
    bullets: ["Project-based learning", "Real-world applications", "Portfolio building"],
  },
];

const HACKATHON_STEPS = [
  "Find a hackathon on Devfolio or Unstop",
  "Form a team or join an existing one",
  "Register and attend orientation",
  "Build your project (24-48 hours)",
  "Present & demo your solution",
];

const EVENTS = [
  { name: "Startup Mahakumbh", desc: "India's largest startup festival" },
  { name: "TiECon", desc: "Global startup ecosystem conference" },
  { name: "InnoThrone", desc: "Local innovation showcase" },
  { name: "DevFests", desc: "Community-driven tech events" },
  { name: "Devfolio Hackathons", desc: "Online hackathons year-round" },
  { name: "MLH Hackathons", desc: "Major League Hacking events" },
];

/* ============================================================
   PAGE COMPONENT
   ============================================================ */

export default function TechGuide() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  if (!authLoading && !user) {
    navigate("/");
    return null;
  }

  return (
    <div className="techguide-page" style={{ position: "relative" }}>
      {/* Hero */}
      <div className="techguide-hero">
        <h1>Tech Guide</h1>
        <p>
          Everything you need to set up, understand the landscape, and start
          building - all in one place for your first year in tech.
        </p>

        {/* CTA to Placement Playbook */}
        <div className="techguide-cta-row">
          <a href="#tools" className="tg-cta-btn">
            First-year guide
          </a>
          <button
            onClick={() => navigate("/placement-playbook")}
            className="tg-cta-btn"
          >
            Placement guide
          </button>
        </div>
      </div>

      <div className="guide-content">

        {/* Section 1: Essential Tools */}
        <div className="guide-section" id="tools">
          <div className="guide-section-header">
            <div>
              <p className="guide-section-title">Essential Tools & Platforms</p>
              <p className="guide-section-sub">Set these up in your first week - you'll use them every day</p>
            </div>
          </div>
          <div className="tool-grid">
            {TOOLS.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
          </div>
        </div>

        {/* Section 2: Understanding Paths */}
        <div className="guide-section">
          <div className="guide-section-header">
            <div>
              <p className="guide-section-title">Understanding Different Paths</p>
              <p className="guide-section-sub">Three directions in tech - know the difference early</p>
            </div>
          </div>

          <div className="path-grid">
            {PATHS.map((path) => (
              <div key={path.title} className="path-card" style={{ borderTop: `3px solid ${path.color}` }}>
                <p className="path-card-title">{path.title}</p>
                <p className="path-card-desc">{path.desc}</p>
                <p style={{ fontSize: "13px", color: path.color, fontWeight: 700, marginBottom: 10 }}>
                  {path.platforms}
                </p>
                <ul className="path-card-bullets">
                  {path.bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <div className="recommendation-box">
            <p>
              <strong>Recommendation:</strong> Start with <strong>DSA</strong> to build a strong
              foundation, then move to <strong>Development</strong> to build real projects.{" "}
              <strong>Competitive Programming</strong> can be pursued alongside for interview
              preparation and sharpening your problem-solving speed.
            </p>
          </div>
        </div>

        {/* Section 3: Hackathons */}
        <div className="guide-section">
          <div className="guide-section-header">
            <div>
              <p className="guide-section-title">Hackathons - The Game-Changer</p>
              <p className="guide-section-sub">Intense 24-48 hour builds that accelerate your growth like nothing else</p>
            </div>
          </div>

          <p className="guide-section-copy">
            Hackathons are where you meet your future teammates, learn technologies in hours, win prizes,
            and build portfolio projects that actually stand out. Attend at least one per semester.
          </p>

          <div className="hackathon-steps">
            {HACKATHON_STEPS.map((step, i) => (
              <div key={i} className="hackathon-step">
                <div className="hackathon-step-num">{i + 1}</div>
                <p className="hackathon-step-text">{step}</p>
              </div>
            ))}
          </div>

          <p className="guide-section-title guide-subheading">Key Events to Participate In</p>
          <div className="events-grid">
            {EVENTS.map((ev) => (
              <div key={ev.name} className="event-card">
                <div>
                  <p className="event-card-name">{ev.name}</p>
                  <p className="event-card-desc">{ev.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="recommendation-box" style={{ marginTop: 24 }}>
            <p>
              <strong>Startup x Tech:</strong> Hackathons generate ideas, coding skills fuel MVPs,
              and MVPs attract investors. Many successful Indian startups started at a hackathon.{" "}
              <strong>InnoThrone, Startup Mahakumbh</strong> and <strong>TiECon</strong> are great
              events to network with founders and get mentorship.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ---- Sub-components ---- */
function ToolCard({ tool }) {
  return (
    <div className="tool-card" style={{ "--tool-color": tool.color }}>
      <p className="tool-card-name">{tool.name}</p>
      <p style={{ fontSize: 11, fontWeight: 700, color: tool.color, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {tool.tagline}
      </p>
      <p className="tool-card-what">{tool.what}</p>

      {tool.points && (
        <ul className="tool-card-points">
          {tool.points.map((p) => <li key={p}>{p}</li>)}
        </ul>
      )}

      {tool.commands && (
        <div className="git-commands">
          {tool.commands.map((c) => (
            <div key={c.cmd} className="git-command">
              <span>{c.cmd}</span> - {c.desc}
            </div>
          ))}
        </div>
      )}

      {tool.platforms && (
        <div className="platform-chips">
          {tool.platforms.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="platform-chip"
              style={{ background: p.bg, borderColor: p.color + "44", color: p.color }}
            >
              {p.name}
              <span style={{ fontWeight: 400, color: "var(--tg-text)", fontSize: 10 }}>{p.goal}</span>
            </a>
          ))}
        </div>
      )}

      {tool.links && (
        <div className="tool-card-links">
          {tool.links.map((l) => (
            <a
              key={l.label}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`tool-link-btn ${l.primary ? "primary" : "secondary"}`}
              style={{ background: l.primary ? tool.color : tool.color + "22", color: l.primary ? "#fff" : tool.color }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
