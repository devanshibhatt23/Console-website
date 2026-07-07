import { supabase } from "../lib/supabase";

// Google OAuth Login / Signup
export async function signInWithGoogle() {
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/dashboard',
      queryParams: {
        hd: 'mnit.ac.in', // UI level restriction
      }
    }
  });
}

// Logout
export async function signOut() {
  return await supabase.auth.signOut();
}

// Current User
export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

// Current Session
export async function getSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}