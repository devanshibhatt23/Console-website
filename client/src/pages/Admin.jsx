import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getEvents, createEvent } from "../services/eventService";
import { getProblems, createProblem } from "../services/problemService";
import { uploadEventImage } from "../services/storageService";

export default function Admin() {
  const navigate = useNavigate();
  const { profile, loading: authLoading } = useAuth();
  
  // Navigation tabs: 'events' or 'potd'
  const [activeTab, setActiveTab] = useState("events");
  
  // Lists
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [problems, setProblems] = useState([]);
  const [loadingProblems, setLoadingProblems] = useState(true);
  
  // Event Form fields
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // POTD Form fields
  const [potdTitle, setPotdTitle] = useState("");
  const [potdDate, setPotdDate] = useState(new Date().toISOString().split("T")[0]);
  const [potdDifficulty, setPotdDifficulty] = useState("Medium");
  const [potdDescription, setPotdDescription] = useState("");
  const [potdSolution, setPotdSolution] = useState("");
  
  // Action indicators
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Redirect if not an admin once profile loads
  useEffect(() => {
    if (!authLoading) {
      if (!profile || (profile.role !== "admin" && profile.role !== "super_admin")) {
        alert("Access Denied: You do not have permission to view the Admin panel.");
        navigate("/dashboard");
      } else {
        loadEvents();
        loadProblems();
      }
    }
  }, [profile, authLoading]);

  async function loadEvents() {
    try {
      setLoadingEvents(true);
      const data = await getEvents();
      setEvents(data || []);
    } catch (err) {
      console.error("Error loading events:", err.message);
    } finally {
      setLoadingEvents(false);
    }
  }

  async function loadProblems() {
    try {
      setLoadingProblems(true);
      const data = await getProblems();
      setProblems(data || []);
    } catch (err) {
      console.error("Error loading POTDs:", err.message);
    } finally {
      setLoadingProblems(false);
    }
  }

  async function handleImageFileChange(e) {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please choose a valid image file (PNG/JPG).");
      return;
    }

    setUploadingImage(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const publicUrl = await uploadEventImage(file);
      setUploadedImageUrl(publicUrl);
      setSuccessMsg("Event banner uploaded successfully!");
    } catch (err) {
      setErrorMsg("Banner upload failed: " + err.message);
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleCreateEvent(e) {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!eventTitle || !eventDate || !eventVenue) {
      setErrorMsg("Event Title, Date, and Venue are required.");
      return;
    }

    setSubmitting(true);

    try {
      const eventPayload = {
        title: eventTitle.trim(),
        event_date: new Date(eventDate).toISOString(),
        venue: eventVenue.trim(),
        description: eventDescription.trim() || null,
        image_url: uploadedImageUrl || null,
      };

      await createEvent(eventPayload);
      
      setSuccessMsg("New event scheduled successfully!");
      
      // Clear event form fields
      setEventTitle("");
      setEventDate("");
      setEventVenue("");
      setEventDescription("");
      setUploadedImageUrl("");
      
      // Reload events list
      await loadEvents();
    } catch (err) {
      setErrorMsg("Failed to schedule event: " + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCreatePOTD(e) {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!potdTitle || !potdDate || !potdDescription) {
      setErrorMsg("POTD Title, Date, and Description are required.");
      return;
    }

    setSubmitting(true);

    try {
      const potdPayload = {
        title: potdTitle.trim(),
        date: potdDate, // Format: YYYY-MM-DD
        difficulty: potdDifficulty,
        description: potdDescription.trim(),
        solution: potdSolution.trim() || null,
      };

      await createProblem(potdPayload);

      setSuccessMsg("Problem of the Day published successfully!");

      // Clear POTD form fields
      setPotdTitle("");
      setPotdDate(new Date().toISOString().split("T")[0]);
      setPotdDifficulty("Medium");
      setPotdDescription("");
      setPotdSolution("");

      // Reload problems list
      await loadProblems();
    } catch (err) {
      setErrorMsg("Failed to publish POTD: " + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
        <h3>Authenticating Administrator...</h3>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 20px", textAlign: "left", maxWidth: "1000px", margin: "0 auto" }}>
      {/* Header section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid var(--border)", paddingBottom: "20px" }}>
        <div>
          <h1 style={{ fontSize: "32px", margin: "0 0 5px", letterSpacing: "-0.5px" }}>Admin Panel</h1>
          <p style={{ color: "var(--text)", fontSize: "14px" }}>Schedule events, publish Problem of the Day challenges, and manage portal resources</p>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
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
          Back to Dashboard
        </button>
      </div>

      {/* Tabs navigation */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "30px", borderBottom: "1px solid var(--border)" }}>
        <button
          onClick={() => { setActiveTab("events"); setSuccessMsg(""); setErrorMsg(""); }}
          style={{
            padding: "10px 20px",
            background: "transparent",
            border: "none",
            borderBottom: activeTab === "events" ? "2px solid var(--accent)" : "none",
            color: activeTab === "events" ? "var(--accent)" : "var(--text)",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "600",
          }}
        >
          Events Planner
        </button>
        <button
          onClick={() => { setActiveTab("potd"); setSuccessMsg(""); setErrorMsg(""); }}
          style={{
            padding: "10px 20px",
            background: "transparent",
            border: "none",
            borderBottom: activeTab === "potd" ? "2px solid var(--accent)" : "none",
            color: activeTab === "potd" ? "var(--accent)" : "var(--text)",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "600",
          }}
        >
          POTD Publisher
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

      {activeTab === "events" ? (
        /* Event Manager Tab */
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr", gap: "40px" }}>
          {/* Create Event Section */}
          <div style={{ padding: "30px", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--code-bg)" }}>
            <h2 style={{ fontSize: "20px", marginBottom: "20px", borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>Schedule New Event</h2>
            
            <form onSubmit={handleCreateEvent}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "var(--text)", marginBottom: "6px" }}>Event Title</label>
                <input
                  type="text"
                  placeholder="e.g. CodeSprint 2026"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  required
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-h)" }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "var(--text)", marginBottom: "6px" }}>Date & Time</label>
                <input
                  type="datetime-local"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-h)", fontFamily: "var(--mono)" }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "var(--text)", marginBottom: "6px" }}>Venue</label>
                <input
                  type="text"
                  placeholder="e.g. Seminar Hall, CSE Dept"
                  value={eventVenue}
                  onChange={(e) => setEventVenue(e.target.value)}
                  required
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-h)" }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "var(--text)", marginBottom: "6px" }}>Description</label>
                <textarea
                  placeholder="Write a brief overview of the hackathon/session..."
                  rows="4"
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-h)", resize: "none" }}
                />
              </div>

              {/* Event banner upload */}
              <div style={{ marginBottom: "25px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "var(--text)", marginBottom: "6px" }}>Event Banner Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  style={{ display: "none" }}
                  id="banner-image-input"
                />
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <label
                    htmlFor="banner-image-input"
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px",
                      background: "var(--accent-bg)",
                      color: "var(--accent)",
                      border: "1px solid var(--accent-border)",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    {uploadingImage ? "Uploading..." : "Upload Image"}
                  </label>
                  {uploadedImageUrl && (
                    <span style={{ fontSize: "13px", color: "green", fontWeight: "500" }}>✓ Banner Attached</span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || uploadingImage}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "6px",
                  border: "none",
                  background: "var(--accent)",
                  color: "#fff",
                  fontWeight: "600",
                  cursor: (submitting || uploadingImage) ? "not-allowed" : "pointer",
                  opacity: (submitting || uploadingImage) ? 0.7 : 1,
                }}
              >
                {submitting ? "Scheduling Event..." : "Publish Event"}
              </button>
            </form>
          </div>

          {/* Existing Events List */}
          <div>
            <h2 style={{ fontSize: "20px", marginBottom: "20px", borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>Scheduled Events</h2>
            {loadingEvents ? (
              <p style={{ color: "var(--text)" }}>Fetching events...</p>
            ) : events.length === 0 ? (
              <p style={{ color: "var(--text)" }}>No events currently scheduled.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    style={{
                      padding: "20px",
                      borderRadius: "10px",
                      border: "1px solid var(--border)",
                      background: "var(--code-bg)",
                      display: "flex",
                      gap: "15px",
                    }}
                  >
                    {evt.image_url && (
                      <img
                        src={evt.image_url}
                        alt={evt.title}
                        style={{ width: "90px", height: "90px", objectFit: "cover", borderRadius: "6px", border: "1px solid var(--border)" }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: "0 0 5px", fontSize: "17px", color: "var(--text-h)", fontWeight: "600" }}>{evt.title}</h3>
                      <p style={{ fontSize: "13px", color: "var(--accent)", fontWeight: "600", marginBottom: "4px", fontFamily: "var(--mono)" }}>
                        📅 {new Date(evt.event_date).toLocaleString()}
                      </p>
                      <p style={{ fontSize: "13px", color: "var(--text-h)", fontWeight: "500", marginBottom: "8px" }}>
                        📍 {evt.venue}
                      </p>
                      {evt.description && (
                        <p style={{ fontSize: "13px", color: "var(--text)", lineHeight: "140%" }}>{evt.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* POTD Publisher Tab */
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr", gap: "40px" }}>
          {/* Create POTD Section */}
          <div style={{ padding: "30px", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--code-bg)" }}>
            <h2 style={{ fontSize: "20px", marginBottom: "20px", borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>Publish POTD</h2>
            
            <form onSubmit={handleCreatePOTD}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "var(--text)", marginBottom: "6px" }}>Problem Title</label>
                <input
                  type="text"
                  placeholder="e.g. Reverse a Linked List"
                  value={potdTitle}
                  onChange={(e) => setPotdTitle(e.target.value)}
                  required
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-h)" }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "var(--text)", marginBottom: "6px" }}>Schedule Date</label>
                <input
                  type="date"
                  value={potdDate}
                  onChange={(e) => setPotdDate(e.target.value)}
                  required
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-h)", fontFamily: "var(--mono)" }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "var(--text)", marginBottom: "6px" }}>Difficulty</label>
                <select
                  value={potdDifficulty}
                  onChange={(e) => setPotdDifficulty(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-h)", outline: "none" }}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "var(--text)", marginBottom: "6px" }}>Description</label>
                <textarea
                  placeholder="Write the full problem description, input formats, constraints, and sample cases..."
                  rows="6"
                  value={potdDescription}
                  onChange={(e) => setPotdDescription(e.target.value)}
                  required
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-h)", resize: "none" }}
                />
              </div>

              <div style={{ marginBottom: "25px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "var(--text)", marginBottom: "6px" }}>Solution Code / Text (optional)</label>
                <textarea
                  placeholder="Insert solution code template or explanation details (will be hidden from standard users until next day)..."
                  rows="4"
                  value={potdSolution}
                  onChange={(e) => setPotdSolution(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-h)", fontFamily: "var(--mono)", resize: "none" }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "6px",
                  border: "none",
                  background: "var(--accent)",
                  color: "#fff",
                  fontWeight: "600",
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? "Publishing POTD..." : "Publish POTD"}
              </button>
            </form>
          </div>

          {/* Existing POTDs List */}
          <div>
            <h2 style={{ fontSize: "20px", marginBottom: "20px", borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>Published POTD History</h2>
            {loadingProblems ? (
              <p style={{ color: "var(--text)" }}>Fetching POTD problems...</p>
            ) : problems.length === 0 ? (
              <p style={{ color: "var(--text)" }}>No Problem of the Day currently published.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {problems.map((prob) => (
                  <div
                    key={prob.id}
                    style={{
                      padding: "20px",
                      borderRadius: "10px",
                      border: "1px solid var(--border)",
                      background: "var(--code-bg)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <h3 style={{ margin: "0", fontSize: "17px", color: "var(--text-h)", fontWeight: "600" }}>{prob.title}</h3>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          textTransform: "uppercase",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          background:
                            prob.difficulty === "Easy"
                              ? "rgba(34, 197, 94, 0.15)"
                              : prob.difficulty === "Hard"
                              ? "rgba(239, 68, 68, 0.15)"
                              : "rgba(234, 179, 8, 0.15)",
                          color:
                            prob.difficulty === "Easy"
                              ? "#22c55e"
                              : prob.difficulty === "Hard"
                              ? "#ef4444"
                              : "#eab308",
                        }}
                      >
                        {prob.difficulty}
                      </span>
                    </div>
                    
                    <p style={{ fontSize: "13px", color: "var(--accent)", fontWeight: "600", marginBottom: "8px", fontFamily: "var(--mono)" }}>
                      📅 Scheduled: {prob.date}
                    </p>
                    
                    <p style={{ fontSize: "13px", color: "var(--text)", lineHeight: "140%", whiteSpace: "pre-wrap" }}>
                      {prob.description.length > 200 ? prob.description.slice(0, 200) + "..." : prob.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}