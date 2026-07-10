import React, { useState, useEffect } from "react";
import { getEventsWithImages } from "../services/eventService";
import "./Events.css";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getEventsWithImages();
        setEvents(data || []);
      } catch (err) {
        setError(err.message || "Failed to fetch events");
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, []);


  return (
    <div className="events-container">
      <div className="events-content">
        
        {/* Header */}
        <header className="events-header">
          <h1 className="events-title">Events</h1>
          <p className="events-subtitle">
            Explore previous Console Club events
          </p>
        </header>

        {/* Content Area */}
        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-title">Error loading events</p>
            <p className="error-message">{error}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>No Events Found</h3>
            <p>Stay tuned! Previous Console Club events will appear here.</p>
          </div>
        ) : (
          <div className="events-grid">
            {events.map((event) => {
              // The cover image is either the first image in event_images or the event.image_url fallback
              const coverImage = event.event_images?.[0]?.image_url || event.image_url;
              const hasMultipleImages = event.event_images && event.event_images.length > 0;

              return (
                <article key={event.id} className="event-card">
                  
                  {/* Cover Image/Header */}
                  <div className="event-card-header">
                    {coverImage ? (
                      <img 
                        src={coverImage} 
                        alt={event.title} 
                        className="event-cover-image"
                        loading="lazy"
                      />
                    ) : (
                      <div className="event-cover-placeholder">
                        <span className="placeholder-text">CONSOLE CLUB</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="event-card-body">
                    <h2 className="event-card-title">{event.title}</h2>
                    
                    {event.description && (
                      <p className="event-description">{event.description}</p>
                    )}

                    {/* Image Gallery if multiple images exist */}
                    {hasMultipleImages && (
                      <div className="event-gallery-section">
                        <h3 className="gallery-title">Event Gallery</h3>
                        <div className="event-gallery-grid">
                          {event.event_images.map((img) => (
                            <div key={img.id} className="gallery-image-wrapper">
                              <img 
                                src={img.image_url} 
                                alt={`${event.title} photo`} 
                                className="gallery-image"
                                loading="lazy"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
