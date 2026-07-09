import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Leaderboard from "./pages/Leaderboard";
import Resources from "./pages/Resources";
import ResourceDomain from "./pages/ResourceDomain";
import TechGuide from "./pages/TechGuide";
import PlacementPlaybook from "./pages/PlacementPlaybook";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/resources/:domain" element={<ResourceDomain />} />
        <Route path="/tech-guide" element={<TechGuide />} />
        <Route path="/placement-playbook" element={<PlacementPlaybook />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;