import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { uploadResume, getResumeUrl, deleteResume } from "../services/storageService";
import { updateProfile, deriveCollegeIdFromEmail } from "../services/ProfileService";
import { signOut } from "../services/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();

  // Profile settings state
  const [uploading, setUploading] = useState(false);
  const [resumeSignedUrl, setResumeSignedUrl] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [name, setName] = useState("");
  const [collegeId, setCollegeId] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Handle verification states
  const [isCfVerifying, setIsCfVerifying] = useState(false);
  const [cfInputHandle, setCfInputHandle] = useState("");
  const [cfVerificationProblem, setCfVerificationProblem] = useState(null);
  const [cfError, setCfError] = useState("");
  const [cfLoading, setCfLoading] = useState(false);

  const [isLcVerifying, setIsLcVerifying] = useState(false);
  const [lcInputHandle, setLcInputHandle] = useState("");
  const [lcVerificationCode, setLcVerificationCode] = useState("");
  const [lcError, setLcError] = useState("");
  const [lcLoading, setLcLoading] = useState(false);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Sync state with profile once loaded
  useEffect(() => {
    if (profile) {
      const derivedCollegeId = deriveCollegeIdFromEmail(user?.email || profile?.email || "");
      const nextCollegeId = derivedCollegeId || profile.college_id || "";

      setName(profile.name || "");
      setCollegeId(nextCollegeId);
      setGithubUrl(profile.github_url || "");
      setLinkedinUrl(profile.linkedin_url || "");
      setSkillsText(profile.skills ? profile.skills.join(", ") : "");
      setCfInputHandle(profile.codeforces_handle || "");
      setLcInputHandle(profile.leetcode_handle || "");

      if (derivedCollegeId && user?.id && profile.college_id !== derivedCollegeId) {
        updateProfile(user.id, { college_id: derivedCollegeId })
          .then(() => setCollegeId(derivedCollegeId))
          .catch((err) => console.warn("Unable to sync college ID:", err.message));
      }

      if (profile.resume_url) {
        loadResumeUrl(profile.resume_url);
      } else {
        setResumeSignedUrl("");
      }
    }
  }, [profile, user?.email, user?.id]);

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
    navigate("/login");
  }

  async function handleUpdateProfile(e) {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Name is required to complete your profile.");
      return;
    }

    setUpdatingProfile(true);

    try {
      const skillsArray = skillsText
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      await updateProfile(user.id, {
        name: name.trim(),
        github_url: githubUrl.trim(),
        linkedin_url: linkedinUrl.trim(),
        skills: skillsArray,
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

  async function handleStartVerification(platform) {
    const handle = platform === "codeforces" ? cfInputHandle : lcInputHandle;
    if (!handle.trim()) {
      if (platform === "codeforces") setCfError("Please enter a handle first");
      else setLcError("Please enter a handle first");
      return;
    }

    if (platform === "codeforces") {
      setCfLoading(true);
      setCfError("");
    } else {
      setLcLoading(true);
      setLcError("");
    }

    try {
      const res = await fetch("http://localhost:5001/api/verify/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, platform, handle }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start verification");

      if (platform === "codeforces") {
        setCfVerificationProblem(data);
        setIsCfVerifying(true);
      } else {
        setLcVerificationCode(data.code);
        setIsLcVerifying(true);
      }
    } catch (err) {
      if (platform === "codeforces") setCfError(err.message);
      else setLcError(err.message);
    } finally {
      if (platform === "codeforces") setCfLoading(false);
      else setLcLoading(false);
    }
  }

  async function handleConfirmVerification(platform) {
    if (platform === "codeforces") {
      setCfLoading(true);
      setCfError("");
    } else {
      setLcLoading(true);
      setLcError("");
    }

    try {
      const res = await fetch("http://localhost:5001/api/verify/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, platform }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");

      setSuccessMsg(data.message);
      if (platform === "codeforces") {
        setIsCfVerifying(false);
      } else {
        setIsLcVerifying(false);
      }
      if (refreshProfile) await refreshProfile();
    } catch (err) {
      if (platform === "codeforces") setCfError(err.message);
      else setLcError(err.message);
    } finally {
      if (platform === "codeforces") setCfLoading(false);
      else setLcLoading(false);
    }
  }

  async function handleDisconnect(platform) {
    if (!window.confirm(`Are you sure you want to disconnect your ${platform} handle?`)) return;
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await fetch("http://localhost:5001/api/verify/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, platform }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Disconnection failed");

      setSuccessMsg(data.message);
      if (platform === "codeforces") {
        setCfInputHandle("");
      } else {
        setLcInputHandle("");
      }
      if (refreshProfile) await refreshProfile();
    } catch (err) {
      setErrorMsg(err.message);
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

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
        <h3>Loading your developer profile...</h3>
      </div>
    );
  }

  const resumeFileName = profile?.resume_url
    ? profile.resume_url.split("/").pop().replace(/_\d+(\.[a-zA-Z0-9]+)$/i, "$1")
    : "";

  return (
    <div className="pf-page">
      <div className="pf-topbar">
        <div className="pf-topbar-actions">
          {profile?.name && (
            <button className="pf-btn-outline pf-btn-accent" onClick={() => navigate("/home")}>
              Go to Home
            </button>
          )}
          <button className="pf-btn-outline" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </div>

      <div className="pf-header">
        <h1 className="pf-title">My Profile</h1>
        <p className="pf-subtitle">Manage your profile details, handles, and resume</p>
      </div>

      {!profile?.name && (
        <div className="pf-message pf-message-warn">
          Please enter your <strong>Name</strong> to complete your profile and access the rest of the website.
        </div>
      )}
      {successMsg && <div className="pf-message pf-message-success">{successMsg}</div>}
      {errorMsg && <div className="pf-message pf-message-error">{errorMsg}</div>}

      <div className="pf-card">
        <form onSubmit={handleUpdateProfile}>
          <div className="pf-fields">
            <div className="pf-row">
              <span className="pf-label">
                Full name <span className="pf-required">*</span>
              </span>
              <input
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={`pf-input${!name.trim() ? " pf-input-invalid" : ""}`}
              />
            </div>

            <div className="pf-row">
              <span className="pf-label">Email address</span>
              <input
                type="email"
                value={profile?.email || user?.email || ""}
                disabled
                className="pf-input"
              />
            </div>

            <div className="pf-row">
              <span className="pf-label">College ID</span>
              <input type="text" value={collegeId} disabled className="pf-input" />
              <span className="pf-hint">Auto-filled from your email. Used to determine your year on the leaderboard.</span>
            </div>

            <div className="pf-row">
              <span className="pf-label">GitHub URL</span>
              <input
                type="url"
                placeholder="https://github.com/username"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="pf-input"
              />
            </div>

            <div className="pf-row">
              <span className="pf-label">LinkedIn URL</span>
              <input
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="pf-input"
              />
            </div>

            <div className="pf-row">
              <span className="pf-label">Codeforces handle</span>
              {profile?.codeforces_handle ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span className="pf-verified-badge" style={{ background: "rgba(34, 197, 94, 0.15)", color: "#22c55e", padding: "6px 12px", borderRadius: "6px", fontSize: "14px", fontWeight: "600" }}>
                    Verified: {profile.codeforces_handle}
                  </span>
                </div>
              ) : isCfVerifying ? (
                <div style={{ border: "1px solid var(--border)", padding: "15px", borderRadius: "8px", background: "var(--code-bg)", display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
                  <p style={{ margin: 0, fontSize: "14px", color: "var(--text-h)" }}>
                    To verify handle <strong>{cfInputHandle}</strong>:
                  </p>
                  <p style={{ margin: 0, fontSize: "13px" }}>
                    1. Submit a solution (any verdict) to:{" "}
                    <a href={cfVerificationProblem?.problemUrl} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", fontWeight: "600" }}>
                      Codeforces {cfVerificationProblem?.problemId} ({cfVerificationProblem?.problemTitle}) ↗
                    </a>
                  </p>
                  <p style={{ margin: 0, fontSize: "13px" }}>
                    2. Click "Confirm Verification" within 5 minutes.
                  </p>
                  {cfError && <span style={{ color: "#ef4444", fontSize: "12px" }}>{cfError}</span>}
                  <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
                    <button
                      type="button"
                      disabled={cfLoading}
                      onClick={() => handleConfirmVerification("codeforces")}
                      className="pf-resume-btn"
                      style={{ margin: 0 }}
                    >
                      {cfLoading ? "Verifying..." : "Confirm Verification"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCfVerifying(false)}
                      className="pf-resume-btn pf-resume-btn-danger"
                      style={{ margin: 0, background: "transparent", border: "1px solid var(--border)", color: "var(--text)" }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                  <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                    <input
                      type="text"
                      placeholder="Codeforces username"
                      value={cfInputHandle}
                      onChange={(e) => setCfInputHandle(e.target.value)}
                      className="pf-input"
                      style={{ flexGrow: 1 }}
                    />
                    <button
                      type="button"
                      disabled={cfLoading}
                      onClick={() => handleStartVerification("codeforces")}
                      className="pf-resume-btn"
                      style={{ margin: 0, padding: "0 15px", whiteSpace: "nowrap" }}
                    >
                      {cfLoading ? "Starting..." : "Verify & Connect"}
                    </button>
                  </div>
                  {cfError && <span style={{ color: "#ef4444", fontSize: "12px" }}>{cfError}</span>}
                </div>
              )}
            </div>

            <div className="pf-row">
              <span className="pf-label">LeetCode handle</span>
              {profile?.leetcode_handle ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span className="pf-verified-badge" style={{ background: "rgba(34, 197, 94, 0.15)", color: "#22c55e", padding: "6px 12px", borderRadius: "6px", fontSize: "14px", fontWeight: "600" }}>
                    Verified: {profile.leetcode_handle}
                  </span>
                </div>
              ) : isLcVerifying ? (
                <div style={{ border: "1px solid var(--border)", padding: "15px", borderRadius: "8px", background: "var(--code-bg)", display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
                  <p style={{ margin: 0, fontSize: "14px", color: "var(--text-h)" }}>
                    To verify handle <strong>{lcInputHandle}</strong>:
                  </p>
                  <p style={{ margin: 0, fontSize: "13px" }}>
                    1. Go to settings on leetcode, go to profile settings, and edit your readme to display the following text: 
                  </p>
                  <div style={{ padding: "8px 12px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "6px", fontFamily: "monospace", fontSize: "14px", color: "var(--text-h)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{lcVerificationCode}</span>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(lcVerificationCode)}
                      style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}
                    >
                      Copy
                    </button>
                  </div>
                  <p style={{ margin: 0, fontSize: "13px" }}>
                    2. Click "Confirm Verification".
                  </p>
                  {lcError && <span style={{ color: "#ef4444", fontSize: "12px" }}>{lcError}</span>}
                  <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
                    <button
                      type="button"
                      disabled={lcLoading}
                      onClick={() => handleConfirmVerification("leetcode")}
                      className="pf-resume-btn"
                      style={{ margin: 0 }}
                    >
                      {lcLoading ? "Verifying..." : "Confirm Verification"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsLcVerifying(false)}
                      className="pf-resume-btn pf-resume-btn-danger"
                      style={{ margin: 0, background: "transparent", border: "1px solid var(--border)", color: "var(--text)" }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                  <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                    <input
                      type="text"
                      placeholder="LeetCode username"
                      value={lcInputHandle}
                      onChange={(e) => setLcInputHandle(e.target.value)}
                      className="pf-input"
                      style={{ flexGrow: 1 }}
                    />
                    <button
                      type="button"
                      disabled={lcLoading}
                      onClick={() => handleStartVerification("leetcode")}
                      className="pf-resume-btn"
                      style={{ margin: 0, padding: "0 15px", whiteSpace: "nowrap" }}
                    >
                      {lcLoading ? "Starting..." : "Verify & Connect"}
                    </button>
                  </div>
                  {lcError && <span style={{ color: "#ef4444", fontSize: "12px" }}>{lcError}</span>}
                </div>
              )}
            </div>

            <div className="pf-row">
              <span className="pf-label">Skills</span>
              <input
                type="text"
                placeholder="React, Python, C++, SQL"
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                className="pf-input"
              />
            </div>
          </div>

          <div className="pf-resume-section">
            <span className="pf-resume-label">Resume / CV</span>

            {!profile?.resume_url && (
              <div className="pf-resume-upload-empty">
                <span>{uploading ? "Uploading file, please wait..." : "No resume uploaded yet (PDF, max 2MB)"}</span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleResumeUpload}
                  style={{ display: "none" }}
                  id="resume-file-input"
                />
                <label htmlFor="resume-file-input" className="pf-resume-btn">
                  {uploading ? "Uploading..." : "Add"}
                </label>
              </div>
            )}

            {profile?.resume_url && (
              <div className="pf-resume-row">
                <div className="pf-resume-info">
                  <span className="pf-resume-icon" aria-hidden="true">📄</span>
                  <span className="pf-resume-name">{resumeFileName}</span>
                </div>
                <div className="pf-resume-actions">
                  {resumeSignedUrl ? (
                    <a href={resumeSignedUrl} target="_blank" rel="noreferrer" className="pf-resume-btn">
                      View
                    </a>
                  ) : (
                    <span className="pf-resume-btn pf-resume-btn-muted">Loading...</span>
                  )}
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeUpload}
                    style={{ display: "none" }}
                    id="resume-file-replace"
                  />
                  <label htmlFor="resume-file-replace" className="pf-resume-btn pf-resume-btn-muted">
                    {uploading ? "Uploading..." : "Add"}
                  </label>
                  <button
                    type="button"
                    onClick={handleDeleteResume}
                    disabled={uploading}
                    className="pf-resume-btn pf-resume-btn-danger"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          <button type="submit" disabled={updatingProfile} className="pf-save-btn">
            {updatingProfile ? "Saving changes..." : "Save profile details"}
          </button>
        </form>
      </div>

      {profile?.role === "admin" && (
        <div className="pf-admin-panel">
          <button onClick={() => navigate("/admin")} className="pf-admin-btn">
            Go to Admin Panel
          </button>
        </div>
      )}
    </div>
  );
}