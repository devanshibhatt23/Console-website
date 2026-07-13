import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProfile, deriveCollegeIdFromEmail } from "../services/ProfileService";
import { getResumeUrl } from "../services/storageService";
import "./ProfileView.css";

export default function ProfileView() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setError("");
      try {
        const data = await getProfile(userId);
        setProfile(data);
        if (data.resume_url) {
          const url = await getResumeUrl(data.resume_url);
          setResumeUrl(url);
        }
      } catch (err) {
        console.error("Error loading user profile:", err);
        setError("User profile not found or failed to load.");
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      loadProfile();
    }
  }, [userId]);

  if (loading) {
    return <div className="pv-view-loading">Loading developer profile...</div>;
  }

  if (error || !profile) {
    return (
      <div className="pv-error-container">
        <div className="pv-error-card">
          <h2>Error</h2>
          <p>{error || "Developer profile could not be loaded."}</p>
          <button onClick={() => navigate("/search")} className="pv-back-to-search-btn">
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const collegeId = deriveCollegeIdFromEmail(profile.email || "") || profile.college_id || "Not provided";
  const resumeFileName = profile.resume_url
    ? profile.resume_url.split("/").pop().replace(/_\d+(\.[a-zA-Z0-9]+)$/i, "$1")
    : "";

  return (
    <div className="pv-page">
      <div className="pv-topbar">
        <button onClick={() => navigate("/search")} className="pv-back-link">
          &larr; Back to Search
        </button>
      </div>

      <div className="pv-header">
        <div className="pv-avatar">{profile.name ? profile.name.charAt(0).toUpperCase() : "?"}</div>
        <h1 className="pv-title">{profile.name || "Anonymous Member"}</h1>
        <p className="pv-subtitle">Building, learning, and growing with the community.</p>
      </div>

      <div className="pv-card">
        <div className="pv-fields">
          <div className="pv-row">
            <span className="pv-label">Full name</span>
            <span className="pv-value">{profile.name || "Not provided"}</span>
          </div>

          <div className="pv-row">
            <span className="pv-label">College ID</span>
            <span className="pv-value pv-value-muted">{collegeId}</span>
          </div>

          <div className="pv-row">
            <span className="pv-label">GitHub URL</span>
            <span className="pv-value">
              {profile.github_url ? (
                <a href={profile.github_url} target="_blank" rel="noreferrer" className="pv-value-link">
                  View GitHub profile ↗
                </a>
              ) : (
                <span className="pv-value-muted">Not linked</span>
              )}
            </span>
          </div>

          <div className="pv-row">
            <span className="pv-label">LinkedIn URL</span>
            <span className="pv-value">
              {profile.linkedin_url ? (
                <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="pv-value-link">
                  View LinkedIn profile ↗
                </a>
              ) : (
                <span className="pv-value-muted">Not linked</span>
              )}
            </span>
          </div>

          <div className="pv-row">
            <span className="pv-label">Codeforces handle</span>
            <span className="pv-value">
              {profile.codeforces_handle ? (
                <a
                  href={`https://codeforces.com/profile/${profile.codeforces_handle}`}
                  target="_blank"
                  rel="noreferrer"
                  className="pv-value-link"
                >
                  {profile.codeforces_handle} ↗
                </a>
              ) : (
                <span className="pv-value-muted">Not linked</span>
              )}
            </span>
          </div>

          <div className="pv-row">
            <span className="pv-label">LeetCode handle</span>
            <span className="pv-value">
              {profile.leetcode_handle ? (
                <a
                  href={`https://leetcode.com/${profile.leetcode_handle}`}
                  target="_blank"
                  rel="noreferrer"
                  className="pv-value-link"
                >
                  {profile.leetcode_handle} ↗
                </a>
              ) : (
                <span className="pv-value-muted">Not linked</span>
              )}
            </span>
          </div>

          <div className="pv-row">
            <span className="pv-label">Skills</span>
            <span className="pv-value pv-skills-value">
              {profile.skills && profile.skills.length > 0 ? (
                profile.skills.map((skill, index) => (
                  <span key={index} className="pv-skill-chip">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="pv-value-muted">No skills listed yet.</span>
              )}
            </span>
          </div>
        </div>

        <div className="pv-resume-section">
          <span className="pv-resume-label">Resume / CV</span>
          {profile.resume_url ? (
            <div className="pv-resume-row">
              <div className="pv-resume-info">
                <span className="pv-resume-icon" aria-hidden="true">📄</span>
                <span className="pv-resume-name">{resumeFileName}</span>
              </div>
              {resumeUrl ? (
                <a href={resumeUrl} target="_blank" rel="noreferrer" className="pv-resume-btn">
                  View
                </a>
              ) : (
                <span className="pv-resume-btn">Loading...</span>
              )}
            </div>
          ) : (
            <p className="pv-resume-empty">No resume uploaded by this member.</p>
          )}
        </div>
      </div>
    </div>
  );
}
