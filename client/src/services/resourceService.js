import { supabase } from "../lib/supabase.js";

/**
 * Fetches all educational resources
 * @returns {Promise<Array>}
 */
export async function getResources() {
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .order("category", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

/**
 * Creates a new educational resource - Admin only
 * @param {Object} resource - Resource data: { category, title, url, description }
 * @returns {Promise<Object>}
 */
export async function createResource(resource) {
  const { data, error } = await supabase
    .from("resources")
    .insert(resource)
    .select()
    .single();

  if (error) throw error;

  return data;
}