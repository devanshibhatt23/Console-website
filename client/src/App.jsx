import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Leaderboard from "./pages/Leaderboard";
import POTDLeaderboard from "./pages/POTDLeaderboard";
import POTD from "./pages/POTD";
import Resources from "./pages/Resources";
import ResourceDomain from "./pages/ResourceDomain";
import TechGuide from "./pages/TechGuide";
import PlacementPlaybook from "./pages/PlacementPlaybook";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/problem-of-the-day" element={<POTD />} />
          <Route path="/potd-leaderboard" element={<POTDLeaderboard />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resources/:domain" element={<ResourceDomain />} />
          <Route path="/tech-guide" element={<TechGuide />} />
          <Route path="/placement-playbook" element={<PlacementPlaybook />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute requireAdmin={true} />}>
          <Route path="/admin/*" element={<Admin />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;