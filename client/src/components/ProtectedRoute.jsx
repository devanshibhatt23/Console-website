import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ requireAdmin = false }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

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

  // 2. Profile incomplete -> Redirect to /profile
  // profile_completed is only set to true when the user explicitly verifies a platform handle
  const isProfileComplete = profile?.profile_completed === true;
  const isProfileRoute = location.pathname === "/profile" || location.pathname === "/dashboard";

  if (!isProfileComplete && !isProfileRoute) {
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
