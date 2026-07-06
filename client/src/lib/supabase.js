import { createClient } from "@supabase/supabase-js";

const supabaseUrl = typeof import.meta !== "undefined" && import.meta.env
  ? import.meta.env.VITE_SUPABASE_URL
  : (process.env.VITE_SUPABASE_URL || "https://gxbhswojyrlifgqhjwqv.supabase.co");

const supabaseKey = typeof import.meta !== "undefined" && import.meta.env
  ? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  : (process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_d4V3xwLA1cFcEuPFusaFYw_bKzps7_F");

export const supabase = createClient(supabaseUrl, supabaseKey);