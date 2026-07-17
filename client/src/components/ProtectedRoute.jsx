import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ requireAdmin = false }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div style={{ 
          width: "3rem", height: "3rem", border: "3px solid rgba(59, 130, 246, 0.2)", 
          borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 1s linear infinite" 
        }}></div>
        <style>
          {`@keyframes spin { to { transform: rotate(360deg); } }`}
        </style>
      </div>
    );
  }

  // 1. Not logged in -> Redirect to Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Profile incomplete -> Force them to Dashboard
  // To complete profile, a name is required AND at least one verified platform handle (CF or LC) must be connected
  const hasName = !!(profile && profile.name && profile.name.trim() !== "");
  const hasCf = !!(profile && profile.codeforces_handle && profile.codeforces_handle.trim() !== "");
  const hasLc = !!(profile && profile.leetcode_handle && profile.leetcode_handle.trim() !== "");
  const isProfileComplete = hasName && (hasCf || hasLc);
  const isProfileRoute = window.location.pathname === "/profile" || window.location.pathname === "/dashboard";
  
  console.log("ProtectedRoute - completeness check:", {
    pathname: window.location.pathname,
    hasName,
    hasCf,
    hasLc,
    isProfileComplete,
    isProfileRoute
  });

  if (!isProfileComplete && !isProfileRoute) {
    // If they have an incomplete profile, they MUST go to profile page
    return <Navigate to="/profile" replace />;
  }

  if (requireAdmin) {
    const isAdmin = profile?.role === "admin" || profile?.role === "super_admin";
    if (!isAdmin) {
      return <Navigate to="/" replace />; // Send unauthorized users to landing page
    }
  }

  // 4. Authorized -> Render the child routes
  return <Outlet />;
}
