import { useState, useEffect, useMemo, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { getPOTD } from "../services/problemService";
import { addComment, getComments } from "../services/commentService";
import { supabase } from "../lib/supabase.js";
import { Link } from "react-router-dom";
import "./DashboardPOTD.css";
import "../components/LeaderboardTable.css";

// Deterministic fallback ID based on date for daily chat
function getDailyFallbackId() {
  const dateStr = new Date().toISOString().split("T")[0];
  const parts = dateStr.split("-");
  const year = parseInt(parts[0]).toString(16).padStart(8, '0');
  const month = parseInt(parts[1]).toString(16).padStart(4, '0');
  const day = parseInt(parts[2]).toString(16).padStart(12, '0');
  return `${year}-0000-${month}-0000-${day}`;
}

function getInitials(name) {
  if (!name || typeof name !== "string") return "U";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() || "").join("") || "U";
}

export default function POTD() {
  const { user, loading } = useAuth();

  const [potd, setPotd] = useState(null);
  const [loadingPOTD, setLoadingPOTD] = useState(true);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const [potdLeaderboard, setPotdLeaderboard] = useState([]);
  const [todayRanking, setTodayRanking] = useState([]);
  const [loadingPotdLeaderboard, setLoadingPotdLeaderboard] = useState(true);
  const [loadingTodayRanking, setLoadingTodayRanking] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const chatEndRef = useRef(null);
  const chatViewportRef = useRef(null);
  const hasScrolledOnceRef = useRef(false);

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
    // Skip the very first render's scroll so opening the page never jumps
    // the whole document down to the comments feed.
    if (!hasScrolledOnceRef.current) {
      hasScrolledOnceRef.current = true;
      return;
    }
    // Scroll only within the comments feed container itself, never the page.
    const viewport = chatViewportRef.current;
    if (viewport) {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
    }
  }, [comments]);

  async function loadPOTDDetails() {
    try {
      setLoadingPOTD(true);
      const problem = await getPOTD();
      setPotd(problem);
      const targetId = problem ? problem.id : getDailyFallbackId();
      await loadComments(targetId);
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
      const rankingRows = (data || []).map((row) => ({
        user_id: row.user_id,
        name: row.name || "Anonymous coder",
      }));
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
      await addComment(user.id, targetId, newCommentText.trim());
      setNewCommentText("");
      await loadComments(targetId);
    } catch (err) {
      setErrorMsg("Failed to post comment: " + err.message);
    } finally {
      setAddingComment(false);
    }
  }

  const parsedDesc = useMemo(() => {
    if (!potd?.description) return { body: "", examples: "", constraints: "" };
    // Collapse runs of blank lines so stray double/triple newlines in the
    // stored problem text don't render as large empty gaps.
    const desc = potd.description.replace(/\n{2,}/g, "\n").trim();
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

  const todayLeaderboardRows = useMemo(
    () => todayRanking.map((row) => ({ id: row.user_id, name: row.name })),
    [todayRanking]
  );

  const pointsLeaderboardRows = useMemo(
    () => potdLeaderboard.map((row) => ({ id: row.id, name: row.name, score: row.score || 0 })),
    [potdLeaderboard]
  );

  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}><h3>Loading...</h3></div>;
  }

  return (
    <div className="potd-dashboard-container">
      <header className="potd-section-header-clean">
        <h1 className="potd-title-main">Problem of the Day</h1>
      </header>

      {errorMsg && (
        <div className="potd-error-banner">
          {errorMsg}
        </div>
      )}

      <div className="potd-page-stack">
        <section className="potd-main-card potd-problem-table">
          {loadingPOTD ? (
            <div className="standings-skeleton">
              <div className="skeleton-row" style={{ height: '30px', width: '50%' }} />
              <div className="skeleton-row" style={{ height: '140px', marginTop: '15px' }} />
            </div>
          ) : !potd ? (
            <div className="potd-empty-state-modern">
              <h4 style={{ margin: '12px 0 6px' }}>No challenge today</h4>
              <p style={{ margin: 0, color: 'var(--text)' }}>No POTD has been published for today yet.</p>
            </div>
          ) : (
            <>
              <div className="potd-table-head">
                <h2 className="potd-problem-title">{potd.title}</h2>
                <span className="potd-problem-date">{potd.date || "TBD"}</span>
              </div>
              <div className="potd-table-body">
                <div className="potd-desc-section potd-indented">
                  <h3>Description</h3>
                  <p className="problem-text">{parsedDesc.body}</p>
                </div>
                {parsedDesc.examples && (
                  <div className="potd-desc-section potd-indented">
                    <h3>Examples</h3>
                    <pre className="code-block">{parsedDesc.examples}</pre>
                  </div>
                )}
                {parsedDesc.constraints && (
                  <div className="potd-desc-section potd-indented">
                    <h3>Constraints</h3>
                    <pre className="code-block">{parsedDesc.constraints}</pre>
                  </div>
                )}
              </div>
              <div className="potd-table-actions">
                <a href={potd.solution || "#"} target="_blank" rel="noreferrer" className="potd-solve-btn">Solve Problem</a>
              </div>
            </>
          )}
        </section>

        <MiniLeaderboard
          title="Today's leaderboard"
          rows={todayLeaderboardRows}
          loading={loadingTodayRanking}
          emptyText="No accepted submissions yet. Be the first to solve today's problem."
        />

        <MiniLeaderboard
          title="Points Leaderboard"
          rows={pointsLeaderboardRows}
          loading={loadingPotdLeaderboard}
          showScore
          scoreLabel="Points"
          emptyText="No points recorded yet."
        />

        <section className="potd-chat-container potd-comments-section">
          <h2 className="potd-gradient-heading">Comments section</h2>
          <div className="chat-feed-viewport" ref={chatViewportRef}>
            {comments.length === 0 ? (
              <div className="chat-empty-state">
                <p>No comments yet. Be the first to start the discussion.</p>
              </div>
            ) : (
              comments.map((cmt) => {
                const isOwner = cmt.user_id === user?.id;
                return (
                  <div key={cmt.id} className={`potd-chat-row ${isOwner ? 'own' : 'other'}`}>
                    <div className="potd-chat-avatar">{getInitials(cmt.profiles?.name)}</div>
                    <div className="potd-chat-bubble">
                      <div className="potd-chat-meta">
                        <Link to={`/profile/${cmt.user_id}`} className="potd-chat-name">
                          {cmt.profiles?.name || "Anonymous coder"}
                        </Link>
                        <span className="potd-chat-time">
                          {new Date(cmt.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="potd-chat-text">{cmt.content}</p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={handleAddComment} className="chat-composer-form">
            <input
              type="text"
              placeholder="Share your approach, complexity notes, or hints..."
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
      </div>
    </div>
  );
}

const MINI_PAGE_SIZE = 5;

function MiniLeaderboard({ title, rows, loading, showScore, scoreLabel, emptyText }) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(rows.length / MINI_PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageRows = rows.slice((safePage - 1) * MINI_PAGE_SIZE, safePage * MINI_PAGE_SIZE);

  return (
    <section className="potd-main-card potd-mini-leaderboard">
      <h2 className="potd-gradient-heading">{title}</h2>
      {loading ? (
        <div className="standings-skeleton"><div className="skeleton-row" /><div className="skeleton-row" /></div>
      ) : rows.length === 0 ? (
        <div className="empty-state">
          <p>{emptyText}</p>
        </div>
      ) : (
        <div className="lb-wrapper">
          <div className="lb-table-container">
            <div className={`lb-header-row ${showScore ? '' : 'no-score'}`}>
              <div className="lb-cell lb-cell-rank">Rank</div>
              <div className="lb-cell lb-cell-name">Participant</div>
              {showScore && <div className="lb-cell lb-cell-score">{scoreLabel}</div>}
            </div>
            <div className="lb-body potd-mini-lb-body">
              {pageRows.map((row, index) => {
                const rank = (safePage - 1) * MINI_PAGE_SIZE + index + 1;
                const rankTierClass = rank === 1 ? 'rank-gold' : rank === 2 ? 'rank-silver' : rank === 3 ? 'rank-bronze' : '';
                const content = (
                  <div className={`lb-row ${rankTierClass} ${showScore ? '' : 'no-score'}`} data-in="true">
                    <div className="lb-cell lb-cell-rank">
                      <span className="lb-rank-num">{rank}</span>
                    </div>
                    <div className="lb-cell lb-cell-name">
                      <span className="lb-name">{row.name || "Anonymous"}</span>
                    </div>
                    {showScore && (
                      <div className="lb-cell lb-cell-score">
                        <span className="lb-score">{(row.score || 0).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                );
                return row.id ? (
                  <Link key={`${row.id}-${index}`} to={`/profile/${row.id}`} className="lb-row-link">
                    {content}
                  </Link>
                ) : (
                  <div key={index} className="lb-row-link lb-row-link-static">{content}</div>
                );
              })}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="lb-pagination">
              <button
                className="lb-page-btn"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                aria-label="Previous page"
              >
                ←
              </button>
              <span className="lb-page-indicator">
                {safePage} of {totalPages}
              </span>
              <button
                className="lb-page-btn"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                aria-label="Next page"
              >
                →
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
