import { supabase } from "../lib/supabase";

export function deriveCollegeIdFromEmail(email) {
  if (!email) return "";

  const trimmedEmail = email.trim();
  return trimmedEmail.slice(0, 11);
}

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;

  const derivedCollegeId = deriveCollegeIdFromEmail(data?.email || "");
  const storedCollege = data?.college_id ? String(data.college_id) : "";
  const normalizedStored = storedCollege ? storedCollege.slice(0, 11) : "";

  return {
    ...data,
    college_id: derivedCollegeId || normalizedStored || "",
  };
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function ensureCollegeIdForUser(userId, email) {
  const derivedCollegeId = deriveCollegeIdFromEmail(email);
  if (!userId || !derivedCollegeId) return null;

  const { data: existingProfile, error: fetchError } = await supabase
    .from("profiles")
    .select("college_id")
    .eq("id", userId)
    .single();

  if (fetchError) throw fetchError;

  if (existingProfile?.college_id === derivedCollegeId) {
    return derivedCollegeId;
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ college_id: derivedCollegeId })
    .eq("id", userId)
    .select("college_id")
    .single();

  if (error) throw error;

  return data?.college_id || derivedCollegeId;
}

export async function searchProfiles(searchTerm) {
  const normalizedSearch = (searchTerm || "").trim();
  if (!normalizedSearch) return [];

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, college_id")
      .or(`name.ilike.%${normalizedSearch}%,college_id.ilike.%${normalizedSearch}%`)
      .limit(5);

    if (error) {
      console.error("searchProfiles supabase error:", error);
      return [];
    }

    return (data || []).map((profile) => ({
      ...profile,
      college_id: profile.college_id ? String(profile.college_id).slice(0, 11) : "",
    }));
  } catch (err) {
    console.error("searchProfiles unexpected error:", err);
    return [];
  }
}