import { getImageUrl } from '../utils/getImageUrl';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Terminal } from 'lucide-react';
import api from '../api';
import SectionHeader from '../components/SectionHeader';

const normalizeName = (name) => {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[_\-\.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const resolveMemberImage = (member) => {
  if (member.image) {
    return getImageUrl(member.image);
  }
  return 'https://ui-avatars.com/api/?name=' + encodeURIComponent(member.name) + '&background=random';
};

// Mentors are now fetched directly from the database where category === 'Mentors'

const Team = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await api.get('/team');
        setTeam(res.data);
      } catch (err) {
        console.error('Error fetching team:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const categorizedTeam = team.reduce((acc, member) => {
    if (!acc[member.category]) acc[member.category] = [];
    acc[member.category].push(member);
    return acc;
  }, {});

  const categoriesOrder = [
    'Coordinator',
    'Mentors',
    'Report & Analysis Team',
    'Development Team',
    'Social Media Team',
    'Technical Team',
    'Videography & Editing Team'
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-2xl uppercase">Loading...</div>;

  return (
    <div className="min-h-screen py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionHeader 
        number="03"
        title="Meet The Team"
        description="The brilliant minds driving the ENIGMA Technical Club forward."
      />

      {categoriesOrder.map((category, index) => (
        categorizedTeam[category] && categorizedTeam[category].length > 0 && (
          <div key={category} className="mb-24">
            <h2 className="text-3xl md:text-4xl font-black mb-10 pl-6 border-l-8 border-primary uppercase text-charcoal tracking-tight">
              {category === 'Coordinator' ? 'Faculty Coordinators' : category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {categorizedTeam[category].map((member, idx) => (
                <motion.div 
                  key={member._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="neo-card p-6 flex flex-col items-center text-center group"
                >
                  <div className="relative mb-8 w-full">
                    <div className="aspect-square w-3/4 mx-auto border-2 border-black neo-shadow-sm overflow-hidden bg-gray-100">
                      <img src={resolveMemberImage(member)} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { e.target.onerror = null; e.target.src = resolveMemberImage(member); }} />
                    </div>
                    {member.role === 'Team Head' && (
                      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-primary text-black text-xs font-black uppercase tracking-widest px-4 py-1 border-2 border-black neo-shadow-sm whitespace-nowrap z-10">
                        Team Head
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-black mb-1 text-charcoal">{member.name}</h3>
                  <p className="text-gray-600 text-sm font-bold mb-2 uppercase tracking-wide">{member.role !== 'Team Head' ? member.role : 'Core Leadership'}</p>
                  
                  {member.branch && <p className="text-charcoal text-xs font-bold tracking-widest uppercase mb-4 border-t-2 border-b-2 border-black py-1 w-full">{member.branch}</p>}
                  
                  <p className="text-gray-700 text-sm mb-6 flex-grow font-medium leading-relaxed">{member.specialty || member.bio}</p>
                  
                  <div className="flex gap-4 mt-auto">
                    {member.linkedin && member.linkedin !== '#' && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-primary border-2 border-black hover:-translate-y-1 transition-transform neo-shadow-sm"><Briefcase size={20} strokeWidth={2.5} className="text-black" /></a>
                    )}
                    {member.github && member.github !== '#' && (
                      <a href={member.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-primary border-2 border-black hover:-translate-y-1 transition-transform neo-shadow-sm"><Terminal size={20} strokeWidth={2.5} className="text-black" /></a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  );
};

export default Team;
