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
  const [codeforcesHandle, setCodeforcesHandle] = useState("");
  const [leetcodeHandle, setLeetcodeHandle] = useState("");
  const [updatingProfile, setUpdatingProfile] = useState(false);

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
      setCodeforcesHandle(profile.codeforces_handle || "");
      setLeetcodeHandle(profile.leetcode_handle || "");

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
              <input
                type="text"
                placeholder="Codeforces username"
                value={codeforcesHandle}
                onChange={(e) => setCodeforcesHandle(e.target.value)}
                className="pf-input"
              />
            </div>

            <div className="pf-row">
              <span className="pf-label">LeetCode handle</span>
              <input
                type="text"
                placeholder="LeetCode username"
                value={leetcodeHandle}
                onChange={(e) => setLeetcodeHandle(e.target.value)}
                className="pf-input"
              />
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