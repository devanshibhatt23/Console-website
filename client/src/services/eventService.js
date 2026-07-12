import { supabase } from "../lib/supabase";

export async function getEvents() {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });

  if (error) throw error;

  return data;
}

export async function createEvent(event) {
  const { data, error } = await supabase
    .from("events")
    .insert(event)
    .select();

  if (error) throw error;

  return data;
}

export async function deleteEvent(eventId) {
  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", eventId);

  if (error) throw error;
}

export async function getEventsWithImages() {
  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      event_images (*)
    `)
    .order("event_date", { ascending: false });

  if (error) throw error;

  return data;
}

export async function addEventImages(images) {
  const { data, error } = await supabase
    .from("event_images")
    .insert(images)
    .select();

  if (error) throw error;

  return data;
}

export async function deleteEventImage(imageId) {
  const { error } = await supabase
    .from("event_images")
    .delete()
    .eq("id", imageId);

  if (error) throw error;
}

export async function updateEvent(eventId, updates) {
  const { data, error } = await supabase
    .from("events")
    .update(updates)
    .eq("id", eventId)
    .select();

  if (error) throw error;

  return data;
}