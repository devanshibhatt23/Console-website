import { supabase } from "../lib/supabase.js";

/**
 * Submits a solution status for a daily problem
 * @param {string} userId - UUID of the user
 * @param {string} problemId - UUID of the problem
 * @param {'Correct'|'Incorrect'} status - The submission result status
 * @param {number} attempts - Number of attempts made
 * @returns {Promise<Object>}
 */
export async function submitSolution(userId, problemId, status, attempts = 1) {
  const { data, error } = await supabase
    .from("submissions")
    .insert({
      user_id: userId,
      problem_id: problemId,
      status,
      attempts,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

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
        difficulty
      )
    `)
    .eq("user_id", userId)
    .order("submission_time", { ascending: false });

  if (error) throw error;

  return data;
}