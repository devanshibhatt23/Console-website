import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getEventsWithImages, createEvent, deleteEvent, addEventImages, deleteEventImage } from "../services/eventService";
import { getProblems, createProblem, deleteProblem } from "../services/problemService";
import { uploadEventImage } from "../services/storageService";
import { getResources, createResource, deleteResource } from "../services/resourceService";
import { DOMAINS } from "../data/resourcesData";

function getLocalDateString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function Admin() {
  const navigate = useNavigate();
  const { profile, loading: authLoading } = useAuth();
  
  // Navigation tabs: 'events', 'potd', 'resources'
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
  
  // Gallery images form fields
  const [uploadedGalleryUrls, setUploadedGalleryUrls] = useState([]);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  
  // POTD Form fields
  const [potdTitle, setPotdTitle] = useState("");
  const [potdDate, setPotdDate] = useState(getLocalDateString());
  const [potdDifficulty, setPotdDifficulty] = useState("Medium");
  const [potdDescription, setPotdDescription] = useState("");
  const [potdSolution, setPotdSolution] = useState("");
  
  // Resources state
  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [resDomain, setResDomain] = useState("cpp-programming");
  const [resWeek, setResWeek] = useState(1);
  const [resOrder, setResOrder] = useState(1);
  const [resTitle, setResTitle] = useState("");
  const [resUrl, setResUrl] = useState("");
  const [resDescription, setResDescription] = useState("");
  const [resType, setResType] = useState("article");

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
        loadResources();
      }
    }
  }, [profile, authLoading]);

  async function loadEvents() {
    try {
      setLoadingEvents(true);
      const data = await getEventsWithImages();
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

  async function loadResources() {
    try {
      setLoadingResources(true);
      const data = await getResources();
      setResources(data || []);
    } catch (err) {
      console.error("Error loading resources:", err.message);
    } finally {
      setLoadingResources(false);
    }
  }

  async function handleCreateResource(e) {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await createResource({
        domain: resDomain,
        category: resDomain,
        title: resTitle,
        url: resUrl,
        description: resDescription,
        week_number: resWeek,
        order_in_week: resOrder,
        type: resType,
      });
      setSuccessMsg(`Resource "${resTitle}" added successfully!`);
      setResTitle("");
      setResUrl("");
      setResDescription("");
      setResWeek(1);
      setResOrder(1);
      await loadResources();
    } catch (err) {
      setErrorMsg("Failed to add resource: " + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteResource(id) {
    if (!window.confirm("Delete this resource? This cannot be undone.")) return;
    try {
      await deleteResource(id);
      setResources((prev) => prev.filter((r) => r.id !== id));
      setSuccessMsg("Resource deleted.");
    } catch (err) {
      setErrorMsg("Failed to delete resource: " + err.message);
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

  async function handleGalleryFilesChange(e) {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);

    const invalidFile = files.find(file => !file.type.startsWith("image/"));
    if (invalidFile) {
      setErrorMsg("All selected files must be valid image files (PNG/JPG).");
      return;
    }

    setUploadingGallery(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const uploadPromises = files.map(file => uploadEventImage(file));
      const urls = await Promise.all(uploadPromises);
      setUploadedGalleryUrls(prev => [...prev, ...urls]);
      setSuccessMsg(`${urls.length} gallery image(s) uploaded successfully!`);
    } catch (err) {
      setErrorMsg("Gallery upload failed: " + err.message);
    } finally {
      setUploadingGallery(false);
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

      const createdEvents = await createEvent(eventPayload);
      const newEventId = createdEvents?.[0]?.id;

      if (newEventId && uploadedGalleryUrls.length > 0) {
        const galleryPayload = uploadedGalleryUrls.map(url => ({
          event_id: newEventId,
          image_url: url
        }));
        await addEventImages(galleryPayload);
      }
      
      setSuccessMsg("New event scheduled with gallery successfully!");
      
      // Clear event form fields
      setEventTitle("");
      setEventDate("");
      setEventVenue("");
      setEventDescription("");
      setUploadedImageUrl("");
      setUploadedGalleryUrls([]);
      
      // Reload events list
      await loadEvents();
    } catch (err) {
      setErrorMsg("Failed to schedule event: " + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteGalleryImage(imageId) {
    try {
      await deleteEventImage(imageId);
      setSuccessMsg("Gallery image removed successfully.");
      await loadEvents();
    } catch (err) {
      setErrorMsg("Failed to remove gallery image: " + err.message);
    }
  }

  async function handleAddGalleryImageToEvent(e, eventId) {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);

    const invalidFile = files.find(file => !file.type.startsWith("image/"));
    if (invalidFile) {
      setErrorMsg("All files must be valid images (PNG/JPG).");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const uploadPromises = files.map(file => uploadEventImage(file));
      const urls = await Promise.all(uploadPromises);

      const galleryPayload = urls.map(url => ({
        event_id: eventId,
        image_url: url
      }));

      await addEventImages(galleryPayload);
      setSuccessMsg(`Added ${urls.length} image(s) to the gallery!`);
      await loadEvents();
    } catch (err) {
      setErrorMsg("Failed to add image(s) to gallery: " + err.message);
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
      const solutionUrl = potdSolution.trim();
      let platform = null;
      if (solutionUrl.toLowerCase().includes("leetcode.com")) {
        platform = "leetcode";
      } else if (solutionUrl.toLowerCase().includes("codeforces.com")) {
        platform = "codeforces";
      }

      const potdPayload = {
        title: potdTitle.trim(),
        date: potdDate, // Format: YYYY-MM-DD
        difficulty: potdDifficulty,
        description: potdDescription.trim(),
        solution: solutionUrl || null,
        platform: platform,
        posted_at: new Date().toISOString()
      };

      await createProblem(potdPayload);

      setSuccessMsg("Problem of the Day published successfully!");

      // Clear POTD form fields
      setPotdTitle("");
      setPotdDate(getLocalDateString());
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

  async function handleDeleteEvent(eventId) {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await deleteEvent(eventId);
      setSuccessMsg("Event deleted successfully.");
      await loadEvents();
    } catch (err) {
      setErrorMsg("Failed to delete event: " + err.message);
    }
  }

  async function handleDeleteProblem(problemId) {
    if (!window.confirm("Are you sure you want to delete this problem?")) return;
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await deleteProblem(problemId);
      setSuccessMsg("Problem deleted successfully.");
      await loadProblems();
    } catch (err) {
      setErrorMsg("Failed to delete problem: " + err.message);
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
        <button
          onClick={() => { setActiveTab("resources"); setSuccessMsg(""); setErrorMsg(""); }}
          style={{
            padding: "10px 20px",
            background: "transparent",
            border: "none",
            borderBottom: activeTab === "resources" ? "2px solid var(--accent)" : "none",
            color: activeTab === "resources" ? "var(--accent)" : "var(--text)",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "600",
          }}
        >
          📚 Resources
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

      {activeTab === "events" && (
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
              <              {/* Event banner upload */}
              <div style={{ marginBottom: "20px" }}>
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

              {/* Event gallery uploads */}
              <div style={{ marginBottom: "25px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "var(--text)", marginBottom: "6px" }}>Event Gallery Photos (Multiple)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryFilesChange}
                  style={{ display: "none" }}
                  id="gallery-images-input"
                />
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <label
                    htmlFor="gallery-images-input"
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
                    {uploadingGallery ? "Uploading..." : "Upload Gallery Photos"}
                  </label>
                  {uploadedGalleryUrls.length > 0 && (
                    <span style={{ fontSize: "13px", color: "green", fontWeight: "500" }}>✓ {uploadedGalleryUrls.length} image(s) attached</span>
                  )}
                </div>

                {uploadedGalleryUrls.length > 0 && (
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
                    {uploadedGalleryUrls.map((url, i) => (
                      <div key={i} style={{ position: "relative", width: "50px", height: "50px", borderRadius: "6px", overflow: "hidden", border: "1px solid var(--border)" }}>
                        <img src={url} alt={`Gallery temp ${i}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <button
                          type="button"
                          onClick={() => setUploadedGalleryUrls(prev => prev.filter((_, idx) => idx !== i))}
                          style={{
                            position: "absolute", top: "2px", right: "2px",
                            background: "rgba(239, 68, 68, 0.9)", color: "#fff", border: "none",
                            borderRadius: "50%", width: "14px", height: "14px",
                            fontSize: "8px", cursor: "pointer", display: "flex",
                            alignItems: "center", justifyContent: "center"
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting || uploadingImage || uploadingGallery}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "6px",
                  border: "none",
                  background: "var(--accent)",
                  color: "#fff",
                  fontWeight: "600",
                  cursor: (submitting || uploadingImage || uploadingGallery) ? "not-allowed" : "pointer",
                  opacity: (submitting || uploadingImage || uploadingGallery) ? 0.7 : 1,
                }}
              >
                {submitting ? "Scheduling Event..." : "Publish Event"}
              </button>
            </form>
          </div>     </div>

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
                      flexDirection: "column",
                      gap: "15px",
                    }}
                  >
                    <div style={{ display: "flex", gap: "15px" }}>
                      {evt.image_url && (
                        <img
                          src={evt.image_url}
                          alt={evt.title}
                          style={{ width: "90px", height: "90px", objectFit: "cover", borderRadius: "6px", border: "1px solid var(--border)" }}
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <h3 style={{ margin: "0 0 5px", fontSize: "17px", color: "var(--text-h)", fontWeight: "600" }}>{evt.title}</h3>
                          <button
                            onClick={() => handleDeleteEvent(evt.id)}
                            style={{
                              padding: "3px 8px",
                              fontSize: "11px",
                              background: "rgba(239, 68, 68, 0.1)",
                              border: "1px solid rgba(239, 68, 68, 0.3)",
                              color: "#ef4444",
                              borderRadius: "4px",
                              cursor: "pointer"
                            }}
                          >
                            Delete Event
                          </button>
                        </div>
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

                    {/* Manage event gallery photos */}
                    <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px", marginTop: "5px" }}>
                      <h4 style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-h)", marginBottom: "8px" }}>
                        Event Gallery ({evt.event_images?.length || 0} photos)
                      </h4>
                      
                      {/* List of existing gallery images */}
                      {evt.event_images && evt.event_images.length > 0 ? (
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
                          {evt.event_images.map((img) => (
                            <div key={img.id} style={{ position: "relative", width: "65px", height: "65px", borderRadius: "6px", overflow: "hidden", border: "1px solid var(--border)" }}>
                              <img src={img.image_url} alt="Gallery item" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              <button
                                type="button"
                                onClick={() => handleDeleteGalleryImage(img.id)}
                                style={{
                                  position: "absolute", top: "2px", right: "2px",
                                  background: "rgba(239, 68, 68, 0.95)", color: "#fff", border: "none",
                                  borderRadius: "50%", width: "16px", height: "16px",
                                  fontSize: "9px", cursor: "pointer", display: "flex",
                                  alignItems: "center", justifyContent: "center"
                                }}
                                title="Delete from gallery"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontSize: "12px", color: "var(--text)", marginBottom: "12px" }}>No photos in gallery.</p>
                      )}

                      {/* Add photos to existing event */}
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleAddGalleryImageToEvent(e, evt.id)}
                          style={{ display: "none" }}
                          id={`add-gallery-photos-${evt.id}`}
                        />
                        <label
                          htmlFor={`add-gallery-photos-${evt.id}`}
                          style={{
                            display: "inline-flex",
                            padding: "6px 12px",
                            borderRadius: "4px",
                            background: "var(--social-bg)",
                            border: "1px solid var(--border)",
                            color: "var(--text-h)",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "background 0.2s"
                          }}
                        >
                          + Add Photos to Gallery
                        </label>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {activeTab === "potd" && (
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
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "var(--text)", marginBottom: "6px" }}>Problem Link (LC/CF URL)</label>
                <input
                  type="url"
                  placeholder="https://leetcode.com/problems/..."
                  value={potdSolution}
                  onChange={(e) => setPotdSolution(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-h)", fontFamily: "var(--mono)" }}
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
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <button
                          onClick={() => handleDeleteProblem(prob.id)}
                          style={{
                            padding: "3px 8px",
                            fontSize: "11px",
                            background: "rgba(239, 68, 68, 0.1)",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            color: "#ef4444",
                            borderRadius: "4px",
                            cursor: "pointer"
                          }}
                        >
                          Delete
                        </button>
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
      {activeTab === "resources" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr", gap: "40px" }}>
          {/* Create Resource Form */}
          <div style={{ padding: "30px", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--code-bg)" }}>
            <h2 style={{ fontSize: "20px", marginBottom: "20px", borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>Add Resource</h2>
            <form onSubmit={handleCreateResource}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "var(--text)", marginBottom: "6px" }}>Domain</label>
                <select
                  value={resDomain}
                  onChange={(e) => setResDomain(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-h)", fontSize: "14px" }}
                >
                  {DOMAINS.map((d) => (
                    <option key={d.id} value={d.id}>{d.icon} {d.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "15px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "var(--text)", marginBottom: "6px" }}>Module #</label>
                  <input type="number" min="1" max="12" value={resWeek} onChange={(e) => setResWeek(Number(e.target.value))}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-h)" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "var(--text)", marginBottom: "6px" }}>Order</label>
                  <input type="number" min="1" max="20" value={resOrder} onChange={(e) => setResOrder(Number(e.target.value))}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-h)" }} />
                </div>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "var(--text)", marginBottom: "6px" }}>Type</label>
                <select value={resType} onChange={(e) => setResType(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-h)", fontSize: "14px" }}>
                  <option value="video">▶ Video</option>
                  <option value="article">📄 Article</option>
                  <option value="exercise">💪 Exercise</option>
                  <option value="docs">📚 Docs</option>
                  <option value="tool">🔧 Tool</option>
                </select>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "var(--text)", marginBottom: "6px" }}>Title *</label>
                <input type="text" required placeholder="Resource title" value={resTitle} onChange={(e) => setResTitle(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-h)" }} />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "var(--text)", marginBottom: "6px" }}>URL *</label>
                <input type="url" required placeholder="https://..." value={resUrl} onChange={(e) => setResUrl(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-h)" }} />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "var(--text)", marginBottom: "6px" }}>Description</label>
                <textarea placeholder="Short description..." value={resDescription} onChange={(e) => setResDescription(e.target.value)} rows={3}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-h)", resize: "vertical", fontFamily: "inherit", fontSize: "14px" }} />
              </div>
              <button type="submit" disabled={submitting}
                style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "var(--accent)", color: "#fff", border: "none", fontSize: "15px", fontWeight: "700", cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1 }}>
                {submitting ? "Adding..." : "Add Resource"}
              </button>
            </form>
          </div>

          {/* Resources List */}
          <div style={{ padding: "30px", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--code-bg)" }}>
            <h2 style={{ fontSize: "20px", marginBottom: "20px", borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>
              DB Resources ({resources.length})
            </h2>
            {loadingResources ? (
              <p style={{ color: "var(--text)", fontSize: "14px" }}>Loading...</p>
            ) : resources.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text)" }}>
                <p style={{ fontSize: "14px" }}>No resources in DB yet.</p>
                <p style={{ fontSize: "12px", marginTop: "8px" }}>Seed data is used as fallback for users.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "500px", overflowY: "auto" }}>
                {resources.map((res) => (
                  <div key={res.id} style={{ padding: "14px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "4px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "4px", background: "var(--accent-bg)", color: "var(--accent)" }}>{res.domain}</span>
                        <span style={{ fontSize: "11px", color: "var(--text)" }}>Mod {res.week_number} · #{res.order_in_week}</span>
                        <span style={{ fontSize: "11px", color: "var(--text)" }}>{res.type}</span>
                      </div>
                      <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-h)", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{res.title}</p>
                      <a href={res.url} target="_blank" rel="noreferrer" style={{ fontSize: "12px", color: "var(--accent)", textDecoration: "none" }}>↗ Open link</a>
                    </div>
                    <button onClick={() => handleDeleteResource(res.id)}
                      style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)", color: "#ef4444", cursor: "pointer", fontSize: "12px", flexShrink: 0 }}>
                      Delete
                    </button>
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
