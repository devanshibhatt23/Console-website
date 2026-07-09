import { supabase } from "../lib/supabase.js";

/**
 * Fetches all submissions made by a specific user
 * @param {string} userId - UUID of the user
 * @returns {Promise<Array>}
 */
export async function getMySubmissions(userId) {
  const { data, error } = await supabase
    .from("submissions")
    .select(`
      *,
      problems (
        title,
        difficulty,
        date
      )
    `)
    .eq("user_id", userId)
    .order("submission_time", { ascending: false });

  if (error) throw error;

  return data;
}