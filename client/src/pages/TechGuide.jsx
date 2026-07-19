import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  ArrowRight, CheckCircle2, Code2, Cpu, Trophy,
  GitBranch, Terminal, Zap, Globe, Users, Star, ExternalLink,
  ChevronRight, Layers, Rocket, Calendar, Award
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./TechGuide.css";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   DATA
   ============================================================ */

const TOOLS = [
  {
    id: "vscode",
    tag: "editor",
    icon: Code2,
    accent: "tg-accent-blue",
    color: "#60a5fa",
    glow: "rgba(96,165,250,0.15)",
    name: "Visual Studio Code",
    tagline: "Your primary coding environment",
    points: [
      "Industry Standard: used by 70%+ of developers worldwide",
      "Extensible: thousands of extensions for any language",
      "IntelliSense: smart code completion & error detection",
      "Integrated Terminal: run commands without leaving the editor",
      "Git Integration: built-in version control features",
      "Free & Cross-platform: Windows, Mac, and Linux",
    ],
    meta1: "Free forever",
    meta2: "microsoft.com",
    links: [
      { label: "Download VS Code", url: "https://code.visualstudio.com/", primary: true },
      { label: "Watch Tutorial", url: "https://www.youtube.com/watch?v=VqCgcpAypFQ", primary: false },
      { label: "Tips & Tricks", url: "https://code.visualstudio.com/docs/getstarted/tips-and-tricks", primary: false },
    ],
  },
  {
    id: "git",
    tag: "version-control",
    icon: GitBranch,
    accent: "tg-accent-orange",
    color: "#fb923c",
    glow: "rgba(251,146,60,0.15)",
    name: "Git & GitHub",
    tagline: "Version control & collaboration",
    points: [
      "Version Control: never lose your work, track every change",
      "Collaboration: work with teams on the same project",
      "Portfolio: showcase projects to employers",
      "Open Source: contribute to projects used by millions",
      "Industry Standard: every company uses Git",
    ],
    commands: [
      { cmd: "git init",   desc: "Start a new repository" },
      { cmd: "git clone",  desc: "Copy a repository" },
      { cmd: "git add",    desc: "Stage changes" },
      { cmd: "git commit", desc: "Save a snapshot" },
      { cmd: "git push",   desc: "Upload to GitHub" },
      { cmd: "git pull",   desc: "Download updates" },
    ],
    meta1: "Free & open source",
    meta2: "github.com",
    links: [
      { label: "Join GitHub",   url: "https://github.com", primary: true },
      { label: "Git Tutorial",  url: "https://www.youtube.com/watch?v=RGOj5yH7evk", primary: false },
      { label: "GitHub Guide",  url: "https://docs.github.com/en/get-started", primary: false },
    ],
  },
  {
    id: "platforms",
    tag: "practice",
    icon: Terminal,
    accent: "tg-accent-green",
    color: "#4ade80",
    glow: "rgba(74,222,128,0.15)",
    name: "Coding Platforms",
    tagline: "Practice, compete, and grow",
    points: [
      "Interview Prep: most companies test on these problems",
      "Skill Assessment: track progress & identify weak areas",
      "Community: learn from solutions and discussions",
      "Portfolio: showcase your problem-solving ability",
    ],
    platforms: [
      { name: "LeetCode",     url: "https://leetcode.com",     color: "#f89f1b", bg: "rgba(248,159,27,0.10)", goal: "DSA & Interviews" },
      { name: "Codeforces",   url: "https://codeforces.com",   color: "#60a5fa", bg: "rgba(96,165,250,0.10)", goal: "Competitive Programming" },
      { name: "CodeChef",     url: "https://codechef.com",     color: "#a78bfa", bg: "rgba(167,139,250,0.10)", goal: "CP Contests" },
      { name: "HackerRank",   url: "https://hackerrank.com",   color: "#4ade80", bg: "rgba(74,222,128,0.10)", goal: "Certifications" },
      { name: "FreeCodeCamp", url: "https://freecodecamp.org", color: "#38bdf8", bg: "rgba(56,189,248,0.10)", goal: "Web Dev Projects" },
    ],
    meta1: "Free to start",
    meta2: "5 platforms",
    links: [],
  },
];

