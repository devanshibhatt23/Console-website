import { supabase } from "../lib/supabase.js";

/**
 * Fetches the Problem of the Day (POTD) for the current date
 * @returns {Promise<Object|null>}
 */
export async function getPOTD() {
  const today = new Date().toISOString().split("T")[0];
  
  const { data, error } = await supabase
    .from("problems")
    .select("*")
    .eq("date", today)
    .maybeSingle(); // Returns null instead of throwing if no rows are found

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