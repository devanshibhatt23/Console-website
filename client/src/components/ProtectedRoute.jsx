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
  // To complete profile, name is required.
  const isProfileComplete = profile && profile.name && profile.name.trim() !== "";
  const isDashboardRoute = window.location.pathname === "/dashboard";
  
  if (!isProfileComplete && !isDashboardRoute) {
    // If they have an incomplete profile, they MUST go to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Admin Verification -> Check if route requires admin and user is admin
  if (requireAdmin) {
    const isAdmin = profile?.role === "admin" || profile?.role === "super_admin";
    if (!isAdmin) {
      return <Navigate to="/" replace />; // Send unauthorized users home
    }
  }

  // 4. Authorized -> Render the child routes
  return <Outlet />;
}
