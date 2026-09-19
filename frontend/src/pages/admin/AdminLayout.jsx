import React, { useContext, useState } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LayoutDashboard, Users, UserCheck, User, Award, Image, Briefcase, Calendar, LogOut, ScanLine, ClipboardList, Menu, X } from 'lucide-react';

const AdminLayout = () => {
  const { admin, loading, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-2xl uppercase">Authenticating...</div>;
  if (!admin) return <Navigate to="/admin/login" replace />;

  const menuItems = [
    { path: '/admin/dashboard', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/members', label: 'Members', icon: <Users size={20} /> },
    { path: '/admin/mentors', label: 'Mentors', icon: <UserCheck size={20} /> },
    { path: '/admin/faculty', label: 'Faculty', icon: <User size={20} /> },
    { path: '/admin/achievements', label: 'Achievements', icon: <Award size={20} /> },
    { path: '/admin/projects', label: 'Projects', icon: <Briefcase size={20} /> },
    { path: '/admin/events', label: 'Events', icon: <Calendar size={20} /> },
    { path: '/admin/gallery', label: 'Gallery', icon: <Image size={20} /> },
    { path: '/admin/scanner', label: 'QR Scanner', icon: <ScanLine size={20} /> },
    { path: '/admin/attendance', label: 'Attendance', icon: <ClipboardList size={20} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Sidebar */}
      <aside className={`w-full md:w-64 bg-charcoal text-white border-b-4 md:border-b-0 md:border-r-4 border-black flex flex-col ${isMobileMenuOpen ? 'h-screen' : ''} md:h-screen sticky top-0 md:fixed z-30 transition-all`}>
        <div className="p-4 md:p-6 border-b-4 border-black bg-primary text-black flex justify-between items-center md:items-start md:flex-col">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">
              ENIGMA<span className="hidden md:inline"><br/></span> <span className="md:hidden"></span>CMS
            </h1>
            <p className="text-xs font-bold mt-2 uppercase hidden md:block">Logged in as {admin.username}</p>
          </div>
          <button 
            className="md:hidden p-2 border-2 border-black neo-shadow-sm bg-white hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col flex-grow overflow-hidden`}>
          <nav className="flex-grow p-4 flex flex-col gap-2 overflow-y-auto">
            {menuItems.map(item => (
              <Link 
                key={item.path} 
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 font-bold uppercase text-sm border-2 transition-all ${
                  location.pathname === item.path 
                    ? 'bg-primary text-black border-black neo-shadow-sm' 
                    : 'border-transparent text-gray-300 hover:text-white hover:border-gray-600'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="p-4 border-t-4 border-black">
            <button 
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-3 bg-red-500 text-black font-black uppercase text-sm border-2 border-black neo-shadow-sm hover:-translate-y-1 transition-transform"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow md:ml-64 p-4 md:p-8 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
