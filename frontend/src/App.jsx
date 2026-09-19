import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import TeamManager from './pages/admin/TeamManager';
import GalleryManager from './pages/admin/GalleryManager';
import ProjectsManager from './pages/admin/ProjectsManager';
import EventsManager from './pages/admin/EventsManager';
import AchievementsManager from './pages/admin/AchievementsManager';
import Scanner from './pages/admin/Scanner';
import AttendanceDashboard from './pages/admin/AttendanceDashboard';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Registration from './pages/Registration';
import Team from './pages/Team';
import About from './pages/About';
import Achievements from './pages/Achievements';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import JoinUs from './pages/JoinUs';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import Resources from './pages/Resources';
import Blog from './pages/Blog';
import Leaderboard from './pages/Leaderboard';
import { Outlet } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';

const PublicLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow pt-20">
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes with Navbar and Footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/events/:id/register" element={<Registration />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/team" element={<Team />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/join-us" element={<JoinUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/blog" element={<Blog />} />
          </Route>

          {/* Admin Routes without public Navbar/Footer */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="members" element={<TeamManager title="Members" />} />
            <Route path="mentors" element={<TeamManager title="Mentors" categoryFilter="Mentors" />} />
            <Route path="faculty" element={<TeamManager title="Faculty Coordinator" categoryFilter="Coordinator" />} />
            <Route path="achievements" element={<AchievementsManager />} />
            <Route path="projects" element={<ProjectsManager />} />
            <Route path="events" element={<EventsManager />} />
            <Route path="gallery" element={<GalleryManager />} />
            <Route path="scanner" element={<Scanner />} />
            <Route path="attendance" element={<AttendanceDashboard />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
