import { supabase } from "../lib/supabase.js";

/**
 * Fetches all comments for a specific target (problem or event)
 * @param {string} targetId - UUID of the target problem or event
 * @returns {Promise<Array>}
 */
export async function getComments(targetId) {
  const { data, error } = await supabase
    .from("comments")
    .select(`
      *,
      profiles (
        name,
        role
      )
    `)
    .eq("target_id", targetId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return data;
}

/**
 * Adds a new comment to a problem or event
 * @param {string} userId - UUID of the user posting the comment
 * @param {string} targetId - UUID of the target problem or event
 * @param {string} content - Text content of the comment
 * @returns {Promise<Object>}
 */
export async function addComment(userId, targetId, content) {
  const { data, error } = await supabase
    .from("comments")
    .insert({
      user_id: userId,
      target_id: targetId,
      content,
    })
    .select(`
      *,
      profiles (
        name,
        role
      )
    `)
    .single();

  if (error) throw error;

  return data;
}

/**
 * Deletes a comment by ID
 * @param {string} commentId - UUID of the comment to delete
 * @returns {Promise<void>}
 */
export async function deleteComment(commentId) {
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);

  if (error) throw error;
}