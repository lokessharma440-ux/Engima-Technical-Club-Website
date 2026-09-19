import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Users, UserCheck, User, Award, Briefcase, Image, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, color, delay }) => (
  <motion.div 
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay }}
    className={`p-6 border-4 border-black neo-shadow flex items-center justify-between ${color}`}
  >
    <div>
      <p className="text-sm font-black uppercase text-charcoal/80 tracking-wider mb-2">{title}</p>
      <p className="text-4xl font-black text-black">{value}</p>
    </div>
    <div className="p-4 bg-white border-2 border-black rounded-full neo-shadow-sm">
      {icon}
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joinAccepting, setJoinAccepting] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setStats(res.data);
        const settingsRes = await api.get('/settings/join-status');
        setJoinAccepting(settingsRes.data.accepting);
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="font-black text-xl uppercase animate-pulse">Loading Dashboard...</div>;
  if (!stats) return <div className="font-bold text-red-500">Error loading data.</div>;

  const toggleJoinStatus = async () => {
    try {
      const res = await api.put('/admin/settings/join-status', { accepting: !joinAccepting });
      setJoinAccepting(res.data.accepting);
    } catch(err) {
      alert('Failed to update status');
    }
  };

  const statItems = [
    { title: 'Total Members', value: stats.totalMembers, icon: <Users size={28} />, color: 'bg-primary' },
    { title: 'Mentors', value: stats.totalMentors, icon: <UserCheck size={28} />, color: 'bg-[#c0aede]' },
    { title: 'Faculty', value: stats.facultyCoordinators, icon: <User size={28} />, color: 'bg-[#d1d4f9]' },
    { title: 'Achievements', value: stats.totalAchievements, icon: <Award size={28} />, color: 'bg-[#ffdfbf]' },
    { title: 'Projects', value: stats.totalProjects, icon: <Briefcase size={28} />, color: 'bg-[#ffd5dc]' },
    { title: 'Gallery Photos', value: stats.totalGallery, icon: <Image size={28} />, color: 'bg-[#b6e3f4]' },
    { title: 'Upcoming Events', value: stats.upcomingEvents, icon: <Calendar size={28} />, color: 'bg-green-300' },
    { title: 'Previous Events', value: stats.previousEvents, icon: <Calendar size={28} className="opacity-50" />, color: 'bg-gray-300' },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-black uppercase border-b-4 border-black pb-4 text-charcoal inline-block">
          Dashboard Overview
        </h2>
        <button
          onClick={toggleJoinStatus}
          className={`px-6 py-3 font-black uppercase border-4 border-black neo-shadow-sm transition-transform hover:-translate-y-1 hover:translate-x-1 ${joinAccepting ? 'bg-green-400 text-black' : 'bg-red-400 text-black'}`}
        >
          {joinAccepting ? 'Join Form: ACCEPTING' : 'Join Form: CLOSED'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((item, idx) => (
          <StatCard 
            key={item.title}
            title={item.title}
            value={item.value}
            icon={item.icon}
            color={item.color}
            delay={idx * 0.05}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