const PATHS = [
  {
    id: "cp",
    tag: "competitive-prog",
    icon: Trophy,
    accent: "tg-accent-yellow",
    color: "#facc15",
    glow: "rgba(250,204,21,0.15)",
    title: "Competitive Programming",
    desc: "Fast logic solving under time pressure.",
    steps: ["Time-based challenges", "Algorithm optimization", "Problem-solving speed", "Codeforces & CodeChef"],
    meta1: "~6 months",
    meta2: "Newbie → Expert",
    badge: "Speed",
  },
  {
    id: "dsa",
    tag: "dsa",
    icon: Cpu,
    accent: "tg-accent-green",
    color: "#4ade80",
    glow: "rgba(74,222,128,0.15)",
    title: "Data Structures & Algorithms",
    desc: "Structured thinking and systematic coding.",
    steps: ["Systematic problem solving", "Interview preparation", "Core CS concepts", "LeetCode & HackerRank"],
    meta1: "~8 months",
    meta2: "Beginner → Interview-ready",
    badge: "Foundation",
  },
  {
    id: "dev",
    tag: "development",
    icon: Code2,
    accent: "tg-accent-purple",
    color: "#c084fc",
    glow: "rgba(192,132,252,0.15)",
    title: "Development",
    desc: "Building real-world projects end-to-end.",
    steps: ["Project-based learning", "Real-world applications", "Portfolio building", "FreeCodeCamp & GitHub"],
    meta1: "~9 months",
    meta2: "Beginner → Hireable",
    badge: "Builder",
  },
];

const HACKATHON_STEPS = [
  { num: "01", title: "Find a Hackathon", desc: "Browse Devfolio or Unstop for upcoming events", icon: Globe },
  { num: "02", title: "Form a Team", desc: "Team up or join solo in an existing group", icon: Users },
  { num: "03", title: "Register & Attend", desc: "Sign up and attend the orientation session", icon: Calendar },
  { num: "04", title: "Build Your Project", desc: "Sprint hard for 24–48 hours of pure creation", icon: Zap },
  { num: "05", title: "Present & Demo", desc: "Showcase your solution to judges and the world", icon: Star },
];

const EVENTS = [
  { name: "Startup Mahakumbh",   tag: "startup",   desc: "India's largest startup festival",         meta: "Annual · Delhi",       color: "#f59e0b", icon: Rocket },
  { name: "TiECon",              tag: "networking", desc: "Global startup ecosystem conference",      meta: "Annual · Global",      color: "#60a5fa", icon: Globe },
  { name: "InnoThrone",          tag: "innovation", desc: "Local innovation showcase",                meta: "Semester · Local",     color: "#4ade80", icon: Award },
  { name: "DevFests",            tag: "community",  desc: "Community-driven tech events",             meta: "Year-round",           color: "#c084fc", icon: Users },
  { name: "Devfolio Hackathons", tag: "hackathon",  desc: "Online hackathons year-round",             meta: "Online · Monthly",     color: "#fb923c", icon: Layers },
  { name: "MLH Hackathons",      tag: "hackathon",  desc: "Major League Hacking events",              meta: "Online · Monthly",     color: "#f43f5e", icon: Trophy },
];

