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
    return <div className="profile-view-loading">Loading developer profile...</div>;
  }

  if (error || !profile) {
    return (
      <div className="profile-view-error-container">
        <div className="error-card">
          <h2>Error</h2>
          <p>{error || "Developer profile could not be loaded."}</p>
          <button onClick={() => navigate("/search")} className="back-to-search-btn">
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const collegeId = deriveCollegeIdFromEmail(profile.email || "") || profile.college_id || "Not Provided";

  return (
    <div className="profile-view-container">
      <div className="profile-view-card">
        <header className="profile-view-header">
          <button onClick={() => navigate("/search")} className="back-link">
            &larr; Back to Search
          </button>
          <div className="avatar-large">
            {profile.name ? profile.name.charAt(0).toUpperCase() : "?"}
          </div>
          <div className="profile-badge">CONSOLE • Community Member</div>
          <h1 className="profile-view-name">{profile.name || "Anonymous Member"}</h1>
          <p className="profile-view-role">Building, learning, and growing with the community.</p>
        </header>

        <div className="profile-view-grid">
          <div className="details-section">
            <h2 className="section-heading">Personal Details</h2>
            <div className="detail-row">
              <span className="detail-label">College ID</span>
              <span className="detail-value">{collegeId}</span>
            </div>
          </div>

          <div className="details-section">
            <h2 className="section-heading">Competitive Coding</h2>
            <div className="detail-row">
              <span className="detail-label">LeetCode</span>
              <span className="detail-value">
                {profile.leetcode_handle ? (
                  <a
                    href={`https://leetcode.com/${profile.leetcode_handle}`}
                    target="_blank"
                    rel="noreferrer"
                    className="profile-link"
                  >
                    {profile.leetcode_handle} ↗
                  </a>
                ) : (
                  "Not Linked"
                )}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Codeforces</span>
              <span className="detail-value">
                {profile.codeforces_handle ? (
                  <a
                    href={`https://codeforces.com/profile/${profile.codeforces_handle}`}
                    target="_blank"
                    rel="noreferrer"
                    className="profile-link"
                  >
                    {profile.codeforces_handle} ↗
                  </a>
                ) : (
                  "Not Linked"
                )}
              </span>
            </div>
          </div>

          <div className="details-section social-section">
            <h2 className="section-heading">Social Channels</h2>
            <div className="detail-row">
              <span className="detail-label">GitHub</span>
              <span className="detail-value">
                {profile.github_url ? (
                  <a href={profile.github_url} target="_blank" rel="noreferrer" className="profile-link">
                    View GitHub Profile ↗
                  </a>
                ) : (
                  "Not Linked"
                )}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">LinkedIn</span>
              <span className="detail-value">
                {profile.linkedin_url ? (
                  <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="profile-link">
                    View LinkedIn Profile ↗
                  </a>
                ) : (
                  "Not Linked"
                )}
              </span>
            </div>
          </div>

          <div className="details-section full-width">
            <h2 className="section-heading">Skills</h2>
            <div className="skills-badge-list">
              {profile.skills && profile.skills.length > 0 ? (
                profile.skills.map((skill, index) => (
                  <span key={index} className="skill-badge">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="no-skills-msg">No skills listed yet.</span>
              )}
            </div>
          </div>

          <div className="details-section full-width resume-section-card">
            <h2 className="section-heading">Resume / CV</h2>
            {resumeUrl ? (
              <div className="resume-download-card">
                <span className="pdf-icon">📄</span>
                <span className="resume-name">
                  {profile.resume_url.split("/").pop().replace(/_\d+\.pdf$/i, ".pdf")}
                </span>
                <a href={resumeUrl} target="_blank" rel="noreferrer" className="resume-view-btn">
                  View Resume
                </a>
              </div>
            ) : (
              <p className="no-resume-msg">No resume uploaded by this member.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
