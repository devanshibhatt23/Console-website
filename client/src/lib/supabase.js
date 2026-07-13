import { createClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://gxbhswojyrlifgqhjwqv.supabase.co";
const DEFAULT_SUPABASE_KEY = "sb_publishable_d4V3xwLA1cFcEuPFusaFYw_bKzps7_F";

const env = (typeof import.meta !== "undefined" && import.meta.env) ? import.meta.env : {};

const supabaseUrl = env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || DEFAULT_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);