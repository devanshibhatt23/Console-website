import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { uploadResume, getResumeUrl, deleteResume } from "../services/storageService";
import { updateProfile } from "../services/ProfileService";
import { signOut } from "../services/auth";
import { useNavigate } from "react-router-dom";

// POTD and Discussion Services
import { getPOTD } from "../services/problemService";
import { submitSolution, getMySubmissions } from "../services/submissionService";
import { addComment, getComments, deleteComment } from "../services/commentService";
import { supabase } from "../lib/supabase.js";

// Deterministic fallback ID based on date for daily chat
function getDailyFallbackId() {
  const dateStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const parts = dateStr.split("-");
  const year = parseInt(parts[0]).toString(16).padStart(8, '0');
  const month = parseInt(parts[1]).toString(16).padStart(4, '0');
  const day = parseInt(parts[2]).toString(16).padStart(12, '0');
  return `${year}-0000-${month}-0000-${day}`;
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
  const [name, setName] = useState("");
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
  const [submissionStatus, setSubmissionStatus] = useState("Correct");
  const [submissionAttempts, setSubmissionAttempts] = useState(1);
  const [submittingSolution, setSubmittingSolution] = useState(false);

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
    }
  }, [activeSection, user]);

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

    // Validate Name is provided (required to complete profile)
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

  async function handleAddComment(e) {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    setAddingComment(true);
    setSuccessMsg("");
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

  async function handleSolutionSubmit(e) {
    e.preventDefault();
    if (!potd || !user) return;

    setSubmittingSolution(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      await submitSolution(user.id, potd.id, submissionStatus, submissionAttempts);
      setSuccessMsg("POTD Solution submitted successfully!");
      await loadUserSubmissions();
    } catch (err) {
      setErrorMsg("Failed to submit solution: " + err.message);
    } finally {
      setSubmittingSolution(false);
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
      ) : (
        /* Daily POTD and Discussions Section */
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1.4fr", gap: "40px" }}>
          {/* POTD Description */}
          <div>
            <h2 style={{ fontSize: "20px", marginBottom: "20px", borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>Today's Coding Challenge</h2>
            
            {loadingPOTD ? (
              <p style={{ color: "var(--text)" }}>Fetching today's problem details...</p>
            ) : !potd ? (
              <div style={{ padding: "30px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--code-bg)", textAlign: "center" }}>
                <span style={{ fontSize: "48px" }}>🍵</span>
                <h3 style={{ margin: "10px 0 5px", color: "var(--text-h)" }}>Take a Break!</h3>
                <p style={{ color: "var(--text)", fontSize: "14px" }}>No Problem of the Day has been published for today. Check back later!</p>
              </div>
            ) : (
              <div>
                <div style={{ padding: "30px", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--code-bg)", marginBottom: "30px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                    <h3 style={{ margin: "0", fontSize: "22px", color: "var(--text-h)" }}>{potd.title}</h3>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        padding: "4px 10px",
                        borderRadius: "4px",
                        background:
                          potd.difficulty === "Easy"
                            ? "rgba(34, 197, 94, 0.15)"
                            : potd.difficulty === "Hard"
                            ? "rgba(239, 68, 68, 0.15)"
                            : "rgba(234, 179, 8, 0.15)",
                        color:
                          potd.difficulty === "Easy"
                            ? "#22c55e"
                            : potd.difficulty === "Hard"
                            ? "#ef4444"
                            : "#eab308",
                      }}
                    >
                      {potd.difficulty}
                    </span>
                  </div>
                            <p style={{ color: "var(--accent)", fontSize: "13px", fontWeight: "600", fontFamily: "var(--mono)", marginBottom: "8px" }}>
                    📅 Challenge Date: {potd.date}
                  </p>
                  
                  <p style={{ color: "var(--text)", fontSize: "13px", fontFamily: "var(--mono)", marginBottom: "15px" }}>
                    🕒 Uploaded at: {new Date(potd.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>

                  {potd.solution && (
                    <a 
                      href={potd.solution} 
                      target="_blank" 
                      rel="noreferrer" 
                      style={{ display: "inline-block", color: "#3b82f6", fontWeight: "600", marginBottom: "20px", textDecoration: "underline" }}
                    >
                      Today's problem
                    </a>
                  )}

                  <div style={{ fontSize: "15px", lineHeight: "160%", color: "var(--text-h)", whiteSpace: "pre-wrap", borderTop: "1px solid var(--border)", paddingTop: "15px" }}>
                    {potd.description}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Discussion Thread (Chat Portal) */}
          <div style={{ display: "flex", flexDirection: "column", height: "100%", maxHeight: "650px" }}>
            <h2 style={{ fontSize: "20px", marginBottom: "20px", borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>
              {potd ? "POTD Discussion" : "Daily Dev Chat"}
            </h2>
            
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                padding: "25px",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                background: "var(--code-bg)",
              }}
            >
              <div style={{ padding: "10px", marginBottom: "15px", borderRadius: "8px", background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.2)", fontSize: "12px", color: "var(--text)", lineHeight: "1.5" }}>
                <span style={{ fontWeight: "700", color: "#ef4444" }}>Note:</span> Any user who sends any inappropriate message will be permanently banned from the website. Only discuss questions, methods, and approaches here. Do not share the whole code here.
              </div>
              {/* Chat Message Box */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  marginBottom: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                  maxHeight: "400px",
                  paddingRight: "5px",
                }}
              >
                {comments.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text)", fontSize: "14px" }}>
                    💬 No ideas shared yet. Be the first to start the discussion!
                  </div>
                ) : (
                  comments.map((cmt) => {
                    const isOwner = cmt.user_id === user?.id;
                    const isAdmin = profile?.role === "admin" || profile?.role === "super_admin";
                    
                    return (
                      <div
                        key={cmt.id}
                        style={{
                          padding: "10px 14px",
                          borderRadius: "12px",
                          background: isOwner ? "var(--accent-bg)" : "var(--bg)",
                          border: `1px solid ${isOwner ? "var(--accent-border)" : "var(--border)"}`,
                          position: "relative",
                          alignSelf: isOwner ? "flex-end" : "flex-start",
                          maxWidth: "85%",
                          borderBottomRightRadius: isOwner ? "2px" : "12px",
                          borderBottomLeftRadius: isOwner ? "12px" : "2px",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-h)" }}>
                              {cmt.profiles?.name || "Anonymous coder"}
                            </span>
                            {cmt.profiles?.role && cmt.profiles.role !== "member" && (
                              <span style={{ fontSize: "10px", fontWeight: "700", background: "var(--accent-bg)", color: "var(--accent)", padding: "1px 6px", borderRadius: "4px" }}>
                                {cmt.profiles.role.toUpperCase()}
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: "11px", color: "var(--text)", fontFamily: "var(--mono)" }}>
                            {new Date(cmt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <p style={{ fontSize: "14px", color: "var(--text-h)", margin: "0", lineHeight: "140%", whiteSpace: "pre-wrap" }}>
                          {cmt.content}
                        </p>

                        {(isOwner || isAdmin) && (
                          <button
                            onClick={() => handleDeleteComment(cmt.id)}
                            style={{
                              position: "absolute",
                              top: "10px",
                              right: "10px",
                              padding: "2px 6px",
                              fontSize: "11px",
                              background: "rgba(239, 68, 68, 0.1)",
                              border: "1px solid rgba(239, 68, 68, 0.3)",
                              color: "#ef4444",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message input form */}
              <form onSubmit={handleAddComment} style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  placeholder="Share your approach, runtime details, or questions..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  required
                  disabled={addingComment}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    background: "var(--bg)",
                    color: "var(--text-h)",
                    outline: "none",
                    fontSize: "14px",
                  }}
                />
                <button
                  type="submit"
                  disabled={addingComment || !newCommentText.trim()}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "8px",
                    border: "none",
                    background: "var(--accent)",
                    color: "#fff",
                    fontWeight: "600",
                    cursor: (addingComment || !newCommentText.trim()) ? "not-allowed" : "pointer",
                    opacity: (addingComment || !newCommentText.trim()) ? 0.7 : 1,
                  }}
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Live Leaderboard Placeholder */}
      {activeSection === "potd" && (
        <div style={{ marginTop: "40px", padding: "30px", borderRadius: "12px", border: "1px dashed var(--border)", background: "var(--code-bg)", textAlign: "center" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "10px", color: "var(--text-h)" }}>Live Leaderboard</h2>
          <p style={{ color: "var(--text)", fontSize: "14px", margin: "0" }}>Live Leaderboard section will be added later.</p>
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