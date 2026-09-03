import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { ensureCollegeIdForUser } from "../services/ProfileService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId, email, userMetadata) => {
    let { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    // If no profile found by ID, check if an imported profile exists with the same
    // email (created by admin import script under a different auth ID).
    // If found, migrate it to this Google auth ID to prevent duplicates.
    if (!data && email) {
      try {
        const { data: linked } = await supabase.rpc("link_profile_by_email", {
          new_user_id: userId,
          user_email: email,
        });
        if (linked) {
          // Profile was successfully migrated — fetch it under the new ID
          const { data: migratedData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();
          data = migratedData;
        }
      } catch (err) {
        console.warn("Unable to link imported profile by email:", err.message);
      }
    }

    // Auto-sync name from Google metadata if profile name is blank
    const metaName = userMetadata?.full_name || userMetadata?.name || "";
    if (data && (!data.name || data.name.trim() === "") && metaName) {
      try {
        const { data: updatedData } = await supabase
          .from("profiles")
          .update({ name: metaName })
          .eq("id", userId)
          .select()
          .single();
        if (updatedData) {
          data = updatedData;
        }
      } catch (err) {
        console.warn("Unable to auto-sync profile name:", err.message);
      }
    }

    if (data && email) {
      try {
        const syncedId = await ensureCollegeIdForUser(userId, email);
        if (syncedId) {
          data.college_id = syncedId;
        }
      } catch (err) {
        console.warn("Unable to sync college ID:", err.message);
      }
    }

    setProfile(data);
  }, []);

  // Exposed so Dashboard can re-fetch after saving
  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id, user.email, user.user_metadata);
  }, [user, fetchProfile]);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id, session.user.email, session.user.user_metadata);
      }

      setLoading(false);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id, session.user.email, session.user.user_metadata);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}