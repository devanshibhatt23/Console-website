import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getEventsWithImages, createEvent, deleteEvent, addEventImages, deleteEventImage, updateEvent } from "../services/eventService";
import { getProblems, createProblem, deleteProblem } from "../services/problemService";
import { uploadEventImage } from "../services/storageService";
import { getResources, createResource, deleteResource } from "../services/resourceService";
import { DOMAINS } from "../data/resourcesData";
import {
  ArrowLeft, Calendar, Shield, BookOpen, Trash2,
  ExternalLink, Loader2, Plus, X, Upload, MapPin, MessageSquare, Check
} from "lucide-react";
import "./Admin.css";

function getLocalDateString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getApiBase() {
  return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5001"
    : "https://console-website.onrender.com";
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
  const [resDomain, setResDomain] = useState("cpp");
  const [resWeek, setResWeek] = useState(1);
  const [resOrder, setResOrder] = useState(1);
  const [resTitle, setResTitle] = useState("");
  const [resUrl, setResUrl] = useState("");
  const [resDescription, setResDescription] = useState("");
  const [resType, setResType] = useState("article");

  // Quotes state
  const [pendingQuotes, setPendingQuotes] = useState([]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [newQuoteText, setNewQuoteText] = useState("");
  const [newQuoteAuthor, setNewQuoteAuthor] = useState("");
  const [newQuoteDate, setNewQuoteDate] = useState("");
  const [reviewDates, setReviewDates] = useState({});

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
        loadPendingQuotes();
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

  async function loadPendingQuotes() {
    try {
      setLoadingQuotes(true);
      const res = await fetch(`${getApiBase()}/api/motivation-quotes/pending`);
      if (res.ok) {
        const data = await res.json();
        setPendingQuotes(data || []);
      }
    } catch (err) {
      console.error("Error loading quotes:", err.message);
    } finally {
      setLoadingQuotes(false);
    }
  }

  async function handleReviewQuote(id, action, scheduledDate = null) {
    if (!window.confirm(`Are you sure you want to ${action} this quote?`)) return;
    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch(`${getApiBase()}/api/motivation-quotes/${id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, adminUserId: profile.id, scheduledDate })
      });
      if (!res.ok) throw new Error("Failed to review quote");
      setSuccessMsg(`Quote ${action} successfully!`);
      await loadPendingQuotes();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAddQuote(e) {
    e.preventDefault();
    if (!newQuoteText.trim() || !newQuoteAuthor.trim()) return;
    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch(`${getApiBase()}/api/motivation-quotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: profile.id, quote: newQuoteText, authorName: newQuoteAuthor })
      });
      if (!res.ok) throw new Error("Failed to submit quote");
      const { data } = await res.json();
      
      const reviewRes = await fetch(`${getApiBase()}/api/motivation-quotes/${data.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approved", adminUserId: profile.id, scheduledDate: newQuoteDate || null })
      });
      if (!reviewRes.ok) throw new Error("Failed to auto-approve quote");
      
      setSuccessMsg("Quote added and automatically approved!");
      setNewQuoteText("");
      setNewQuoteAuthor("");
      setNewQuoteDate("");
      await loadPendingQuotes();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
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
    if (!navigator.onLine) {
      setErrorMsg("Network Error: You appear to be offline. Please check your connection.");
      return;
    }
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
    if (!navigator.onLine) {
      setErrorMsg("Network Error: You appear to be offline. Please check your connection.");
      return;
    }
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
    if (!navigator.onLine) {
      setErrorMsg("Network Error: You appear to be offline. Please check your connection.");
      return;
    }
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
      
      setSuccessMsg("New event scheduled successfully!");
      
      setEventTitle("");
      setEventDate("");
      setEventVenue("");
      setEventDescription("");
      setUploadedImageUrl("");
      setUploadedGalleryUrls([]);
      
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

  async function handleUpdateEventBanner(e, eventId) {
    if (!navigator.onLine) {
      setErrorMsg("Network Error: You appear to be offline. Please check your connection.");
      return;
    }
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please choose a valid image file (PNG/JPG).");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const publicUrl = await uploadEventImage(file);
      await updateEvent(eventId, { image_url: publicUrl });
      setSuccessMsg("Event banner updated successfully!");
      await loadEvents();
    } catch (err) {
      setErrorMsg("Failed to update event banner: " + err.message);
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
        date: potdDate,
        difficulty: potdDifficulty,
        description: potdDescription.trim(),
        solution: solutionUrl || null,
        platform: platform,
        posted_at: new Date().toISOString()
      };

      await createProblem(potdPayload);

      setSuccessMsg("Problem of the Day published successfully!");

      setPotdTitle("");
      setPotdDate(getLocalDateString());
      setPotdDifficulty("Medium");
      setPotdDescription("");
      setPotdSolution("");

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
      <div className="admin-loading">
        <div className="admin-loading-spinner" />
        <p>Authenticating Administrator...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Background elements */}
      <div className="admin-bg-glow-1" aria-hidden="true" />
      <div className="admin-bg-glow-2" aria-hidden="true" />
      <div className="admin-bg-grid" aria-hidden="true" />

      <div className="admin-shell">
        {/* Header section */}
        <header className="admin-header">
          <div>
            <h1 className="admin-header-title">Admin Panel</h1>
            <p className="admin-header-sub">
              Schedule events, publish Problem of the Day challenges, and manage portal resources
            </p>
          </div>
          <button onClick={() => navigate("/dashboard")} className="admin-btn-back">
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
        </header>

        {/* Tab Navigation */}
        <div className="admin-tabs" role="tablist">
          <button
            onClick={() => { setActiveTab("events"); setSuccessMsg(""); setErrorMsg(""); }}
            className={`admin-tab${activeTab === "events" ? " active" : ""}`}
            role="tab"
            aria-selected={activeTab === "events"}
          >
            <Calendar size={14} /> Events Planner
          </button>
          <button
            onClick={() => { setActiveTab("potd"); setSuccessMsg(""); setErrorMsg(""); }}
            className={`admin-tab${activeTab === "potd" ? " active" : ""}`}
            role="tab"
            aria-selected={activeTab === "potd"}
          >
            <Shield size={14} /> POTD Publisher
          </button>
          <button
            onClick={() => { setActiveTab("resources"); setSuccessMsg(""); setErrorMsg(""); }}
            className={`admin-tab${activeTab === "resources" ? " active" : ""}`}
            role="tab"
            aria-selected={activeTab === "resources"}
          >
            <BookOpen size={14} /> Resources
          </button>
          <button
            onClick={() => { setActiveTab("quotes"); setSuccessMsg(""); setErrorMsg(""); }}
            className={`admin-tab${activeTab === "quotes" ? " active" : ""}`}
            role="tab"
            aria-selected={activeTab === "quotes"}
          >
            <MessageSquare size={14} /> Quotes
          </button>
        </div>

        {/* Messages */}
        {successMsg && (
          <div className="admin-banner admin-banner-success" role="alert">
            ✓ {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="admin-banner admin-banner-error" role="alert">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Event Manager Tab */}
        {activeTab === "events" && (
          <div className="admin-grid">
            {/* Create Event Section */}
            <div className="admin-card">
              <h2 className="admin-card-title">Schedule New Event</h2>
              
              <form onSubmit={handleCreateEvent}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Event Title</label>
                  <input
                    type="text"
                    placeholder="e.g. CodeSprint 2026"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    required
                    className="admin-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                    className="admin-input"
                    style={{ fontFamily: "var(--mono)" }}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Venue</label>
                  <input
                    type="text"
                    placeholder="e.g. Seminar Hall, CSE Dept"
                    value={eventVenue}
                    onChange={(e) => setEventVenue(e.target.value)}
                    required
                    className="admin-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Description</label>
                  <textarea
                    placeholder="Write a brief overview of the hackathon/session..."
                    rows="4"
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    className="admin-textarea"
                  />
                </div>

                {/* Event banner upload */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Event Banner Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    style={{ display: "none" }}
                    id="banner-image-input"
                  />
                  <div className="admin-file-upload-row">
                    <label htmlFor="banner-image-input" className="admin-btn-upload-label">
                      {uploadingImage ? "Uploading..." : "Upload Image"}
                    </label>
                    {uploadedImageUrl && (
                      <span className="admin-status-success">✓ Banner Attached</span>
                    )}
                  </div>
                </div>

                {/* Event gallery uploads */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Event Gallery Photos (Multiple)</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryFilesChange}
                    style={{ display: "none" }}
                    id="gallery-images-input"
                  />
                  <div className="admin-file-upload-row">
                    <label htmlFor="gallery-images-input" className="admin-btn-upload-label">
                      {uploadingGallery ? "Uploading..." : "Upload Gallery Photos"}
                    </label>
                    {uploadedGalleryUrls.length > 0 && (
                      <span className="admin-status-success">✓ {uploadedGalleryUrls.length} image(s) attached</span>
                    )}
                  </div>

                  {uploadedGalleryUrls.length > 0 && (
                    <div className="admin-gallery-preview-grid">
                      {uploadedGalleryUrls.map((url, i) => (
                        <div key={i} className="admin-gallery-preview-item">
                          <img src={url} alt={`Gallery temp ${i}`} className="admin-gallery-preview-img" />
                          <button
                            type="button"
                            onClick={() => setUploadedGalleryUrls(prev => prev.filter((_, idx) => idx !== i))}
                            className="admin-gallery-preview-remove"
                            aria-label="Remove image"
                          >
                            <X size={8} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting || uploadingImage || uploadingGallery}
                  className="admin-btn-primary"
                >
                  {submitting ? "Scheduling Event..." : "Publish Event"}
                </button>
              </form>
            </div>

            {/* Existing Events List */}
            <div className="admin-card">
              <h2 className="admin-card-title">Scheduled Events</h2>
              {loadingEvents ? (
                <p style={{ color: "rgba(255,255,255,0.4)" }}>Fetching events...</p>
              ) : events.length === 0 ? (
                <p style={{ color: "rgba(255,255,255,0.4)" }}>No events currently scheduled.</p>
              ) : (
                <div className="admin-list-container">
                  {events.map((evt) => (
                    <div key={evt.id} className="admin-item-card">
                      <div className="admin-item-top">
                        {/* Banner preview + change button */}
                        <div className="admin-item-banner-wrap">
                          {evt.image_url ? (
                            <img src={evt.image_url} alt={evt.title} className="admin-item-banner" />
                          ) : (
                            <div className="admin-item-banner-placeholder">No Banner</div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleUpdateEventBanner(e, evt.id)}
                            style={{ display: "none" }}
                            id={`change-banner-${evt.id}`}
                          />
                          <label htmlFor={`change-banner-${evt.id}`} className="admin-item-change-banner-lbl">
                            {evt.image_url ? "Change Banner" : "Add Banner"}
                          </label>
                        </div>

                        <div className="admin-item-content">
                          <div className="admin-item-title-row">
                            <h3 className="admin-item-title">{evt.title}</h3>
                            <button
                              onClick={() => handleDeleteEvent(evt.id)}
                              className="admin-item-delete-btn"
                            >
                              Delete Event
                            </button>
                          </div>
                          <p className="admin-item-meta">
                            📅 {new Date(evt.event_date).toLocaleString()}
                          </p>
                          <p className="admin-item-venue">
                            📍 {evt.venue}
                          </p>
                          {evt.description && (
                            <p className="admin-item-desc">{evt.description}</p>
                          )}
                        </div>
                      </div>

                      {/* Manage event gallery photos */}
                      <div className="admin-item-gallery-section">
                        <h4 className="admin-item-gallery-title">
                          Event Gallery ({evt.event_images?.length || 0} photos)
                        </h4>
                        
                        {/* List of existing gallery images */}
                        {evt.event_images && evt.event_images.length > 0 ? (
                          <div className="admin-item-gallery-grid">
                            {evt.event_images.map((img) => (
                              <div key={img.id} className="admin-item-gallery-photo">
                                <img src={img.image_url} alt="Gallery item" />
                                <button
                                  type="button"
                                  onClick={() => handleDeleteGalleryImage(img.id)}
                                  className="admin-item-gallery-photo-delete"
                                  title="Delete from gallery"
                                >
                                  <X size={8} />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginBottom: "12px" }}>No photos in gallery.</p>
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
                          <label htmlFor={`add-gallery-photos-${evt.id}`} className="admin-item-add-photos-lbl">
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

        {/* POTD Publisher Tab */}
        {activeTab === "potd" && (
          <div className="admin-grid">
            {/* Create POTD Section */}
            <div className="admin-card">
              <h2 className="admin-card-title">Publish POTD</h2>
              
              <form onSubmit={handleCreatePOTD}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Problem Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Reverse a Linked List"
                    value={potdTitle}
                    onChange={(e) => setPotdTitle(e.target.value)}
                    required
                    className="admin-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Schedule Date</label>
                  <input
                    type="date"
                    value={potdDate}
                    onChange={(e) => setPotdDate(e.target.value)}
                    required
                    className="admin-input"
                    style={{ fontFamily: "var(--mono)" }}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Difficulty</label>
                  <select
                    value={potdDifficulty}
                    onChange={(e) => setPotdDifficulty(e.target.value)}
                    className="admin-select"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Description</label>
                  <textarea
                    placeholder="Write the full problem description, input formats, constraints, and sample cases..."
                    rows="6"
                    value={potdDescription}
                    onChange={(e) => setPotdDescription(e.target.value)}
                    required
                    className="admin-textarea"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Problem Link (LC/CF URL)</label>
                  <input
                    type="url"
                    placeholder="https://leetcode.com/problems/..."
                    value={potdSolution}
                    onChange={(e) => setPotdSolution(e.target.value)}
                    className="admin-input"
                    style={{ fontFamily: "var(--mono)" }}
                  />
                </div>

                <button type="submit" disabled={submitting} className="admin-btn-primary">
                  {submitting ? "Publishing POTD..." : "Publish POTD"}
                </button>
              </form>
            </div>

            {/* Existing POTDs List */}
            <div className="admin-card">
              <h2 className="admin-card-title">Published POTD History</h2>
              {loadingProblems ? (
                <p style={{ color: "rgba(255,255,255,0.4)" }}>Fetching POTD problems...</p>
              ) : problems.length === 0 ? (
                <p style={{ color: "rgba(255,255,255,0.4)" }}>No Problem of the Day currently published.</p>
              ) : (
                <div className="admin-list-container">
                  {problems.map((prob) => (
                    <div key={prob.id} className="admin-item-card">
                      <div className="admin-item-title-row" style={{ marginBottom: "8px" }}>
                        <h3 className="admin-item-title">{prob.title}</h3>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <button
                            onClick={() => handleDeleteProblem(prob.id)}
                            className="admin-item-delete-btn"
                          >
                            Delete
                          </button>
                          <span className={`admin-badge-difficulty ${prob.difficulty.toLowerCase()}`}>
                            {prob.difficulty}
                          </span>
                        </div>
                      </div>
                      
                      <p className="admin-item-meta">
                        📅 Scheduled: {prob.date}
                      </p>
                      
                      <p className="admin-item-desc" style={{ whiteSpace: "pre-wrap" }}>
                        {prob.description.length > 200 ? prob.description.slice(0, 200) + "..." : prob.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === "resources" && (
          <div className="admin-grid">
            {/* Create Resource Form */}
            <div className="admin-card">
              <h2 className="admin-card-title">Add Resource</h2>
              <form onSubmit={handleCreateResource}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Domain</label>
                  <select
                    value={resDomain}
                    onChange={(e) => setResDomain(e.target.value)}
                    className="admin-select"
                  >
                    {DOMAINS.map((d) => (
                      <option key={d.id} value={d.id}>{d.icon} {d.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Module #</label>
                    <input type="number" min="1" max="12" value={resWeek} onChange={(e) => setResWeek(Number(e.target.value))}
                      className="admin-input" />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Order</label>
                    <input type="number" min="1" max="20" value={resOrder} onChange={(e) => setResOrder(Number(e.target.value))}
                      className="admin-input" />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Type</label>
                  <select value={resType} onChange={(e) => setResType(e.target.value)} className="admin-select">
                    <option value="video">▶ Video</option>
                    <option value="article">📄 Article</option>
                    <option value="exercise">💪 Exercise</option>
                    <option value="docs">📚 Docs</option>
                    <option value="tool">🔧 Tool</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Title *</label>
                  <input type="text" required placeholder="Resource title" value={resTitle} onChange={(e) => setResTitle(e.target.value)}
                    className="admin-input" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">URL *</label>
                  <input type="url" required placeholder="https://..." value={resUrl} onChange={(e) => setResUrl(e.target.value)}
                    className="admin-input" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Description</label>
                  <textarea placeholder="Short description..." value={resDescription} onChange={(e) => setResDescription(e.target.value)} rows={3}
                    className="admin-textarea" style={{ resize: "vertical" }} />
                </div>
                <button type="submit" disabled={submitting} className="admin-btn-primary">
                  {submitting ? "Adding..." : "Add Resource"}
                </button>
              </form>
            </div>

            {/* Resources List */}
            <div className="admin-card">
              <h2 className="admin-card-title">
                DB Resources ({resources.length})
              </h2>
              {loadingResources ? (
                <p style={{ color: "rgba(255,255,255,0.4)" }}>Loading...</p>
              ) : resources.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.3)" }}>
                  <p>No resources in DB yet.</p>
                  <p style={{ fontSize: "12px", marginTop: "8px" }}>Seed data is used as fallback for users.</p>
                </div>
              ) : (
                <div className="admin-scroll-y">
                  {resources.map((res) => (
                    <div key={res.id} className="admin-res-row">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="admin-res-meta-tags">
                          <span className="admin-res-tag-domain">{res.domain}</span>
                          <span className="admin-res-tag-info">Mod {res.week_number} · #{res.order_in_week}</span>
                          <span className="admin-res-tag-info">{res.type}</span>
                        </div>
                        <p className="admin-res-title">{res.title}</p>
                        <a href={res.url} target="_blank" rel="noreferrer" className="admin-res-link">
                          <ExternalLink size={11} /> Open link
                        </a>
                      </div>
                      <button onClick={() => handleDeleteResource(res.id)} className="admin-res-delete-btn">
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quotes Manager Tab */}
        {activeTab === "quotes" && (
          <div className="admin-grid">
            <div className="admin-card">
              <h2 className="admin-card-title">Add Motivation Quote</h2>
              <form onSubmit={handleAddQuote}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Quote Text</label>
                  <textarea
                    placeholder="Enter inspirational quote..."
                    value={newQuoteText}
                    onChange={(e) => setNewQuoteText(e.target.value)}
                    className="admin-textarea"
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Author Name</label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={newQuoteAuthor}
                    onChange={(e) => setNewQuoteAuthor(e.target.value)}
                    className="admin-input"
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Schedule For (Optional)</label>
                  <input
                    type="date"
                    value={newQuoteDate}
                    onChange={(e) => setNewQuoteDate(e.target.value)}
                    className="admin-input"
                  />
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>Leave blank to schedule for today.</p>
                </div>
                <button
                  type="submit"
                  disabled={submitting || !newQuoteText || !newQuoteAuthor}
                  className="admin-btn-primary"
                >
                  {submitting ? <Loader2 className="spinner" size={14} /> : <Plus size={14} />} Add & Approve Quote
                </button>
              </form>
            </div>

            <div className="admin-card">
              <h2 className="admin-card-title">Pending Quotes Review</h2>
              {loadingQuotes ? (
                <div className="admin-loading-spinner" style={{ margin: "40px auto" }} />
              ) : pendingQuotes.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.3)" }}>
                  <p>No pending quotes for review.</p>
                </div>
              ) : (
                <div className="admin-scroll-y">
                  {pendingQuotes.map((q) => (
                    <div key={q.id} className="admin-res-row" style={{ alignItems: "flex-start" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="admin-res-meta-tags">
                          <span className="admin-res-tag-domain">Submitted by {q.profiles?.name || "Unknown"}</span>
                          <span className="admin-res-tag-info">{new Date(q.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="admin-res-title" style={{ fontStyle: "italic", marginTop: "6px" }}>"{q.quote}"</p>
                        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>— {q.author_name}</p>
                      </div>
                      <div style={{ display: "flex", gap: "8px", flexDirection: "column", minWidth: "120px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <label style={{ fontSize: "10px", color: "rgba(255,255,255,0.6)" }}>Schedule Date</label>
                          <input type="date" value={reviewDates[q.id] || ""} onChange={(e) => setReviewDates({ ...reviewDates, [q.id]: e.target.value })} className="admin-input" style={{ padding: "4px 8px", fontSize: "12px" }} />
                        </div>
                        <button onClick={() => handleReviewQuote(q.id, 'approved', reviewDates[q.id])} className="admin-btn-primary" style={{ padding: "6px 12px", fontSize: "12px", justifyContent: "center" }} disabled={submitting}>
                          <Check size={12} /> Approve
                        </button>
                        <button onClick={() => handleReviewQuote(q.id, 'rejected')} className="admin-res-delete-btn" style={{ padding: "6px 12px", fontSize: "12px", justifyContent: "center" }} disabled={submitting}>
                          <X size={12} /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
