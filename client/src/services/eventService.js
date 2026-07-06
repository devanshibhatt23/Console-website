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