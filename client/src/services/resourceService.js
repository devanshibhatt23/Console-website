import { supabase } from "../lib/supabase.js";

/**
 * Fetches all educational resources, optionally filtered by domain
 * @param {string} [domain] - Optional domain slug to filter by
 * @returns {Promise<Array>}
 */
export async function getResources(domain = null) {
  let query = supabase
    .from("resources")
    .select("*")
    .order("week_number", { ascending: true })
    .order("order_in_week", { ascending: true });

  if (domain) {
    query = query.eq("domain", domain);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * Creates a new educational resource - Admin only
 * @param {Object} resource - Resource data: { domain, category, title, url, description, week_number, order_in_week, type }
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

/**
 * Deletes a resource by ID - Admin only
 * @param {string} resourceId
 */
export async function deleteResource(resourceId) {
  const { error } = await supabase
    .from("resources")
    .delete()
    .eq("id", resourceId);

  if (error) throw error;
}

/**
 * Fetches all completed resource IDs for a specific user
 * @param {string} userId
 * @returns {Promise<Set<string>>} Set of completed resource IDs
 */
export async function getUserProgress(userId) {
  const { data, error } = await supabase
    .from("resource_progress")
    .select("resource_id")
    .eq("user_id", userId);

  if (error) throw error;
  return new Set((data || []).map((row) => row.resource_id));
}

/**
 * Marks a resource as complete for a user
 * @param {string} userId
 * @param {string} resourceId
 */
export async function markComplete(userId, resourceId) {
  const { error } = await supabase
    .from("resource_progress")
    .upsert({ user_id: userId, resource_id: resourceId }, { onConflict: "user_id,resource_id" });

  if (error) throw error;
}

/**
 * Marks a resource as incomplete (removes from progress)
 * @param {string} userId
 * @param {string} resourceId
 */
export async function markIncomplete(userId, resourceId) {
  const { error } = await supabase
    .from("resource_progress")
    .delete()
    .eq("user_id", userId)
    .eq("resource_id", resourceId);

  if (error) throw error;
}

/**
 * Toggles progress for a resource
 * @param {string} userId
 * @param {string} resourceId
 * @param {boolean} isCompleted - current state (true = mark incomplete, false = mark complete)
 */
export async function toggleProgress(userId, resourceId, isCompleted) {
  if (isCompleted) {
    return markIncomplete(userId, resourceId);
  } else {
    return markComplete(userId, resourceId);
  }
}