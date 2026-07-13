import { supabase } from "../lib/supabase";

/**
 * Uploads a student resume to the 'resumes' bucket
 * @param {string} userId - The authenticated user's ID
 * @param {File} file - The file object from HTML input
 * @returns {Promise<string>} - The path of the uploaded file inside the bucket
 */
export async function uploadResume(userId, file) {
  const fileExt = file.name.split(".").pop();
  const baseName = file.name.replace(/\.[^/.]+$/, "");
  const safeBaseName = baseName.replace(/[^a-zA-Z0-9.-]/g, "_");
  const filePath = `${userId}/${safeBaseName}_${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from("resumes")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) throw error;

  return data.path;
}

/**
 * Generates a temporary signed URL to view/download the resume
 * @param {string} filePath - The path saved in profiles.resume_url
 * @param {number} expiresIn - Expiry time in seconds (default 1 year)
 * @returns {Promise<string>} - Temporary signed URL
 */
export async function getResumeUrl(filePath, expiresIn = 31536000) {
  const { data, error } = await supabase.storage
    .from("resumes")
    .createSignedUrl(filePath, expiresIn);

  if (error) throw error;

  return data.signedUrl;
}

/**
 * Deletes a resume from the storage bucket
 * @param {string} filePath - The path saved in profiles.resume_url
 * @returns {Promise<void>}
 */
export async function deleteResume(filePath) {
  const { error } = await supabase.storage
    .from("resumes")
    .remove([filePath]);

  if (error) throw error;
}

/**
 * Uploads an event image/banner to the 'event-images' bucket
 * @param {File} file - The image file object
 * @returns {Promise<string>} - The public URL of the uploaded image
 */
export async function uploadEventImage(file) {
  const fileExt = file.name.split(".").pop();
  const filePath = `banners/event_${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from("event-images")
    .upload(filePath, file, {
      cacheControl: "31536000", // 1 year cache
      upsert: true,
    });

  if (error) throw error;

  // Get the public URL for the event image (since 'event-images' is a public bucket)
  const { data: publicUrlData } = supabase.storage
    .from("event-images")
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}