const SKILL_TREE = [
  {
    id: "foundation",
    color: "#8b5cf6",
    glow: "rgba(139,92,246,0.15)",
    label: "Step 1",
    tag: "foundation",
    icon: Layers,
    title: "Build Your Foundation",
    desc: "Set up your professional presence before anything else.",
    points: [
      "Create a strong GitHub profile (pinned repos, README)",
      "Build a clean LinkedIn profile with a professional photo",
      "Write a 1-page resume using a clean template (Overleaf)",
      "Complete your college email & professional email setup",
      "Get a GitHub Student Developer Pack (free tools)",
    ],
    links: [
      { label: "Overleaf Resume", url: "https://www.overleaf.com/gallery/tagged/cv", primary: true },
      { label: "GitHub Student Pack", url: "https://education.github.com/pack", primary: false },
    ],
  },
  {
    id: "dsa",
    color: "#22c55e",
    glow: "rgba(34,197,94,0.15)",
    label: "Step 2",
    tag: "dsa-mastery",
    icon: Cpu,
    title: "DSA Mastery",
    desc: "The #1 thing that gets you through technical rounds.",
    points: [
      "Learn Arrays, Strings, Hashing (LeetCode Easy)",
      "Master Two Pointers, Sliding Window, Binary Search",
      "Trees, Graphs - BFS/DFS (LeetCode Medium)",
      "Dynamic Programming - Knapsack, LCS, LIS",
      "Solve 150+ problems before interview season",
      "Practice on NeetCode Roadmap (structured approach)",
    ],
    links: [
      { label: "NeetCode Roadmap", url: "https://neetcode.io/roadmap", primary: true },
      { label: "Striver's DSA Sheet", url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/", primary: false },
    ],
  },
  {
    id: "core",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.15)",
    label: "Step 3",
    tag: "core-cs",
    icon: Terminal,
    title: "Core CS Subjects",
    desc: "Asked in almost every product company interview.",
    points: [
      "Operating Systems: Processes, Threads, Deadlock, Memory",
      "DBMS: SQL, Normalization, Transactions, Indexing",
      "Computer Networks: OSI model, TCP/IP, HTTP, DNS",
      "OOP Concepts: Inheritance, Polymorphism, Abstraction",
      "System Design basics (for 2+ years experience)",
    ],
    links: [
      { label: "OS Notes - Gate Smashers", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p", primary: true },
      { label: "Interviewbit CS Fundamentals", url: "https://www.interviewbit.com/courses/programming/", primary: false },
    ],
  },
  {
    id: "projects",
    color: "#3b82f6",
    glow: "rgba(59,130,246,0.15)",
    label: "Step 4",
    tag: "projects-dev",
    icon: Code2,
    title: "Projects & Open Source",
    desc: "Proof of what you can build - your strongest differentiator.",
    points: [
      "Build 2-3 solid projects (not just to-do apps)",
      "Deploy every project (Vercel, Netlify, or Render)",
      "Add a proper README with screenshots & demo links",
      "Contribute to open source (good first issues on GitHub)",
      "Write about what you built (LinkedIn or a blog)",
    ],
    links: [
      { label: "Good First Issues", url: "https://goodfirstissue.dev/", primary: true },
      { label: "Project Ideas", url: "https://github.com/practical-tutorials/project-based-learning", primary: false },
    ],
  },
  {
    id: "internships",
    color: "#ef4444",
    glow: "rgba(239,68,68,0.15)",
    label: "Step 5",
    tag: "internship-hunt",
    icon: Globe,
    title: "Internship Hunt",
    desc: "Start early. Apply wide. Track everything.",
    points: [
      "Start applying 4-5 months before the internship start",
      "Platforms: LinkedIn, Internshala, Wellfound, Unstop",
      "Target: startups first for experience, then big tech",
      "Cold DM to founders/engineers on LinkedIn (it works)",
      "Aim for 50+ applications per cycle - don't just wait",
      "Track applications in a spreadsheet",
    ],
    links: [
      { label: "Internshala", url: "https://internshala.com", primary: true },
      { label: "Wellfound Jobs", url: "https://wellfound.com/jobs", primary: false },
    ],
  },
  {
    id: "interview",
    color: "#ec4899",
    glow: "rgba(236,72,153,0.15)",
    label: "Step 6",
    tag: "interview-prep",
    icon: Trophy,
    title: "Interview Preparation",
    desc: "Crack every round - technical, project, and HR.",
    points: [
      "Technical: 2-3 DSA problems (timed, explain aloud)",
      "Project round: Know every line of your projects",
      "HR round: STAR method for behavioral questions",
      "Mock interviews on Pramp or with friends",
      "Research the company before every interview",
      "Prepare questions to ask the interviewer",
    ],
    links: [
      { label: "Pramp - Mock Interviews", url: "https://www.pramp.com", primary: true },
      { label: "HR Questions (Glassdoor)", url: "https://www.glassdoor.co.in/Interview/index.htm", primary: false },
    ],
  },
];

/* ============================================================
   PAGE
   ============================================================ */

export default function TechGuide() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const headerRef = useRef(null);

  // Read tab parameter from URL query state (e.g. ?tab=placement) or default to first-year
  const activeTab = searchParams.get("tab") === "placement" ? "placement" : "first-year";

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" }
      );

      // Stagger sections
      gsap.utils.toArray(".tg-reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.75, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 82%" },
          }
        );
      });

      // Card stagger inside sections
      gsap.utils.toArray(".tg-stagger-group").forEach((group) => {
        const cards = group.querySelectorAll(".tg-card, .tg-hack-card, .tg-event-card");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 35, scale: 0.97 },
          {
            opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.09, ease: "power3.out",
            scrollTrigger: { trigger: group, start: "top 80%" },
          }
        );
      });
    });

    return () => ctx.revert();
  }, [activeTab]);

  if (!authLoading && !user) {
    navigate("/");
    return null;
  }

  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName });
    // Scroll smoothly to main content container start
    setTimeout(() => {
      const el = document.getElementById("tech-guide-content");
      if (el) {
        const lenis = window.__lenis;
        if (lenis) lenis.scrollTo(el, { offset: -90, duration: 0.8 });
        else el.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div className="tg-page">
      {/* Ambient background blobs */}
      <div className="tg-blob tg-blob-1" />
      <div className="tg-blob tg-blob-2" />
      <div className="tg-blob tg-blob-3" />

      {/* ── Hero ── */}
      <div className="tg-hero" ref={headerRef}>
        <div className="tg-hero-inner">
          <h1 className="tg-h1">Tech Guide</h1>
          <p className="tg-hero-sub">
            Everything you need to set up, understand the landscape, and start
            building - all in one place for your first year in tech.
          </p>
          <div className="tg-cta-row">
            <button
              onClick={() => handleTabChange("first-year")}
              className={activeTab === "first-year" ? "tg-btn-primary" : "tg-btn-ghost"}
            >
              First Year Guide
            </button>
            <button
              onClick={() => handleTabChange("placement")}
              className={activeTab === "placement" ? "tg-btn-primary" : "tg-btn-ghost"}
            >
              Placement Guide
            </button>
          </div>


        </div>
      </div>

      {/* ── Main layout: content (No sidebar navbar as requested) ── */}
      <div className="tg-layout tg-layout-full" id="tech-guide-content">
        <div className="tg-content">
          {activeTab === "first-year" ? (
            <>
              {/* ── Section 1: Tools ── */}
              <section className="tg-section" id="tools">
                <div className="tg-reveal">
                  <SectionHead
                    label="Essential Tools & Platforms"
                    sub="Set these up in your first week, you'll use them every day"
                    badge="Week 1"
                  />
                </div>
                <div className="tg-vertical-stack tg-stagger-group">
                  {TOOLS.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </section>

              {/* ── Section 2: Paths ── */}
              <section className="tg-section" id="paths">
                <div className="tg-reveal">
                  <SectionHead
                    label="Understanding Different Paths"
                    sub="Three directions in tech, know the difference early"
                    badge="Choose Wisely"
                  />
                </div>
                <div className="tg-vertical-stack tg-stagger-group" style={{ marginBottom: 24 }}>
                  {PATHS.map((path) => (
                    <PathCard key={path.id} path={path} />
                  ))}
                </div>
                <div className="tg-reveal">
                  <Callout icon="💡">
                    Start with <strong>DSA</strong> to build a strong foundation, then move to{" "}
                    <strong>Development</strong> to build real projects.{" "}
                    <strong>Competitive Programming</strong> can be pursued alongside for interview
                    preparation and sharpening your problem-solving speed.
                  </Callout>
                </div>
              </section>

              {/* ── Section 3: Hackathons ── */}
              <section className="tg-section" id="hackathons">
                <div className="tg-reveal">
                  <SectionHead
                    label="Hackathons: The Game-Changer"
                    sub="Intense 24–48 hour builds that accelerate your growth like nothing else"
                    badge="Must-Try"
                  />
                  <p className="tg-copy">
                    Hackathons are where you meet your future teammates, learn technologies in hours,
                    win prizes, and build portfolio projects that actually stand out. Attend at least
                    one per semester.
                  </p>
                </div>
                <div className="tg-hack-grid tg-stagger-group">
                  {HACKATHON_STEPS.map((step) => (
                    <HackCard key={step.num} step={step} />
                  ))}
                </div>
                <div className="tg-reveal">
                  <Callout icon="🚀">
                    <strong>Startup × Tech:</strong> Hackathons generate ideas, coding skills fuel
                    MVPs, and MVPs attract investors. Many successful Indian startups started at a
                    hackathon. <strong>InnoThrone</strong>, <strong>Startup Mahakumbh</strong> and{" "}
                    <strong>TiECon</strong> are great events to network with founders and get
                    mentorship.
                  </Callout>
                </div>
              </section>

              {/* ── Section 4: Events ── */}
              <section className="tg-section" id="events">
                <div className="tg-reveal">
                  <SectionHead
                    label="Key Events to Participate In"
                    sub="Curated events across India worth putting on your calendar"
                    badge="Network"
                  />
                </div>
                <div className="tg-grid-3 tg-stagger-group">
                  {EVENTS.map((ev) => (
                    <EventCard key={ev.name} ev={ev} />
                  ))}
                </div>
              </section>
            </>
          ) : (
            <>
              {/* ── Placement Guide content (No placement guide heading, styled same as first year guide) ── */}
              <section className="tg-section" id="placement-guide">
                <div className="tg-reveal">
                  <SectionHead
                    label="Step-by-Step Placement Playbook"
                    sub="From building your first profile to cracking your first offer"
                    badge="Career Prep"
                  />
                </div>
                <div className="tg-vertical-stack tg-stagger-group">
                  {SKILL_TREE.map((step) => (
                    <PathCard key={step.id} path={step} />
                  ))}

                  {/* Final Placed card styled as tg-card */}
                  <motion.div
                    whileHover={{ y: -6, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    className="tg-card tg-accent-green"
                    style={{
                      "--card-glow": "rgba(34,197,94,0.15)",
                      "--card-color": "#22c55e",
                      background: "linear-gradient(135deg, rgba(34,197,94,0.06), rgba(79,142,247,0.04))",
                      borderColor: "rgba(34,197,94,0.3)"
                    }}
                  >
                    <div className="tg-card-icon-wrap" style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)" }}>
                      <Award size={16} style={{ color: "#22c55e" }} />
                    </div>
                    <div className="tg-card-head">
                      <div>
                        <span className="tg-card-tag" style={{ color: "#22c55e", borderColor: "rgba(34,197,94,0.2)" }}>/success</span>
                        <h3 className="tg-card-title">Placed!</h3>
                        <p className="tg-card-tagline">You've done the work. Now go get that offer.</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Section Head ── */
function SectionHead({ label, sub, badge }) {
  return (
    <div className="tg-section-head">
      {badge && <span className="tg-section-badge">{badge}</span>}
      <h2 className="tg-section-label">{label}</h2>
      <p className="tg-section-sub">{sub}</p>
    </div>
  );
}

/* ── Callout box ── */
function Callout({ icon, children }) {
  return (
    <div className="tg-callout">
      <span className="tg-callout-icon">{icon}</span>
      <p>{children}</p>
    </div>
  );
}

/* ── Tool Card ── */
function ToolCard({ tool }) {
  const Icon = tool.icon;
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={`tg-card ${tool.accent}`}
      style={{ "--card-glow": tool.glow, "--card-color": tool.color }}
    >
      {/* Icon badge */}
      <div className="tg-card-icon-wrap" style={{ background: tool.glow, border: `1px solid ${tool.color}33` }}>
        <Icon size={16} style={{ color: tool.color }} />
      </div>

      {/* header */}
      <div className="tg-card-head">
        <div>
          <span className="tg-card-tag">/{tool.tag}</span>
          <h3 className="tg-card-title">{tool.name}</h3>
          <p className="tg-card-tagline">{tool.tagline}</p>
        </div>
        <ArrowRight size={16} className="tg-card-arrow" />
      </div>

      {/* divider */}
      <div className="tg-card-divider" />

      {/* points checklist */}
      {tool.points && (
        <ul className="tg-checklist">
          {tool.points.map((p) => (
            <li key={p}>
              <CheckCircle2 size={12} className="tg-check-icon" />
              {p}
            </li>
          ))}
        </ul>
      )}

      {/* terminal for git */}
      {tool.commands && (
        <div className="tg-terminal">
          <div className="tg-terminal-bar">
            <span className="tg-dot tg-dot-red" />
            <span className="tg-dot tg-dot-yellow" />
            <span className="tg-dot tg-dot-green" />
            <span className="tg-terminal-title">bash: git essentials</span>
          </div>
          <div className="tg-terminal-body">
            {tool.commands.map((c) => (
              <div key={c.cmd} className="tg-cmd">
                <span className="tg-prompt">$</span>
                <span className="tg-cmd-name">{c.cmd}</span>
                <span className="tg-cmd-desc">// {c.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* platform chips */}
      {tool.platforms && (
        <div className="tg-chips">
          {tool.platforms.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="tg-chip"
              style={{ background: p.bg, borderColor: p.color + "44", color: p.color }}
            >
              <span className="tg-chip-name">{p.name}</span>
              <span className="tg-chip-goal">{p.goal}</span>
            </a>
          ))}
        </div>
      )}

      {/* footer */}
      <div className="tg-card-footer">
        <span>{tool.meta1}</span>
        <span className="tg-card-meta2">{tool.meta2}</span>
      </div>

      {/* links */}
      {tool.links && tool.links.length > 0 && (
        <div className="tg-card-links">
          {tool.links.map((l) => (
            <a
              key={l.label}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className={l.primary ? "tg-link-primary" : "tg-link-ghost"}
              style={l.primary ? { background: tool.color, color: "#000" } : { color: tool.color, borderColor: tool.color + "33" }}
            >
              {l.primary && <ExternalLink size={11} />}
              {l.label}
            </a>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ── Path Card (Also used for Placement Step Cards) ── */
function PathCard({ path }) {
  const Icon = path.icon;
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="tg-card"
      style={{
        "--card-glow": path.glow || "rgba(255,255,255,0.05)",
        "--card-color": path.color || "#fff"
      }}
    >
      <div className="tg-card-icon-wrap" style={{ background: path.glow || "rgba(255,255,255,0.05)", border: `1px solid ${path.color || "#fff"}33` }}>
        <Icon size={16} style={{ color: path.color }} />
      </div>
      <div className="tg-card-head">
        <div>
          <span className="tg-card-tag" style={{ color: path.color, borderColor: `${path.color}33` }}>/{path.tag}</span>
          <h3 className="tg-card-title">{path.title}</h3>
          <p className="tg-card-tagline">{path.desc}</p>
        </div>
        {path.badge && (
          <span className="tg-path-badge" style={{ background: path.color + "22", color: path.color }}>
            {path.badge}
          </span>
        )}
        {path.label && (
          <span className="tg-path-badge" style={{ background: path.color + "22", color: path.color }}>
            {path.label}
          </span>
        )}
      </div>
      <div className="tg-card-divider" />
      <ul className="tg-checklist">
        {(path.steps || path.points).map((s) => (
          <li key={s}>
            <CheckCircle2 size={12} className="tg-check-icon" style={{ color: path.color }} />
            {s}
          </li>
        ))}
      </ul>
      <div className="tg-card-footer">
        <span>{path.meta1 || "Step details"}</span>
        <span className="tg-card-meta2" style={{ color: path.color }}>{path.meta2 || "Guide"}</span>
      </div>

      {/* Action links if available (for placement step cards) */}
      {path.links && path.links.length > 0 && (
        <div className="tg-card-links" style={{ marginTop: 12 }}>
          {path.links.map((l) => (
            <a
              key={l.label}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className={l.primary ? "tg-link-primary" : "tg-link-ghost"}
              style={l.primary ? { background: path.color, color: "#000" } : { color: path.color, borderColor: `${path.color}33` }}
            >
              {l.primary && <ExternalLink size={11} />}
              {l.label}
            </a>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ── Hackathon step card ── */
function HackCard({ step }) {
  const Icon = step.icon;
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="tg-hack-card"
    >
      <div className="tg-hack-icon-row">
        <div className="tg-hack-num">{step.num}</div>
        <div className="tg-hack-icon-wrap">
          <Icon size={14} />
        </div>
      </div>
      <p className="tg-hack-title">{step.title}</p>
      <p className="tg-hack-desc">{step.desc}</p>
    </motion.div>
  );
}

/* ── Event card ── */
function EventCard({ ev }) {
  const Icon = ev.icon;
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="tg-event-card"
      style={{ "--ev-color": ev.color }}
    >
      <div className="tg-event-icon-wrap" style={{ background: ev.color + "18", border: `1px solid ${ev.color}33` }}>
        <Icon size={15} style={{ color: ev.color }} />
      </div>
      <div className="tg-event-body">
        <span className="tg-card-tag tg-event-tag" style={{ color: ev.color }}>/{ev.tag}</span>
        <h3 className="tg-card-title">{ev.name}</h3>
        <p className="tg-card-tagline">{ev.desc}</p>
      </div>
      <div className="tg-event-footer">
        <span className="tg-event-meta">{ev.meta}</span>
        <ArrowRight size={14} className="tg-event-arrow" style={{ color: ev.color }} />
      </div>
    </motion.div>
  );
}
