import { useState, useEffect, useMemo, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { getPOTD } from "../services/problemService";
import { getMySubmissions } from "../services/submissionService";
import { addComment, getComments, deleteComment } from "../services/commentService";
import { supabase } from "../lib/supabase.js";
import { Link, useNavigate } from "react-router-dom";
import "./DashboardPOTD.css";

// Deterministic fallback ID based on date for daily chat
function getDailyFallbackId() {
  const dateStr = new Date().toISOString().split("T")[0];
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
  if (!daySet.has(todayKey) && !daySet.has(yesterdayKey)) return 0;
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
  return "other";
}

function getPlatformName(urlOrPlatform) {
  const str = (urlOrPlatform || "").toLowerCase();
  if (str.includes("leetcode") || str === "leetcode") return "LeetCode";
  if (str.includes("codeforces") || str === "codeforces") return "Codeforces";
  return "General CP";
}

function parseMessageContent(content) {
  if (!content) return { isReply: false, replyTo: "", text: "" };
  const match = content.match(/^↳\s*@(\S+)\s*(.*)/s);
  if (match) return { isReply: true, replyTo: match[1], text: match[2] };
  return { isReply: false, replyTo: "", text: content };
}

function renderBadgesList(badges) {
  if (!badges || badges.length === 0) return null;
  return (
    <div className="potd-badge-list">
      {badges.map((badge) => {
        let label = "", icon = "", className = "";
        switch (badge) {
          case "first_blood": label = "First Blood"; icon = "⚡"; className = "badge-first-blood"; break;
          case "streak_7": label = "7-Day Streak"; icon = "🔥"; className = "badge-streak-7"; break;
          case "streak_30": label = "30-Day Streak"; icon = "🔥"; className = "badge-streak-30"; break;
          case "streak_100": label = "100-Day Streak"; icon = "🔥"; className = "badge-streak-100"; break;
          case "problem_master": label = "Problem Master"; icon = "🧠"; className = "badge-master"; break;
          case "top_solver": label = "Top Solver"; icon = "🏆"; className = "badge-top"; break;
          default: return null;
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

export default function POTD() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

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
  const [timeRemaining, setTimeRemaining] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const chatEndRef = useRef(null);
  const chatInputRef = useRef(null);

  useEffect(() => {
    loadPOTDDetails();
    loadPotdLeaderboard();
  }, [user]);

  useEffect(() => {
    if (potd?.id) loadTodayRanking(potd);
  }, [potd?.id]);

  // Realtime comments listener
  useEffect(() => {
    const targetId = potd ? potd.id : getDailyFallbackId();
    const channel = supabase
      .channel(`comments:${targetId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "comments", filter: `target_id=eq.${targetId}` },
        async () => { await loadComments(targetId); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [potd]);

  // Countdown timer
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diffMs = midnight - now;
      const hours = Math.floor(diffMs / 3600000);
      const minutes = Math.floor((diffMs % 3600000) / 60000);
      setTimeRemaining(`${hours}h ${minutes}m remaining`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Realtime submissions listener
  useEffect(() => {
    const channel = supabase
      .channel("submissions-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "submissions" },
        async () => {
          if (potd) await loadTodayRanking(potd);
          await loadPotdLeaderboard();
        })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [potd]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  async function loadPOTDDetails() {
    try {
      setLoadingPOTD(true);
      const problem = await getPOTD();
      setPotd(problem);
      const targetId = problem ? problem.id : getDailyFallbackId();
      await Promise.all([loadComments(targetId), problem ? loadUserSubmissions() : Promise.resolve()]);
    } catch (err) {
      console.error("Error loading POTD:", err.message);
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
      const response = await fetch("http://localhost:5001/api/potd/leaderboard-live");
      if (!response.ok) throw new Error("Failed to fetch POTD leaderboard");
      const data = await response.json();
      const validRows = (data || []).filter((u) => {
        const hasName = typeof u?.name === "string" && u.name.trim().length > 0;
        const hasCf = typeof u?.handle_cf === "string" && u.handle_cf.trim().length > 0;
        const hasLc = typeof u?.handle_lc === "string" && u.handle_lc.trim().length > 0;
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
      const response = await fetch(`http://localhost:5001/api/potd/today-ranking?problemId=${encodeURIComponent(problem.id)}`);
      if (!response.ok) throw new Error("Failed to fetch today's ranking");
      const data = await response.json();
      const rankingRows = (data || []).map((row) => {
        const solvedAt = row.submission_time || row.created_at;
        const durationMs = solvedAt && problem.posted_at
          ? new Date(solvedAt).getTime() - new Date(problem.posted_at).getTime()
          : NaN;
        return { user_id: row.user_id, name: row.name || "Anonymous coder", codeforces_handle: row.codeforces_handle || "", leetcode_handle: row.leetcode_handle || "", solvedAt, durationMs };
      });
      setTodayRanking(rankingRows);
    } catch (err) {
      console.error("Error loading today's ranking:", err.message);
      setTodayRanking([]);
    } finally {
      setLoadingTodayRanking(false);
    }
  }

  async function handleAddComment(e) {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    setAddingComment(true);
    setErrorMsg("");
    const targetId = potd ? potd.id : getDailyFallbackId();
    try {
      const content = replyTarget
        ? `↳ @${replyTarget.profiles?.name || "coder"} ${newCommentText.trim()}`
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
    try {
      await deleteComment(commentId);
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
    const tagLine = potd.description.split("\n").find((line) => line.toLowerCase().startsWith("tags:"));
    if (tagLine) return tagLine.replace(/tags:/i, "").split(",").map((tag) => tag.trim()).filter(Boolean);
    return [potd.platform || "General CP", potd.difficulty || "Medium"].filter(Boolean);
  }, [potd]);

  const overallLeaderboardTop = useMemo(() => potdLeaderboard.slice(0, 8), [potdLeaderboard]);

  const myBadges = useMemo(() => {
    if (!user || !potdLeaderboard) return [];
    const myRow = potdLeaderboard.find((row) => row.id === user.id);
    return myRow ? myRow.badges || [] : [];
  }, [user, potdLeaderboard]);

  const parsedDesc = useMemo(() => {
    if (!potd?.description) return { body: "", examples: "", constraints: "" };
    const desc = potd.description;
    let examplesIndex = desc.indexOf("Example");
    if (examplesIndex === -1) examplesIndex = desc.indexOf("example");
    let constraintsIndex = desc.indexOf("Constraint");
    if (constraintsIndex === -1) constraintsIndex = desc.indexOf("constraint");
    let body = desc, examples = "", constraints = "";
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
    const durations = todayRanking.map((row) => row.durationMs).filter((v) => Number.isFinite(v) && v > 0);
    const averageSolveMs = durations.length ? Math.round(durations.reduce((s, i) => s + i, 0) / durations.length) : NaN;
    const fastestSolveMs = durations.length ? Math.min(...durations) : NaN;
    const activeParticipants = comments.length;
    const solvedThisWeek = potdLeaderboard.reduce((sum, row) => sum + Math.min(7, Number(row.score || 0)), 0);
    return { totalSolversToday, averageSolveMs, fastestSolveMs, activeParticipants, solvedThisWeek };
  }, [todayRanking, comments.length, potdLeaderboard]);

  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}><h3>Loading...</h3></div>;
  }

  return (
    <div className="potd-dashboard-container">
      {/* Header Row */}
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

      {errorMsg && (
        <div style={{ padding: "12px", marginBottom: "16px", borderRadius: "6px", background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)", fontSize: "14px" }}>
          ⚠️ {errorMsg}
        </div>
      )}

      <div className="potd-dashboard-layout">
        {/* Left Column */}
        <main className="potd-column-left">
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
                    <span className={`potd-badge-difficulty ${getDifficultyClass(potd.difficulty)}`}>{potd.difficulty || "Medium"}</span>
                    <span className={`potd-badge-platform ${getPlatformClass(potd.solution || potd.platform)}`}>{getPlatformName(potd.solution || potd.platform)}</span>
                    <span className="potd-badge-solvers">👥 {stats.totalSolversToday} Solved</span>
                  </div>
                </div>
                {potdTags.length > 0 && (
                  <div className="potd-tags-container">
                    {potdTags.map((tag) => <span key={tag} className="potd-tag-item">#{tag}</span>)}
                  </div>
                )}
                <div className="potd-card-body">
                  <div className="potd-desc-section">
                    <h3>Problem Description</h3>
                    <p className="problem-text">{parsedDesc.body}</p>
                  </div>
                  {parsedDesc.examples && (
                    <div className="potd-desc-section">
                      <h3>Example Test Cases</h3>
                      <pre className="code-block">{parsedDesc.examples}</pre>
                    </div>
                  )}
                  {parsedDesc.constraints && (
                    <div className="potd-desc-section">
                      <h3>Constraints</h3>
                      <pre className="code-block">{parsedDesc.constraints}</pre>
                    </div>
                  )}
                </div>
                <div className="potd-card-actions">
                  <a href={potd.solution || "#"} target="_blank" rel="noreferrer" className="potd-action-btn primary">Solve Problem</a>
                  <a href={potd.solution || "#"} target="_blank" rel="noreferrer" className="potd-action-btn secondary">View Original Problem</a>
                </div>
              </>
            )}
          </section>

          {/* Discussion Chat */}
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
                  const hasSolvedToday = todayRanking.some((row) => row.user_id === cmt.user_id);
                  const parsed = parseMessageContent(cmt.content);
                  return (
                    <div key={cmt.id} className={`chat-message-item ${isOwner ? "message-owner" : ""}`}>
                      <div className="chat-avatar">{getInitials(cmt.profiles?.name)}</div>
                      <div className="chat-message-bubble">
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

        {/* Right Column */}
        <aside className="potd-column-right">
          <section className="potd-side-panel gamify-panel">
            <div className="gamify-user-card">
              <div className="gamify-header">
                <h4>🔥 Daily Streak</h4>
                <span className="streak-value">
                  {computeStreak(mySubmissions.filter((e) => e.status === "Correct").map((e) => e.problems?.date).filter(Boolean))} Days
                </span>
              </div>
              <p className="gamify-sub">Solve problems daily to protect and increase your streak!</p>
            </div>
            <div className="user-achievements-row">
              <h5>Your Unlocked Badges</h5>
              {renderBadgesList(myBadges)}
            </div>
          </section>

          <section className="potd-side-panel standings-panel">
            <header className="panel-header">
              <div className="panel-title-wrap">
                <h3>🏆 Today's Solvers</h3>
                <span className="live-pulse">LIVE</span>
              </div>
            </header>
            <div className="standings-table-wrap scrollable">
              {loadingTodayRanking ? (
                <div className="standings-skeleton"><div className="skeleton-row" /><div className="skeleton-row" /></div>
              ) : todayRanking.length === 0 ? (
                <div className="standings-empty-state">
                  <span className="badge-medal">🥇</span>
                  <p className="empty-copy">No accepted submissions yet. Be the first!</p>
                </div>
              ) : (
                <table className="potd-custom-table">
                  <thead>
                    <tr><th>Rank</th><th>Developer</th><th>Platform Handles</th><th>Solved At</th><th>Duration</th></tr>
                  </thead>
                  <tbody>
                    {todayRanking.map((row, index) => {
                      const medalClass = index === 0 ? "rank-gold" : index === 1 ? "rank-silver" : index === 2 ? "rank-bronze" : "";
                      const medalIcon = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`;
                      return (
                        <tr key={`${row.name}-${row.solvedAt}`} className={medalClass}>
                          <td className="rank-cell"><span className={`medal-pill ${medalClass}`}>{medalIcon}</span></td>
                          <td className="name-cell"><strong>{row.name}</strong></td>
                          <td className="handles-cell">
                            <div className="handles-stack">
                              {row.codeforces_handle && <a href={`https://codeforces.com/profile/${row.codeforces_handle}`} target="_blank" rel="noreferrer" className="handle-link cf">CF: @{row.codeforces_handle}</a>}
                              {row.leetcode_handle && <a href={`https://leetcode.com/${row.leetcode_handle}`} target="_blank" rel="noreferrer" className="handle-link lc">LC: @{row.leetcode_handle}</a>}
                            </div>
                          </td>
                          <td className="time-cell">{row.solvedAt ? new Date(row.solvedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "N/A"}</td>
                          <td className="duration-cell">{formatDuration(row.durationMs)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          <section className="potd-side-panel standings-panel">
            <header className="panel-header">
              <div className="panel-title-wrap">
                <h3>📈 Overall POTD Leaderboard</h3>
                <Link to="/potd-leaderboard" className="panel-link-open">View All</Link>
              </div>
            </header>
            <div className="standings-table-wrap">
              {loadingPotdLeaderboard ? (
                <div className="standings-skeleton"><div className="skeleton-row" /><div className="skeleton-row" /></div>
              ) : (
                <table className="potd-custom-table compact">
                  <thead>
                    <tr><th>Rank</th><th>Developer</th><th>Score</th><th>Streak</th></tr>
                  </thead>
                  <tbody>
                    {overallLeaderboardTop.map((row, index) => {
                      const medalClass = index === 0 ? "rank-gold" : index === 1 ? "rank-silver" : index === 2 ? "rank-bronze" : "";
                      const medalIcon = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`;
                      return (
                        <tr key={`${row.name}-${index}`} className={medalClass}>
                          <td className="rank-cell"><span className={`medal-pill ${medalClass}`}>{medalIcon}</span></td>
                          <td className="name-cell flex-cell"><strong>{row.name || "Anonymous"}</strong>{renderBadgesList(row.badges?.slice(0, 2))}</td>
                          <td className="score-cell"><span className="potd-score-badge-compact">{row.score || 0} pts</span></td>
                          <td>🔥 {row.streak}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          <section className="potd-side-panel stats-panel">
            <header className="panel-header"><h3>📊 Today's Stats</h3></header>
            <div className="stats-box-grid">
              <div className="stats-box-item"><span>Total Solvers Today</span><strong>{stats.totalSolversToday}</strong></div>
              <div className="stats-box-item"><span>Fastest Solve Time</span><strong>{formatDuration(stats.fastestSolveMs)}</strong></div>
              <div className="stats-box-item"><span>Average Solve Time</span><strong>{formatDuration(stats.averageSolveMs)}</strong></div>
              <div className="stats-box-item"><span>Active Chat Users</span><strong>{stats.activeParticipants}</strong></div>
              <div className="stats-box-item full-width"><span>Total Solves (This Week)</span><strong>{stats.solvedThisWeek}</strong></div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
