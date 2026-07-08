import { useState, useEffect, useMemo, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { uploadResume, getResumeUrl, deleteResume } from "../services/storageService";
import { updateProfile } from "../services/ProfileService";
import { signOut } from "../services/auth";
import { Link, useNavigate } from "react-router-dom";

// POTD and Discussion Services
import { getPOTD } from "../services/problemService";
import { getMySubmissions } from "../services/submissionService";
import { addComment, getComments, deleteComment } from "../services/commentService";
import { supabase } from "../lib/supabase.js";
import "./DashboardPOTD.css";

// Deterministic fallback ID based on date for daily chat
function getDailyFallbackId() {
  const dateStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const parts = dateStr.split("-");
  const year = parseInt(parts[0]).toString(16).padStart(8, '0');
  const month = parseInt(parts[1]).toString(16).padStart(4, '0');
  const day = parseInt(parts[2]).toString(16).padStart(12, '0');
  return `${year}-0000-${month}-0000-${day}`;
}

function getDifficultyClass(difficulty) {
  const level = (difficulty || "").toLowerCase();
  if (level === "easy") return "easy";
  if (level === "hard") return "hard";
  return "medium";
}

function formatRelativeCountdown(targetDateString) {
  if (!targetDateString) return "N/A";
  const next = new Date(`${targetDateString}T23:59:59`);
  const now = new Date();
  const diff = next.getTime() - now.getTime();
  if (diff <= 0) return "Refreshing soon";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m remaining`;
}

function getInitials(name) {
  if (!name || typeof name !== "string") return "U";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() || "").join("") || "U";
}

function formatDuration(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return "N/A";
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
}

function computeStreak(dates) {
  if (!dates || dates.length === 0) return 0;
  const unique = Array.from(new Set(dates)).sort((a, b) => new Date(b) - new Date(a));
  const daySet = new Set(unique);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const todayKey = today.toISOString().split("T")[0];
  const yesterdayKey = yesterday.toISOString().split("T")[0];
  
  if (!daySet.has(todayKey) && !daySet.has(yesterdayKey)) {
    return 0;
  }
  
  let streak = 0;
  const cursor = daySet.has(todayKey) ? today : yesterday;
  
  while (true) {
    const key = cursor.toISOString().split("T")[0];
    if (!daySet.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function getPlatformClass(urlOrPlatform) {
  const str = (urlOrPlatform || "").toLowerCase();
  if (str.includes("leetcode") || str === "leetcode") return "leetcode";
  if (str.includes("codeforces") || str === "codeforces") return "codeforces";
  if (str.includes("codechef") || str === "codechef") return "codechef";
  return "other";
}

function getPlatformName(urlOrPlatform) {
  const str = (urlOrPlatform || "").toLowerCase();
  if (str.includes("leetcode") || str === "leetcode") return "LeetCode";
  if (str.includes("codeforces") || str === "codeforces") return "Codeforces";
  if (str.includes("codechef") || str === "codechef") return "CodeChef";
  return "General CP";
}

function parseMessageContent(content) {
  if (!content) return { isReply: false, replyTo: "", text: "" };
  const match = content.match(/^↳\s*@(\S+)\s*(.*)/s);
  if (match) {
    return { isReply: true, replyTo: match[1], text: match[2] };
  }
  return { isReply: false, replyTo: "", text: content };
}

function renderBadgesList(badges) {
  if (!badges || badges.length === 0) return null;
  return (
    <div className="potd-badge-list">
      {badges.map((badge) => {
        let label = "";
        let icon = "";
        let className = "";
        switch (badge) {
          case "first_blood":
            label = "First Blood";
            icon = "⚡";
            className = "badge-first-blood";
            break;
          case "streak_7":
            label = "7-Day Streak";
            icon = "🔥";
            className = "badge-streak-7";
            break;
          case "streak_30":
            label = "30-Day Streak";
            icon = "🔥";
            className = "badge-streak-30";
            break;
          case "streak_100":
            label = "100-Day Streak";
            icon = "🔥";
            className = "badge-streak-100";
            break;
          case "problem_master":
            label = "Problem Master";
            icon = "🧠";
            className = "badge-master";
            break;
          case "top_solver":
            label = "Top Solver";
            icon = "🏆";
            className = "badge-top";
            break;
          default:
            return null;
        }
        return (
          <span key={badge} className={`potd-achievement-badge ${className}`} title={label}>
            {icon} {label}
          </span>
        );
      })}
    </div>
  );
}

export default function Dashboard() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  
  // Dashboard Sub-navigation tabs: 'profile' or 'potd'
  const [activeSection, setActiveSection] = useState("profile");
  
  // Profile settings state
  const [uploading, setUploading] = useState(false);
  const [resumeSignedUrl, setResumeSignedUrl] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [collegeId, setCollegeId] = useState("");
  const [branch, setBranch] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [codeforcesHandle, setCodeforcesHandle] = useState("");
  const [leetcodeHandle, setLeetcodeHandle] = useState("");
  const [codechefHandle, setCodechefHandle] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  
  // Daily POTD & Discussion state
  const [potd, setPotd] = useState(null);
  const [loadingPOTD, setLoadingPOTD] = useState(true);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [potdLeaderboard, setPotdLeaderboard] = useState([]);
  const [todayRanking, setTodayRanking] = useState([]);
  const [loadingPotdLeaderboard, setLoadingPotdLeaderboard] = useState(true);
  const [loadingTodayRanking, setLoadingTodayRanking] = useState(true);
  const [replyTarget, setReplyTarget] = useState(null);
  const chatEndRef = useRef(null);
  const chatInputRef = useRef(null);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [timeRemaining, setTimeRemaining] = useState("");

  // Sync state with profile once loaded
  useEffect(() => {
    if (profile) {
      setCollegeId(profile.college_id || "");
      setBranch(profile.branch || "");
      setGithubUrl(profile.github_url || "");
      setLinkedinUrl(profile.linkedin_url || "");
      setSkillsText(profile.skills ? profile.skills.join(", ") : "");
      setCodeforcesHandle(profile.codeforces_handle || "");
      setLeetcodeHandle(profile.leetcode_handle || "");
      setCodechefHandle(profile.codechef_handle || "");
      setIsPublic(profile.is_public !== false); // Defaults to true
      
      if (profile.resume_url) {
        loadResumeUrl(profile.resume_url);
      } else {
        setResumeSignedUrl("");
      }
    }
  }, [profile]);

  // Load POTD Details & Submissions when active tab becomes 'potd'
  useEffect(() => {
    if (activeSection === "potd") {
      loadPOTDDetails();
      loadPotdLeaderboard();
    }
  }, [activeSection, user]);

  useEffect(() => {
    if (activeSection === "potd" && potd?.id) {
      loadTodayRanking(potd);
    }
  }, [activeSection, potd?.id]);

  // Realtime Comments Listener for POTD / Daily Discussion
  useEffect(() => {
    const targetId = potd ? potd.id : getDailyFallbackId();

    // Listen to changes on public.comments for this target ID
    const channel = supabase
      .channel(`comments:${targetId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `target_id=eq.${targetId}`,
        },
        async () => {
          // Re-fetch comments to fetch authors profile joins
          await loadComments(targetId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [potd, activeSection]);

  // Countdown Timer Effect
  useEffect(() => {
    if (activeSection !== "potd") return;
    const updateTime = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diffMs = midnight - now;
      if (diffMs <= 0) {
        setTimeRemaining("0h 0m remaining");
        return;
      }
      const hours = Math.floor(diffMs / 3600000);
      const minutes = Math.floor((diffMs % 3600000) / 60000);
      setTimeRemaining(`${hours}h ${minutes}m remaining`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [activeSection]);

  // Real-time Submissions Listener for live updates across all users
  useEffect(() => {
    if (activeSection !== "potd") return undefined;
    const channel = supabase
      .channel("submissions-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "submissions",
        },
        async () => {
          if (potd) {
            await loadTodayRanking(potd);
          }
          await loadPotdLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeSection, potd]);

  useEffect(() => {
    if (activeSection === "potd") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments, activeSection]);

  async function loadPOTDDetails() {
    try {
      setLoadingPOTD(true);
      setSuccessMsg("");
      setErrorMsg("");
      const problem = await getPOTD();
      setPotd(problem);
      
      const targetId = problem ? problem.id : getDailyFallbackId();
      await Promise.all([
        loadComments(targetId),
        problem ? loadUserSubmissions() : Promise.resolve()
      ]);
    } catch (err) {
      console.error("Error loading POTD details:", err.message);
    } finally {
      setLoadingPOTD(false);
    }
  }

  async function loadComments(targetId) {
    try {
      const data = await getComments(targetId);
      setComments(data || []);
    } catch (err) {
      console.error("Error loading comments:", err.message);
    }
  }

  async function loadUserSubmissions() {
    if (!user) return;
    try {
      const data = await getMySubmissions(user.id);
      setMySubmissions(data || []);
    } catch (err) {
      console.error("Error loading submissions:", err.message);
    }
  }

  async function loadPotdLeaderboard() {
    try {
      setLoadingPotdLeaderboard(true);
      const response = await fetch("http://localhost:5000/api/potd/leaderboard-live");
      if (!response.ok) throw new Error("Failed to fetch live POTD leaderboard");
      const data = await response.json();
      const validRows = (data || [])
        .filter((user) => {
          const hasName = typeof user?.name === "string" && user.name.trim().length > 0;
          const hasCf = typeof user?.handle_cf === "string" && user.handle_cf.trim().length > 0;
          const hasLc = typeof user?.handle_lc === "string" && user.handle_lc.trim().length > 0;
          return hasName || hasCf || hasLc;
        });
      setPotdLeaderboard(validRows);
    } catch (err) {
      console.error("Error loading POTD leaderboard:", err.message);
      setPotdLeaderboard([]);
    } finally {
      setLoadingPotdLeaderboard(false);
    }
  }

  async function loadTodayRanking(problem) {
    if (!problem?.id) return;
    try {
      setLoadingTodayRanking(true);
      const response = await fetch(`http://localhost:5000/api/potd/today-ranking?problemId=${encodeURIComponent(problem.id)}`);
      if (!response.ok) throw new Error("Failed to fetch today's ranking");
      const data = await response.json();

      const rankingRows = (data || []).map((row) => {
        const solvedAt = row.submission_time || row.created_at;
        const durationMs = solvedAt && problem.posted_at
          ? new Date(solvedAt).getTime() - new Date(problem.posted_at).getTime()
          : NaN;
        return {
          user_id: row.user_id,
          name: row.name || "Anonymous coder",
          codeforces_handle: row.codeforces_handle || "",
          leetcode_handle: row.leetcode_handle || "",
          solvedAt,
          durationMs,
        };
      });

      setTodayRanking(rankingRows);
    } catch (err) {
      console.error("Error loading today's ranking:", err.message);
      setTodayRanking([]);
    } finally {
      setLoadingTodayRanking(false);
    }
  }

  async function loadResumeUrl(path) {
    try {
      const url = await getResumeUrl(path);
      setResumeSignedUrl(url);
    } catch (err) {
      console.error("Error loading resume signed URL:", err.message);
    }
  }

  async function handleLogout() {
    await signOut();
    navigate("/");
  }

  async function handleUpdateProfile(e) {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    // Validate College ID is provided (required for year-based leaderboard)
    if (!collegeId.trim()) {
      setErrorMsg("College ID is required.");
      return;
    }

    setUpdatingProfile(true);

    try {
      const skillsArray = skillsText
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      await updateProfile(user.id, {
        college_id: collegeId.trim(),
        branch: branch.trim(),
        github_url: githubUrl.trim(),
        linkedin_url: linkedinUrl.trim(),
        skills: skillsArray,
        codeforces_handle: codeforcesHandle.trim() || null,
        leetcode_handle: leetcodeHandle.trim() || null,
        codechef_handle: codechefHandle.trim() || null,
        is_public: true,
      });

      setSuccessMsg("Profile details updated successfully!");
      if (refreshProfile) await refreshProfile();
    } catch (err) {
      setErrorMsg("Failed to update profile: " + err.message);
    } finally {
      setUpdatingProfile(false);
    }
  }

  async function handleResumeUpload(e) {
    setSuccessMsg("");
    setErrorMsg("");

    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    if (file.type !== "application/pdf") {
      setErrorMsg("Only PDF formats are supported for resumes.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg("Resume file size must be less than 2MB.");
      return;
    }

    setUploading(true);

    try {
      if (profile?.resume_url) {
        try {
          await deleteResume(profile.resume_url);
        } catch (delErr) {
          console.warn("Could not delete old resume file:", delErr.message);
        }
      }

      const uploadedPath = await uploadResume(user.id, file);

      await updateProfile(user.id, {
        resume_url: uploadedPath,
      });

      setSuccessMsg("Resume uploaded and linked to profile successfully!");
      if (refreshProfile) await refreshProfile();
    } catch (err) {
      setErrorMsg("Resume upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteResume() {
    if (!window.confirm("Are you sure you want to remove your resume?")) return;
    setSuccessMsg("");
    setErrorMsg("");
    setUploading(true);

    try {
      if (profile?.resume_url) {
        await deleteResume(profile.resume_url);
      }

      await updateProfile(user.id, {
        resume_url: null,
      });

      setResumeSignedUrl("");
      setSuccessMsg("Resume removed successfully.");
      if (refreshProfile) await refreshProfile();
    } catch (err) {
      setErrorMsg("Failed to remove resume: " + err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleAddComment(e) {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    setAddingComment(true);
    setSuccessMsg("");
    setErrorMsg("");

    const targetId = potd ? potd.id : getDailyFallbackId();

    try {
      const activeReplyTarget = replyTarget;
      const content = activeReplyTarget
        ? `↳ @${activeReplyTarget.profiles?.name || "coder"} ${newCommentText.trim()}`
        : newCommentText.trim();
      await addComment(user.id, targetId, content);
      setNewCommentText("");
      setReplyTarget(null);
      await loadComments(targetId);
    } catch (err) {
      setErrorMsg("Failed to post comment: " + err.message);
    } finally {
      setAddingComment(false);
    }
  }

  async function handleDeleteComment(commentId) {
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await deleteComment(commentId);
      setSuccessMsg("Comment deleted successfully!");
      const targetId = potd ? potd.id : getDailyFallbackId();
      await loadComments(targetId);
    } catch (err) {
      setErrorMsg("Failed to delete comment: " + err.message);
    }
  }

  function handleReplySelect(comment) {
    setReplyTarget(comment);
    chatInputRef.current?.focus();
  }

  const potdTags = useMemo(() => {
    if (!potd?.description) return [];
    const tagLine = potd.description
      .split("\n")
      .find((line) => line.toLowerCase().startsWith("tags:"));
    if (tagLine) {
      return tagLine
        .replace(/tags:/i, "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
    }
    return [potd.platform || "General CP", potd.difficulty || "Medium"].filter(Boolean);
  }, [potd]);

  const overallLeaderboardTop = useMemo(() => {
    return potdLeaderboard.slice(0, 8);
  }, [potdLeaderboard]);

  const myBadges = useMemo(() => {
    if (!user || !potdLeaderboard) return [];
    const myLeaderboardRow = potdLeaderboard.find(row => row.id === user.id);
    return myLeaderboardRow ? myLeaderboardRow.badges || [] : [];
  }, [user, potdLeaderboard]);

  const parsedDesc = useMemo(() => {
    if (!potd || !potd.description) return { body: "", examples: "", constraints: "" };
    const desc = potd.description;
    
    let examplesIndex = desc.indexOf("Example");
    if (examplesIndex === -1) examplesIndex = desc.indexOf("example");
    
    let constraintsIndex = desc.indexOf("Constraint");
    if (constraintsIndex === -1) constraintsIndex = desc.indexOf("constraint");
    
    let body = desc;
    let examples = "";
    let constraints = "";
    
    if (examplesIndex !== -1 && constraintsIndex !== -1) {
      body = desc.slice(0, examplesIndex).trim();
      examples = desc.slice(examplesIndex, constraintsIndex).trim();
      constraints = desc.slice(constraintsIndex).trim();
    } else if (examplesIndex !== -1) {
      body = desc.slice(0, examplesIndex).trim();
      examples = desc.slice(examplesIndex).trim();
    } else if (constraintsIndex !== -1) {
      body = desc.slice(0, constraintsIndex).trim();
      constraints = desc.slice(constraintsIndex).trim();
    }
    
    return { body, examples, constraints };
  }, [potd]);

  const stats = useMemo(() => {
    const totalSolversToday = todayRanking.length;
    const durations = todayRanking
      .map((row) => row.durationMs)
      .filter((value) => Number.isFinite(value) && value > 0);
    const averageSolveMs = durations.length
      ? Math.round(durations.reduce((sum, item) => sum + item, 0) / durations.length)
      : NaN;
    const fastestSolveMs = durations.length ? Math.min(...durations) : NaN;
    const activeParticipants = comments.length;
    const solvedThisWeek = potdLeaderboard.reduce((sum, row) => sum + Math.min(7, Number(row.score || 0)), 0);
    return {
      totalSolversToday,
      averageSolveMs,
      fastestSolveMs,
      activeParticipants,
      solvedThisWeek,
    };
  }, [todayRanking, comments.length, potdLeaderboard]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
        <h3>Loading your developer profile...</h3>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 20px", textAlign: "left", maxWidth: "1000px", margin: "0 auto" }}>
      {/* Header section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid var(--border)", paddingBottom: "20px" }}>
        <div>
          <h1 style={{ fontSize: "32px", margin: "0 0 5px", letterSpacing: "-0.5px" }}>Developer Hub</h1>
          <p style={{ color: "var(--text)", fontSize: "14px" }}>Manage your student dashboard, view challenges, and join discussions</p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            background: "transparent",
            border: "1px solid var(--border)",
            color: "var(--text-h)",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          Sign Out
        </button>
      </div>

      {/* Sub-tabs menu */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "30px", borderBottom: "1px solid var(--border)" }}>
        <button
          onClick={() => { setActiveSection("profile"); setSuccessMsg(""); setErrorMsg(""); }}
          style={{
            padding: "10px 20px",
            background: "transparent",
            border: "none",
            borderBottom: activeSection === "profile" ? "2px solid var(--accent)" : "none",
            color: activeSection === "profile" ? "var(--accent)" : "var(--text)",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "600",
          }}
        >
          My Profile
        </button>
        <button
          onClick={() => { setActiveSection("potd"); setSuccessMsg(""); setErrorMsg(""); }}
          style={{
            padding: "10px 20px",
            background: "transparent",
            border: "none",
            borderBottom: activeSection === "potd" ? "2px solid var(--accent)" : "none",
            color: activeSection === "potd" ? "var(--accent)" : "var(--text)",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "600",
          }}
        >
          Problem of the Day (POTD)
        </button>
      </div>

      {/* Messages */}
      {successMsg && (
        <div style={{ padding: "12px", marginBottom: "20px", borderRadius: "6px", background: "var(--accent-bg)", color: "var(--accent)", border: "1px solid var(--accent-border)", fontSize: "14px" }}>
          ✅ {successMsg}
        </div>
      )}
      {errorMsg && (
        <div style={{ padding: "12px", marginBottom: "20px", borderRadius: "6px", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.3)", fontSize: "14px" }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {activeSection === "profile" ? (
        /* Profile section */
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
          {/* Profile form */}
          <div style={{ padding: "30px", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--code-bg)" }}>
            <h2 style={{ fontSize: "20px", marginBottom: "20px", borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>About You</h2>
            
            <div style={{ marginBottom: "15px" }}>
              <span style={{ display: "block", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "var(--text)" }}>Email Address</span>
              <span style={{ fontSize: "15px", fontWeight: "500", color: "var(--text-h)" }}>{user?.email}</span>
            </div>


            <form onSubmit={handleUpdateProfile}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "var(--text)", marginBottom: "6px" }}>
                  College ID <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2026BTCS001"
                  value={collegeId}
                  onChange={(e) => setCollegeId(e.target.value)}
                  required
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: `1px solid ${!collegeId.trim() ? "#ef4444" : "var(--border)"}`, background: "var(--bg)", color: "var(--text-h)" }}
                />
                <span style={{ fontSize: "11px", color: "var(--text)", marginTop: "4px", display: "block" }}>
                  Your college roll number starting with your batch year (e.g. 2026BTCS001). Used to determine your year on the leaderboard.
                </span>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "var(--text)", marginBottom: "6px" }}>Branch</label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-h)" }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "var(--text)", marginBottom: "6px" }}>GitHub Profile URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-h)" }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "var(--text)", marginBottom: "6px" }}>LinkedIn Profile URL</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-h)" }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "var(--text)", marginBottom: "6px" }}>Codeforces Handle</label>
                <input
                  type="text"
                  placeholder="Codeforces Username"
                  value={codeforcesHandle}
                  onChange={(e) => setCodeforcesHandle(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-h)" }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "var(--text)", marginBottom: "6px" }}>LeetCode Handle</label>
                <input
                  type="text"
                  placeholder="LeetCode Username"
                  value={leetcodeHandle}
                  onChange={(e) => setLeetcodeHandle(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-h)" }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "var(--text)", marginBottom: "6px" }}>CodeChef Handle</label>
                <input
                  type="text"
                  placeholder="CodeChef Username"
                  value={codechefHandle}
                  onChange={(e) => setCodechefHandle(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-h)" }}
                />
              </div>

              <div style={{ marginBottom: "25px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "var(--text)", marginBottom: "6px" }}>Skills (comma separated)</label>
                <input
                  type="text"
                  placeholder="React, Python, C++, SQL"
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-h)" }}
                />
              </div>


              <button
                type="submit"
                disabled={updatingProfile}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "6px",
                  border: "none",
                  background: "var(--accent)",
                  color: "#fff",
                  fontWeight: "600",
                  cursor: "pointer",
                  opacity: updatingProfile ? 0.7 : 1,
                }}
              >
                {updatingProfile ? "Saving changes..." : "Save Profile Details"}
              </button>
            </form>
          </div>

          {/* Resume Upload Card */}
          <div style={{ padding: "30px", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--code-bg)", display: "flex", flexDirection: "column", height: "fit-content" }}>
            <h2 style={{ fontSize: "20px", marginBottom: "20px", borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>Resume / CV</h2>
            <p style={{ fontSize: "14px", color: "var(--text)", marginBottom: "20px" }}>
              Upload your resume in PDF format.
            </p>

            {!profile?.resume_url && (
              <div
                style={{
                  border: "2px dashed var(--border)",
                  borderRadius: "8px",
                  padding: "30px 20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--bg)",
                  marginBottom: "20px",
                }}
              >
                {uploading ? (
                  <span style={{ fontSize: "15px", fontWeight: "600", color: "var(--accent)" }}>Uploading file, please wait...</span>
                ) : (
                  <>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="1.5" style={{ marginBottom: "15px" }}>
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleResumeUpload}
                      style={{ display: "none" }}
                      id="resume-file-input"
                    />
                    <label
                      htmlFor="resume-file-input"
                      style={{
                        padding: "10px 20px",
                        borderRadius: "6px",
                        background: "var(--accent-bg)",
                        color: "var(--accent)",
                        fontWeight: "600",
                        cursor: "pointer",
                        fontSize: "14px",
                        border: "1px solid var(--accent-border)",
                      }}
                    >
                      Choose PDF File
                    </label>
                    <span style={{ fontSize: "12px", color: "var(--text)", marginTop: "8px" }}>PDF formats only (Max 2MB)</span>
                  </>
                )}
              </div>
            )}

            {profile?.resume_url && (
              <div
                style={{
                  padding: "15px",
                  borderRadius: "8px",
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" style={{ marginRight: "10px" }}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-h)" }}>
                    {profile.resume_url.split('/').pop().replace(/_\d+\.pdf$/i, '.pdf')}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  {resumeSignedUrl ? (
                    <a
                      href={resumeSignedUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: "6px 12px",
                        borderRadius: "4px",
                        background: "var(--accent)",
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: "600",
                        textDecoration: "none",
                      }}
                    >
                      View
                    </a>
                  ) : (
                    <span style={{ fontSize: "12px", color: "var(--text)", padding: "6px 12px" }}>
                      Loading Link...
                    </span>
                  )}
                  
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeUpload}
                    style={{ display: "none" }}
                    id="resume-file-replace"
                  />
                  <label
                    htmlFor="resume-file-replace"
                    style={{
                      padding: "6px 12px",
                      borderRadius: "4px",
                      background: "transparent",
                      border: "1px solid var(--border)",
                      color: "var(--text)",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Replace
                  </label>
                  <button
                    onClick={handleDeleteResume}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "4px",
                      background: "rgba(239, 68, 68, 0.1)",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                      color: "#ef4444",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="potd-dashboard-container">
          {/* Header Row / Title */}
          <header className="potd-section-header">
            <div className="potd-header-left">
              <span className="potd-subtitle-badge">⚡ CP CHALLENGE</span>
              <h1 className="potd-title-main">Problem of the Day</h1>
              <p className="potd-description-sub">Elevate your skills daily. Compete with top university developers.</p>
            </div>
            
            <div className="potd-header-right">
              <div className="potd-countdown-widget">
                <span className="countdown-label">NEXT POTD RELEASE</span>
                <strong className="countdown-value">⏳ {timeRemaining}</strong>
              </div>
            </div>
          </header>

          {/* Core Dashboard Layout Grid */}
          <div className="potd-dashboard-layout">
            
            {/* Left Column: Challenge & Discussion */}
            <main className="potd-column-left">
              
              {/* Today's Problem Card */}
              <section className="potd-main-card">
                {loadingPOTD ? (
                  <div className="standings-skeleton">
                    <div className="skeleton-row" style={{ height: '30px', width: '50%' }} />
                    <div className="skeleton-row" style={{ height: '140px', marginTop: '15px' }} />
                  </div>
                ) : !potd ? (
                  <div className="potd-empty-state-modern">
                    <span style={{ fontSize: '32px' }}>🍵</span>
                    <h4 style={{ margin: '12px 0 6px' }}>Take a Break!</h4>
                    <p style={{ margin: 0, color: 'var(--text)' }}>No POTD has been published for today yet.</p>
                  </div>
                ) : (
                  <>
                    <div className="potd-card-header">
                      <div className="potd-card-title-wrap">
                        <span className="potd-date-pill">📅 {potd.date || "TBD"}</span>
                        <h2>{potd.title}</h2>
                      </div>
                      
                      <div className="potd-badges-row">
                        <span className={`potd-badge-difficulty ${getDifficultyClass(potd.difficulty)}`}>
                          {potd.difficulty || "Medium"}
                        </span>
                        <span className={`potd-badge-platform ${getPlatformClass(potd.solution || potd.platform)}`}>
                          {getPlatformName(potd.solution || potd.platform)}
                        </span>
                        <span className="potd-badge-solvers">
                          👥 {stats.totalSolversToday} Solved
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    {potdTags.length > 0 && (
                      <div className="potd-tags-container">
                        {potdTags.map(tag => (
                          <span key={tag} className="potd-tag-item">#{tag}</span>
                        ))}
                      </div>
                    )}

                    <div className="potd-card-body">
                      {/* Description Section */}
                      <div className="potd-desc-section">
                        <h3>Problem Description</h3>
                        <p className="problem-text">{parsedDesc.body}</p>
                      </div>

                      {/* Example Test Cases Section */}
                      {parsedDesc.examples && (
                        <div className="potd-desc-section">
                          <h3>Example Test Cases</h3>
                          <pre className="code-block">{parsedDesc.examples}</pre>
                        </div>
                      )}

                      {/* Constraints Section */}
                      {parsedDesc.constraints && (
                        <div className="potd-desc-section">
                          <h3>Constraints</h3>
                          <pre className="code-block">{parsedDesc.constraints}</pre>
                        </div>
                      )}
                    </div>

                    <div className="potd-card-actions">
                      <a href={potd.solution || "#"} target="_blank" rel="noreferrer" className="potd-action-btn primary">
                        Solve Problem
                      </a>
                      <a href={potd.solution || "#"} target="_blank" rel="noreferrer" className="potd-action-btn secondary">
                        View Original Problem
                      </a>
                    </div>
                  </>
                )}
              </section>

              {/* Discord-style Discussion Chat */}
              <section className="potd-chat-container">
                <header className="chat-header">
                  <div className="chat-title-wrap">
                    <h3>💬 Daily Dev Chat</h3>
                    <p>Discuss approaches, hints, and complexity. No direct code sharing!</p>
                  </div>
                  <span className="chat-count-pill">{comments.length} messages</span>
                </header>

                <div className="chat-feed-viewport">
                  {comments.length === 0 ? (
                    <div className="chat-empty-state">
                      <span className="chat-empty-icon">💬</span>
                      <p>No ideas shared yet. Be the first to start the discussion!</p>
                    </div>
                  ) : (
                    comments.map((cmt) => {
                      const isOwner = cmt.user_id === user?.id;
                      const isAdmin = cmt.profiles?.role === "admin" || cmt.profiles?.role === "super_admin";
                      const hasSolvedToday = todayRanking.some(row => row.user_id === cmt.user_id);
                      const parsed = parseMessageContent(cmt.content);
                      
                      return (
                        <div key={cmt.id} className={`chat-message-item ${isOwner ? "message-owner" : ""}`}>
                          <div className="chat-avatar">{getInitials(cmt.profiles?.name)}</div>
                          
                          <div className="chat-message-bubble">
                            {/* Curved reply indicator */}
                            {parsed.isReply && (
                              <div className="chat-reply-indicator">
                                <span className="reply-arrow">↳</span>
                                <span className="reply-text">Replying to <strong>@{parsed.replyTo}</strong></span>
                              </div>
                            )}

                            <div className="chat-message-meta">
                              <span className="chat-author-name">{cmt.profiles?.name || "Anonymous coder"}</span>
                              
                              <div className="chat-meta-badges">
                                {isAdmin && <span className="chat-badge role-admin">Admin</span>}
                                {hasSolvedToday && <span className="chat-badge role-solved">✅ Solved</span>}
                              </div>

                              <span className="chat-timestamp">
                                {new Date(cmt.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>

                            <p className="chat-text">{parsed.text}</p>
                            
                            <div className="chat-actions-row">
                              <button type="button" className="chat-btn-reply" onClick={() => handleReplySelect(cmt)}>Reply</button>
                              {(isOwner || profile?.role === "admin" || profile?.role === "super_admin") && (
                                <button type="button" className="chat-btn-delete" onClick={() => handleDeleteComment(cmt.id)}>Delete</button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={chatEndRef} />
                </div>

                {replyTarget && (
                  <div className="chat-reply-target-composer">
                    <span>Replying to <strong>{replyTarget.profiles?.name || "Anonymous coder"}</strong></span>
                    <button type="button" className="btn-cancel-reply" onClick={() => setReplyTarget(null)}>Cancel</button>
                  </div>
                )}

                <form onSubmit={handleAddComment} className="chat-composer-form">
                  <input
                    ref={chatInputRef}
                    type="text"
                    placeholder={replyTarget ? `Reply to ${replyTarget.profiles?.name || "coder"}...` : "Share your approach, complexity notes, or hints..."}
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    required
                    disabled={addingComment}
                  />
                  <button type="submit" className="chat-send-btn" disabled={addingComment || !newCommentText.trim()}>
                    {addingComment ? "Sending..." : "Send"}
                  </button>
                </form>
              </section>

            </main>

            {/* Right Column: Standings & Stats */}
            <aside className="potd-column-right">
              
              {/* Stats / Achievement Widget */}
              <section className="potd-side-panel gamify-panel">
                <div className="gamify-user-card">
                  <div className="gamify-header">
                    <h4>🔥 Daily Streak</h4>
                    <span className="streak-value">
                      {computeStreak(mySubmissions.filter((entry) => entry.status === "Correct").map((entry) => entry.problems?.date).filter(Boolean))} Days
                    </span>
                  </div>
                  <p className="gamify-sub">Solve problems daily to protect and increase your streak!</p>
                </div>

                {/* Achieved Badges */}
                <div className="user-achievements-row">
                  <h5>Your Unlocked Badges</h5>
                  {renderBadgesList(myBadges)}
                </div>
              </section>

              {/* Today's Problem Ranking (Live) */}
              <section className="potd-side-panel standings-panel">
                <header className="panel-header">
                  <div className="panel-title-wrap">
                    <h3>🏆 Today's Solvers</h3>
                    <span className="live-pulse">LIVE</span>
                  </div>
                </header>

                <div className="standings-table-wrap scrollable">
                  {loadingTodayRanking ? (
                    <div className="standings-skeleton">
                      <div className="skeleton-row" />
                      <div className="skeleton-row" />
                    </div>
                  ) : todayRanking.length === 0 ? (
                    <div className="standings-empty-state">
                      <span className="badge-medal">🥇</span>
                      <p className="empty-copy">No accepted submissions yet. Be the first to earn the <strong>First Blood</strong> badge!</p>
                    </div>
                  ) : (
                    <table className="potd-custom-table">
                      <thead>
                        <tr>
                          <th>Rank</th>
                          <th>Developer</th>
                          <th>Platform Handles</th>
                          <th>Solved At</th>
                          <th>Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {todayRanking.map((row, index) => {
                          const isGold = index === 0;
                          const isSilver = index === 1;
                          const isBronze = index === 2;
                          const medalClass = isGold ? "rank-gold" : isSilver ? "rank-silver" : isBronze ? "rank-bronze" : "";
                          const medalIcon = isGold ? "🥇" : isSilver ? "🥈" : isBronze ? "🥉" : `#${index + 1}`;
                          
                          return (
                            <tr key={`${row.name}-${row.solvedAt}`} className={medalClass}>
                              <td className="rank-cell">
                                <span className={`medal-pill ${medalClass}`}>{medalIcon}</span>
                              </td>
                              <td className="name-cell">
                                <strong>{row.name}</strong>
                              </td>
                              <td className="handles-cell">
                                <div className="handles-stack">
                                  {row.codeforces_handle && (
                                    <a href={`https://codeforces.com/profile/${row.codeforces_handle}`} target="_blank" rel="noreferrer" className="handle-link cf">
                                      CF: @{row.codeforces_handle}
                                    </a>
                                  )}
                                  {row.leetcode_handle && (
                                    <a href={`https://leetcode.com/${row.leetcode_handle}`} target="_blank" rel="noreferrer" className="handle-link lc">
                                      LC: @{row.leetcode_handle}
                                    </a>
                                  )}
                                </div>
                              </td>
                              <td className="time-cell">
                                {row.solvedAt ? new Date(row.solvedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "N/A"}
                              </td>
                              <td className="duration-cell">
                                {formatDuration(row.durationMs)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </section>

              {/* Overall POTD Leaderboard */}
              <section className="potd-side-panel standings-panel">
                <header className="panel-header">
                  <div className="panel-title-wrap">
                    <h3>📈 Overall POTD Leaderboard</h3>
                    <Link to="/potd-leaderboard" className="panel-link-open">View All</Link>
                  </div>
                </header>

                <div className="standings-table-wrap">
                  {loadingPotdLeaderboard ? (
                    <div className="standings-skeleton">
                      <div className="skeleton-row" />
                      <div className="skeleton-row" />
                    </div>
                  ) : (
                    <table className="potd-custom-table compact">
                      <thead>
                        <tr>
                          <th>Rank</th>
                          <th>Developer</th>
                          <th>Score</th>
                          <th>Streak</th>
                        </tr>
                      </thead>
                      <tbody>
                        {overallLeaderboardTop.map((row, index) => {
                          const isGold = index === 0;
                          const isSilver = index === 1;
                          const isBronze = index === 2;
                          const medalClass = isGold ? "rank-gold" : isSilver ? "rank-silver" : isBronze ? "rank-bronze" : "";
                          const medalIcon = isGold ? "🥇" : isSilver ? "🥈" : isBronze ? "🥉" : `#${index + 1}`;
                          
                          return (
                            <tr key={`${row.name}-${index}`} className={medalClass}>
                              <td className="rank-cell">
                                <span className={`medal-pill ${medalClass}`}>{medalIcon}</span>
                              </td>
                              <td className="name-cell flex-cell">
                                <strong>{row.name || "Anonymous"}</strong>
                                {renderBadgesList(row.badges?.slice(0, 2))}
                              </td>
                              <td className="score-cell">
                                <span className="potd-score-badge-compact">{row.score || 0} pts</span>
                              </td>
                              <td>🔥 {row.streak}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </section>

              {/* Statistics Panel */}
              <section className="potd-side-panel stats-panel">
                <header className="panel-header">
                  <h3>📊 Today's Stats</h3>
                </header>
                <div className="stats-box-grid">
                  <div className="stats-box-item">
                    <span>Total Solvers Today</span>
                    <strong>{stats.totalSolversToday}</strong>
                  </div>
                  <div className="stats-box-item">
                    <span>Fastest Solve Time</span>
                    <strong>{formatDuration(stats.fastestSolveMs)}</strong>
                  </div>
                  <div className="stats-box-item">
                    <span>Average Solve Time</span>
                    <strong>{formatDuration(stats.averageSolveMs)}</strong>
                  </div>
                  <div className="stats-box-item">
                    <span>Active Chat Users</span>
                    <strong>{stats.activeParticipants}</strong>
                  </div>
                  <div className="stats-box-item full-width">
                    <span>Total Solves (This Week)</span>
                    <strong>{stats.solvedThisWeek}</strong>
                  </div>
                </div>
              </section>

            </aside>
          </div>
        </div>
      )}

      {profile?.role === "admin" && (
        <div style={{ marginTop: "40px", borderTop: "1px solid var(--border)", paddingTop: "25px", textAlign: "center" }}>
          <button
            onClick={() => navigate("/admin")}
            style={{
              padding: "12px 24px",
              borderRadius: "6px",
              background: "var(--accent-bg)",
              color: "var(--accent)",
              border: "1px solid var(--accent-border)",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Go to Admin Panel
          </button>
        </div>
      )}
    </div>
  );
}