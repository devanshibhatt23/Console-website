import { supabase } from "../lib/supabase.js";

/**
 * Fetches the Problem of the Day (POTD) for the current date
 * @returns {Promise<Object|null>}
 */
export async function getPOTD() {
  const localDate = new Date();
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;
  
  // Call the atomic database function to assign or get today's POTD
  const { data, error } = await supabase
    .rpc("assign_today_potd", { today_date: today })
    .maybeSingle();

  if (error) throw error;

  return data;
}

/**
 * Creates a new problem (POTD) - Admin only
 * @param {Object} problem - Problem data: { date, title, difficulty, description, solution }
 * @returns {Promise<Object>}
 */
export async function createProblem(problem) {
  const { data, error } = await supabase
    .from("problems")
    .insert(problem)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Updates an existing problem - Admin only
 * @param {string} problemId - UUID of the problem to update
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>}
 */
export async function updateProblem(problemId, updates) {
  const { data, error } = await supabase
    .from("problems")
    .update(updates)
    .eq("id", problemId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Fetches all problems (POTD)
 * @returns {Promise<Array>}
 */
export async function getProblems() {
  const { data, error } = await supabase
    .from("problems")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw error;

  return data;
}

/**
 * Deletes a problem - Admin only
 * @param {string} problemId - UUID of the problem to delete
 */
export async function deleteProblem(problemId) {
  const { error } = await supabase
    .from("problems")
    .delete()
    .eq("id", problemId);

  if (error) throw error;
}