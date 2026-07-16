import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { uploadResume, getResumeUrl, deleteResume } from "../services/storageService";
import { updateProfile, deriveCollegeIdFromEmail } from "../services/ProfileService";
import { signOut } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Globe, Link2, Code2, FileText,
  LogOut, Shield, CheckCircle2, XCircle, Upload,
  Loader2, ExternalLink, Trash2, X, ChevronRight,
  Terminal, Zap, Award,
} from "lucide-react";
import { SiCodeforces, SiLeetcode } from "react-icons/si";
import "./Dashboard.css";

// ─── Animation variants ───────────────────────────────────────────────────────
const panelVariants = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2  } },
};

// ─── Skills tag-chip input ────────────────────────────────────────────────────
function SkillTagInput({ skillsText, setSkillsText }) {
  const [input, setInput] = useState("");
  const skills = skillsText
    ? skillsText.split(",").map(s => s.trim()).filter(Boolean)
    : [];

  const addSkill = (val) => {
    const v = val.trim().replace(/,$/, "");
    if (v && !skills.includes(v)) {
      setSkillsText(skills.length ? `${skillsText}, ${v}` : v);
    }
    setInput("");
  };

  const removeSkill = (idx) =>
    setSkillsText(skills.filter((_, i) => i !== idx).join(", "));

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (input.trim()) addSkill(input);
    } else if (e.key === "Backspace" && !input && skills.length) {
      removeSkill(skills.length - 1);
    }
  };

  return (
    <div className="dp-skill-wrap">
      <div className="dp-skill-tags">
        {skills.map((s, i) => (
          <span key={i} className="dp-skill-tag">
            {s}
            <button
              type="button"
              className="dp-skill-remove"
              onClick={() => removeSkill(i)}
              aria-label={`Remove ${s}`}
            >
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (input.trim()) addSkill(input); }}
          placeholder={skills.length === 0 ? "Add skills (Enter or comma)..." : "Add more..."}
          className="dp-skill-input"
          id="dp-skills-input"
        />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();

  // ── Existing state (unchanged) ──────────────────────────────────────────────
  const [uploading,       setUploading]       = useState(false);
  const [resumeSignedUrl, setResumeSignedUrl] = useState("");
  const [skillsText,      setSkillsText]      = useState("");
  const [name,            setName]            = useState("");
  const [collegeId,       setCollegeId]       = useState("");
  const [githubUrl,       setGithubUrl]       = useState("");
  const [linkedinUrl,     setLinkedinUrl]     = useState("");
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const [isCfVerifying,        setIsCfVerifying]        = useState(false);
  const [cfInputHandle,        setCfInputHandle]         = useState("");
  const [cfVerificationProblem,setCfVerificationProblem] = useState(null);
  const [cfError,              setCfError]              = useState("");
  const [cfLoading,            setCfLoading]            = useState(false);

  const [isLcVerifying,     setIsLcVerifying]     = useState(false);
  const [lcInputHandle,     setLcInputHandle]     = useState("");
  const [lcVerificationCode,setLcVerificationCode] = useState("");
  const [lcError,           setLcError]           = useState("");
  const [lcLoading,         setLcLoading]         = useState(false);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg,   setErrorMsg]   = useState("");

  // ── New state ───────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("profile");
  const [dragOver,  setDragOver]  = useState(false);

  // ── Sync profile into state ─────────────────────────────────────────────────
  useEffect(() => {
    if (!profile) return;
    const derivedId  = deriveCollegeIdFromEmail(user?.email || profile?.email || "");
    const nextId     = derivedId || profile.college_id || "";
    setName(profile.name || "");
    setCollegeId(nextId);
    setGithubUrl(profile.github_url || "");
    setLinkedinUrl(profile.linkedin_url || "");
    setSkillsText(profile.skills ? profile.skills.join(", ") : "");
    setCfInputHandle(profile.codeforces_handle || "");
    setLcInputHandle(profile.leetcode_handle   || "");

    if (derivedId && user?.id && profile.college_id !== derivedId) {
      updateProfile(user.id, { college_id: derivedId })
        .then(() => setCollegeId(derivedId))
        .catch(err => console.warn("Unable to sync college ID:", err.message));
    }

    if (profile.resume_url) loadResumeUrl(profile.resume_url);
    else setResumeSignedUrl("");
  }, [profile, user?.email, user?.id]);

  async function loadResumeUrl(path) {
    try { setResumeSignedUrl(await getResumeUrl(path)); }
    catch (err) { console.error("Error loading resume URL:", err.message); }
  }

  async function handleLogout() {
    await signOut();
    navigate("/login");
  }

  async function handleUpdateProfile(e) {
    e.preventDefault();
    setSuccessMsg(""); setErrorMsg("");
    if (!name.trim()) { setErrorMsg("Name is required to complete your profile."); return; }
    setUpdatingProfile(true);
    try {
      const skillsArray = skillsText.split(",").map(s => s.trim()).filter(Boolean);
      await updateProfile(user.id, {
        name: name.trim(),
        github_url: githubUrl.trim(),
        linkedin_url: linkedinUrl.trim(),
        skills: skillsArray,
        is_public: true,
      });
      setSuccessMsg("Profile details updated successfully!");
      if (refreshProfile) await refreshProfile();
    } catch (err) { setErrorMsg("Failed to update profile: " + err.message); }
    finally { setUpdatingProfile(false); }
  }

  const getApiBase = () =>
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://localhost:5001"
      : "https://console-website.onrender.com";

  async function handleStartVerification(platform) {
    const handle = platform === "codeforces" ? cfInputHandle : lcInputHandle;
    if (!handle.trim()) {
      if (platform === "codeforces") setCfError("Please enter a handle first");
      else setLcError("Please enter a handle first");
      return;
    }
    if (platform === "codeforces") { setCfLoading(true); setCfError(""); }
    else { setLcLoading(true); setLcError(""); }

    try {
      const res  = await fetch(`${getApiBase()}/api/verify/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, platform, handle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start verification");
      if (platform === "codeforces") { setCfVerificationProblem(data); setIsCfVerifying(true); }
      else { setLcVerificationCode(data.code); setIsLcVerifying(true); }
    } catch (err) {
      if (platform === "codeforces") setCfError(err.message); else setLcError(err.message);
    } finally {
      if (platform === "codeforces") setCfLoading(false); else setLcLoading(false);
    }
  }

  async function handleConfirmVerification(platform) {
    if (platform === "codeforces") { setCfLoading(true); setCfError(""); }
    else { setLcLoading(true); setLcError(""); }
    try {
      const res  = await fetch(`${getApiBase()}/api/verify/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, platform }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");
      const field = platform === "leetcode" ? "leetcode_handle" : "codeforces_handle";
      await updateProfile(user.id, { [field]: data.handle });
      setSuccessMsg(data.message);
      if (platform === "codeforces") setIsCfVerifying(false); else setIsLcVerifying(false);
      if (refreshProfile) await refreshProfile();
    } catch (err) {
      if (platform === "codeforces") setCfError(err.message); else setLcError(err.message);
    } finally {
      if (platform === "codeforces") setCfLoading(false); else setLcLoading(false);
    }
  }

  async function handleDisconnect(platform) {
    if (!window.confirm(`Disconnect your ${platform} handle?`)) return;
    setSuccessMsg(""); setErrorMsg("");
    try {
      const res  = await fetch(`${getApiBase()}/api/verify/disconnect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, platform }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Disconnection failed");
      const field = platform === "leetcode" ? "leetcode_handle" : "codeforces_handle";
      await updateProfile(user.id, { [field]: null });
      setSuccessMsg(data.message);
      if (platform === "codeforces") setCfInputHandle(""); else setLcInputHandle("");
      if (refreshProfile) await refreshProfile();
    } catch (err) { setErrorMsg(err.message); }
  }

  async function processResumeFile(file) {
    setSuccessMsg(""); setErrorMsg("");
    if (file.type !== "application/pdf") { setErrorMsg("Only PDF files are supported."); return; }
    if (file.size > 2 * 1024 * 1024)    { setErrorMsg("Resume must be under 2 MB."); return; }
    setUploading(true);
    try {
      if (profile?.resume_url) {
        try { await deleteResume(profile.resume_url); } catch { /* ignore */ }
      }
      const path = await uploadResume(user.id, file);
      await updateProfile(user.id, { resume_url: path });
      setSuccessMsg("Resume uploaded successfully!");
      if (refreshProfile) await refreshProfile();
    } catch (err) { setErrorMsg("Upload failed: " + err.message); }
    finally { setUploading(false); }
  }

  async function handleResumeUpload(e) {
    if (!e.target.files?.length) return;
    await processResumeFile(e.target.files[0]);
  }

  async function handleResumeDrop(e) {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) await processResumeFile(file);
  }

  async function handleDeleteResume() {
    if (!window.confirm("Remove your resume?")) return;
    setSuccessMsg(""); setErrorMsg(""); setUploading(true);
    try {
      if (profile?.resume_url) await deleteResume(profile.resume_url);
      await updateProfile(user.id, { resume_url: null });
      setResumeSignedUrl("");
      setSuccessMsg("Resume removed.");
      if (refreshProfile) await refreshProfile();
    } catch (err) { setErrorMsg("Failed to remove resume: " + err.message); }
    finally { setUploading(false); }
  }

  // ── Loading state ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="dp-loading">
        <div className="dp-loading-spinner" />
        <p>Initializing your developer profile...</p>
      </div>
    );
  }

  // ── Derived values ───────────────────────────────────────────────────────────
  const resumeFileName = profile?.resume_url
    ? profile.resume_url.split("/").pop().replace(/_\d+(\.[a-zA-Z0-9]+)$/i, "$1")
    : "";

  const avatarUrl = user?.user_metadata?.avatar_url;
  const initials  = (profile?.name || user?.email || "?")
    .split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const TABS = [
    { id: "profile",   label: "Profile",   icon: <User     size={14} /> },
    { id: "platforms", label: "Platforms", icon: <Terminal size={14} /> },
    { id: "resume",    label: "Resume",    icon: <FileText size={14} /> },
  ];

  return (
    <div className="dp-page">
      {/* ── Background ──────────────────────────────────────────── */}
      <div className="dp-bg" aria-hidden="true">
        <div className="dp-bg-glow-1" />
        <div className="dp-bg-glow-2" />
        <div className="dp-bg-grid"   />
      </div>

      <div className="dp-shell">
        {/* ── Sidebar ─────────────────────────────────────────── */}
        <aside className="dp-sidebar">
          {/* Avatar with spinning gradient ring */}
          <div className="dp-avatar-ring-wrap">
            <div className="dp-avatar-inner">
              {avatarUrl
                ? <img src={avatarUrl} alt={profile?.name || "Avatar"} className="dp-avatar-img" />
                : <span className="dp-avatar-initials">{initials}</span>
              }
            </div>
          </div>

          {/* Identity */}
          <div className="dp-identity">
            <h2 className="dp-identity-name">
              {profile?.name || "Set your name"}
            </h2>
            <p className="dp-identity-email">{user?.email}</p>
            {collegeId && (
              <span className="dp-college-badge">
                <Award size={10} /> {collegeId}
              </span>
            )}
          </div>

          {/* Platform stat chips */}
          {(profile?.codeforces_handle || profile?.leetcode_handle) && (
            <div className="dp-stat-chips">
              {profile?.codeforces_handle && (
                <div className="dp-stat-chip dp-stat-cf">
                  <Code2 size={11} />
                  <span>{profile.codeforces_handle}</span>
                  <CheckCircle2 size={10} className="dp-stat-check" />
                </div>
              )}
              {profile?.leetcode_handle && (
                <div className="dp-stat-chip dp-stat-lc">
                  <Zap size={11} />
                  <span>{profile.leetcode_handle}</span>
                  <CheckCircle2 size={10} className="dp-stat-check" />
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <nav className="dp-sidenav">
            {profile?.role === "admin" && (
              <button className="dp-nav-btn dp-nav-admin" onClick={() => navigate("/admin")}>
                <Shield size={14} /> Admin Panel
              </button>
            )}
            <button className="dp-nav-btn dp-nav-logout" onClick={handleLogout}>
              <LogOut size={14} /> Sign Out
            </button>
          </nav>
        </aside>

        {/* ── Main ────────────────────────────────────────────── */}
        <main className="dp-main">
          {/* Header */}
          <header className="dp-main-header">
            <h1 className="dp-main-title">My Profile</h1>
            <p className="dp-main-sub">
              Manage your developer identity, platform handles, and resume.
            </p>
          </header>

          {/* Banners */}
          <AnimatePresence>
            {!profile?.name && (
              <motion.div
                key="warn"
                className="dp-banner dp-banner-warn"
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              >
                ⚡ Enter your <strong>Name</strong> in the Profile tab to unlock the rest of the site.
              </motion.div>
            )}
            {successMsg && (
              <motion.div
                key={successMsg}
                className="dp-banner dp-banner-success"
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              >
                ✓ {successMsg}
              </motion.div>
            )}
            {errorMsg && (
              <motion.div
                key={errorMsg}
                className="dp-banner dp-banner-error"
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              >
                ⚠ {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tab bar */}
          <div className="dp-tabs" role="tablist">
            {TABS.map(tab => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                id={`dp-tab-${tab.id}`}
                className={`dp-tab${activeTab === tab.id ? " active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Tab panels */}
          <AnimatePresence mode="wait">
            {/* ── Profile Tab ──────────────────────────────── */}
            {activeTab === "profile" && (
              <motion.form
                key="profile"
                variants={panelVariants}
                initial="hidden" animate="visible" exit="exit"
                className="dp-panel"
                onSubmit={handleUpdateProfile}
                id="dp-tab-panel-profile"
              >
                <div className="dp-fields">
                  <div className="dp-field-group">
                    <label className="dp-field-label" htmlFor="dp-input-name">
                      Full Name <span className="dp-required">*</span>
                    </label>
                    <input
                      id="dp-input-name"
                      type="text"
                      placeholder="Your full name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      className={`dp-input${!name.trim() ? " dp-input-invalid" : ""}`}
                    />
                  </div>

                  <div className="dp-field-group">
                    <label className="dp-field-label">Email Address</label>
                    <input
                      type="email"
                      value={profile?.email || user?.email || ""}
                      disabled
                      className="dp-input dp-input-disabled"
                    />
                  </div>

                  <div className="dp-field-group">
                    <label className="dp-field-label">College ID</label>
                    <input type="text" value={collegeId} disabled className="dp-input dp-input-disabled" />
                    {/* <p className="dp-field-hint">
                      Auto-filled from your email. Determines your year on the leaderboard.
                    </p> */}
                  </div>

                  <div className="dp-field-group">
                    <label className="dp-field-label" htmlFor="dp-input-github">
                      <Globe size={13} /> GitHub URL
                    </label>
                    <input
                      id="dp-input-github"
                      type="url"
                      placeholder="https://github.com/username"
                      value={githubUrl}
                      onChange={e => setGithubUrl(e.target.value)}
                      className="dp-input"
                    />
                  </div>

                  <div className="dp-field-group">
                    <label className="dp-field-label" htmlFor="dp-input-linkedin">
                      <Link2 size={13} /> LinkedIn URL
                    </label>
                    <input
                      id="dp-input-linkedin"
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      value={linkedinUrl}
                      onChange={e => setLinkedinUrl(e.target.value)}
                      className="dp-input"
                    />
                  </div>

                  <div className="dp-field-group">
                    <label className="dp-field-label">Skills</label>
                    <SkillTagInput skillsText={skillsText} setSkillsText={setSkillsText} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={updatingProfile}
                  className="dp-save-btn"
                  id="dp-save-profile-btn"
                >
                  {updatingProfile
                    ? <><Loader2 size={15} className="dp-spin" /> Saving...</>
                    : <><CheckCircle2 size={15} /> Save Profile</>
                  }
                </button>
              </motion.form>
            )}

            {/* ── Platforms Tab ─────────────────────────────── */}
            {activeTab === "platforms" && (
              <motion.div
                key="platforms"
                variants={panelVariants}
                initial="hidden" animate="visible" exit="exit"
                className="dp-panel"
                id="dp-tab-panel-platforms"
              >
                {/* Codeforces Card */}
                <div className="dp-platform-card">
                  <div className="dp-platform-header">
                    <div className="dp-platform-icon dp-platform-icon-cf">
                      <SiCodeforces size={20} />
                    </div>
                    <div>
                      <h3 className="dp-platform-name">Codeforces</h3>
                    </div>
                    <div className="dp-platform-badge-wrap">
                      {profile?.codeforces_handle
                        ? <span className="dp-badge-connected"><CheckCircle2 size={11} /> Connected</span>
                        : <span className="dp-badge-disconnected">Not connected</span>
                      }
                    </div>
                  </div>

                  <div className="dp-platform-body">
                    {profile?.codeforces_handle ? (
                      <div className="dp-platform-connected">
                        <div className="dp-connected-info">
                          <Code2 size={14} />
                          <span className="dp-connected-handle">{profile.codeforces_handle}</span>
                          <a
                            href={`https://codeforces.com/profile/${profile.codeforces_handle}`}
                            target="_blank" rel="noreferrer"
                            className="dp-external-link"
                          >
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                    ) : isCfVerifying ? (
                      <div className="dp-verify-box">
                        <p className="dp-verify-instruction">
                          Submit any solution (any verdict) to the following Codeforces problem:
                        </p>
                        <a
                          href={cfVerificationProblem?.problemUrl}
                          target="_blank" rel="noreferrer"
                          className="dp-verify-problem-link"
                        >
                          <ChevronRight size={13} />
                          {cfVerificationProblem?.problemId} — {cfVerificationProblem?.problemTitle}
                          <ExternalLink size={11} />
                        </a>
                        <p className="dp-verify-note">Then click Confirm within 5 minutes.</p>
                        {cfError && <p className="dp-verify-error">{cfError}</p>}
                        <div className="dp-verify-actions">
                          <button
                            type="button"
                            disabled={cfLoading}
                            className="dp-verify-confirm-btn"
                            onClick={() => handleConfirmVerification("codeforces")}
                          >
                            {cfLoading
                              ? <><Loader2 size={13} className="dp-spin" /> Verifying...</>
                              : <><CheckCircle2 size={13} /> Confirm Verification</>
                            }
                          </button>
                          <button type="button" className="dp-verify-cancel-btn" onClick={() => setIsCfVerifying(false)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="dp-platform-input-row">
                        <input
                          id="dp-input-cf"
                          type="text"
                          placeholder="Your Codeforces username"
                          value={cfInputHandle}
                          onChange={e => setCfInputHandle(e.target.value)}
                          className="dp-input"
                        />
                        <button
                          type="button"
                          disabled={cfLoading}
                          className="dp-verify-btn"
                          onClick={() => handleStartVerification("codeforces")}
                        >
                          {cfLoading
                            ? <><Loader2 size={13} className="dp-spin" /> Starting...</>
                            : "Verify & Connect"
                          }
                        </button>
                      </div>
                    )}
                    {!isCfVerifying && cfError && (
                      <p className="dp-verify-error" style={{ marginTop: 10 }}>{cfError}</p>
                    )}
                  </div>
                </div>

                {/* LeetCode Card */}
                <div className="dp-platform-card">
                  <div className="dp-platform-header">
                    <div className="dp-platform-icon dp-platform-icon-lc">
                      <SiLeetcode size={20} />
                    </div>
                    <div>
                      <h3 className="dp-platform-name">LeetCode</h3>
                    </div>
                    <div className="dp-platform-badge-wrap">
                      {profile?.leetcode_handle
                        ? <span className="dp-badge-connected"><CheckCircle2 size={11} /> Connected</span>
                        : <span className="dp-badge-disconnected">Not connected</span>
                      }
                    </div>
                  </div>

                  <div className="dp-platform-body">
                    {profile?.leetcode_handle ? (
                      <div className="dp-platform-connected">
                        <div className="dp-connected-info">
                          <Zap size={14} />
                          <span className="dp-connected-handle">{profile.leetcode_handle}</span>
                          <a
                            href={`https://leetcode.com/${profile.leetcode_handle}`}
                            target="_blank" rel="noreferrer"
                            className="dp-external-link"
                          >
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                    ) : isLcVerifying ? (
                      <div className="dp-verify-box">
                        <p className="dp-verify-instruction">
                          Go to LeetCode → Settings → Profile → About Me, then paste this code:
                        </p>
                        <div className="dp-verify-code-box">
                          <code>{lcVerificationCode}</code>
                          <button
                            type="button"
                            className="dp-copy-btn"
                            onClick={() => navigator.clipboard.writeText(lcVerificationCode)}
                          >
                            Copy
                          </button>
                        </div>
                        <p className="dp-verify-note">Then click Confirm Verification.</p>
                        {lcError && <p className="dp-verify-error">{lcError}</p>}
                        <div className="dp-verify-actions">
                          <button
                            type="button"
                            disabled={lcLoading}
                            className="dp-verify-confirm-btn"
                            onClick={() => handleConfirmVerification("leetcode")}
                          >
                            {lcLoading
                              ? <><Loader2 size={13} className="dp-spin" /> Verifying...</>
                              : <><CheckCircle2 size={13} /> Confirm Verification</>
                            }
                          </button>
                          <button type="button" className="dp-verify-cancel-btn" onClick={() => setIsLcVerifying(false)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="dp-platform-input-row">
                        <input
                          id="dp-input-lc"
                          type="text"
                          placeholder="Your LeetCode username"
                          value={lcInputHandle}
                          onChange={e => setLcInputHandle(e.target.value)}
                          className="dp-input"
                        />
                        <button
                          type="button"
                          disabled={lcLoading}
                          className="dp-verify-btn"
                          onClick={() => handleStartVerification("leetcode")}
                        >
                          {lcLoading
                            ? <><Loader2 size={13} className="dp-spin" /> Starting...</>
                            : "Verify & Connect"
                          }
                        </button>
                      </div>
                    )}
                    {!isLcVerifying && lcError && (
                      <p className="dp-verify-error" style={{ marginTop: 10 }}>{lcError}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Resume Tab ────────────────────────────────── */}
            {activeTab === "resume" && (
              <motion.div
                key="resume"
                variants={panelVariants}
                initial="hidden" animate="visible" exit="exit"
                className="dp-panel"
                id="dp-tab-panel-resume"
              >
                {!profile?.resume_url ? (
                  <div
                    className={`dp-resume-zone${dragOver ? " drag-over" : ""}`}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleResumeDrop}
                  >
                    <div className="dp-resume-zone-inner">
                      <div className="dp-resume-zone-icon">
                        {uploading
                          ? <Loader2 size={26} className="dp-spin" />
                          : <Upload size={26} />
                        }
                      </div>
                      <p className="dp-resume-zone-title">
                        {uploading ? "Uploading your resume..." : "Drop your resume here"}
                      </p>
                      <p className="dp-resume-zone-sub">PDF only · Max 2 MB</p>
                      {!uploading && (
                        <>
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handleResumeUpload}
                            style={{ display: "none" }}
                            id="resume-file-input"
                          />
                          <label htmlFor="resume-file-input" className="dp-resume-browse-btn">
                            Browse File
                          </label>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="dp-resume-present">
                    <div className="dp-resume-file-card">
                      <div className="dp-resume-file-icon">
                        <FileText size={22} />
                      </div>
                      <div className="dp-resume-file-info">
                        <span className="dp-resume-file-name">{resumeFileName}</span>
                        <span className="dp-resume-file-type">PDF Document</span>
                      </div>
                      <div className="dp-resume-file-actions">
                        {resumeSignedUrl
                          ? <a href={resumeSignedUrl} target="_blank" rel="noreferrer" className="dp-resume-action-btn dp-resume-view">
                              <ExternalLink size={12} /> View
                            </a>
                          : <span className="dp-resume-action-btn dp-resume-loading">Loading…</span>
                        }
                        <input
                          type="file" accept=".pdf"
                          onChange={handleResumeUpload}
                          style={{ display: "none" }}
                          id="resume-file-replace"
                        />
                        <label htmlFor="resume-file-replace" className="dp-resume-action-btn dp-resume-replace">
                          {uploading ? <Loader2 size={12} className="dp-spin" /> : <Upload size={12} />} Replace
                        </label>
                        <button
                          type="button"
                          onClick={handleDeleteResume}
                          disabled={uploading}
                          className="dp-resume-action-btn dp-resume-delete"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}