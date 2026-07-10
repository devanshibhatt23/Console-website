import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { uploadResume, getResumeUrl, deleteResume } from "../services/storageService";
import { updateProfile } from "../services/ProfileService";
import { signOut } from "../services/auth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();

  // Profile settings state
  const [uploading, setUploading] = useState(false);
  const [resumeSignedUrl, setResumeSignedUrl] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [name, setName] = useState("");
  const [collegeId, setCollegeId] = useState("");
  const [branch, setBranch] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [codeforcesHandle, setCodeforcesHandle] = useState("");
  const [leetcodeHandle, setLeetcodeHandle] = useState("");
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Sync state with profile once loaded
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setCollegeId(profile.college_id || "");
      setBranch(profile.branch || "");
      setGithubUrl(profile.github_url || "");
      setLinkedinUrl(profile.linkedin_url || "");
      setSkillsText(profile.skills ? profile.skills.join(", ") : "");
      setCodeforcesHandle(profile.codeforces_handle || "");
      setLeetcodeHandle(profile.leetcode_handle || "");

      if (profile.resume_url) {
        loadResumeUrl(profile.resume_url);
      } else {
        setResumeSignedUrl("");
      }
    }
  }, [profile]);

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
        branch: branch.trim(),
        github_url: githubUrl.trim(),
        linkedin_url: linkedinUrl.trim(),
        skills: skillsArray,
        codeforces_handle: codeforcesHandle.trim() || null,
        leetcode_handle: leetcodeHandle.trim() || null,
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
          <h1 style={{ fontSize: "32px", margin: "0 0 5px", letterSpacing: "-0.5px" }}>My Profile</h1>
          <p style={{ color: "var(--text)", fontSize: "14px" }}>Manage your profile details, handles, and resume</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {profile?.name && (
            <button
              onClick={() => navigate("/home")}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                background: "var(--accent)",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Go to Home
            </button>
          )}
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

      {/* Profile section */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
        {/* Profile form */}
        <div style={{ padding: "30px", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--code-bg)" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "20px", borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>About You</h2>

          {/* Profile completion banner */}
          {!profile?.name && (
            <div style={{ padding: "12px", marginBottom: "20px", borderRadius: "6px", background: "rgba(251, 191, 36, 0.1)", border: "1px solid rgba(251, 191, 36, 0.3)", color: "#fbbf24", fontSize: "14px" }}>
              ⚠️ Please enter your <strong>Name</strong> to complete your profile and access the rest of the website.
            </div>
          )}

          <form onSubmit={handleUpdateProfile}>
            {/* Name — Required */}
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "var(--text)", marginBottom: "6px" }}>
                Full Name <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: `1px solid ${!name.trim() ? "#ef4444" : "var(--border)"}`, background: "var(--bg)", color: "var(--text-h)" }}
              />
            </div>

            {/* Email — Read Only */}
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "var(--text)", marginBottom: "6px" }}>
                Email Address
              </label>
              <input
                type="email"
                value={profile?.email || user?.email || ""}
                disabled
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", opacity: 0.6, cursor: "not-allowed" }}
              />
            </div>

            {/* College ID — Auto-filled, Read Only */}
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "var(--text)", marginBottom: "6px" }}>
                College ID
              </label>
              <input
                type="text"
                value={collegeId}
                disabled
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", opacity: 0.6, cursor: "not-allowed" }}
              />
              <span style={{ fontSize: "11px", color: "var(--text)", marginTop: "4px", display: "block" }}>
                Auto-filled from your email. Used to determine your year on the leaderboard.
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