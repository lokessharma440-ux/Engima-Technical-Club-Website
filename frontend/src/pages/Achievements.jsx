import { getImageUrl } from '../utils/getImageUrl';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import api from '../api';
import SectionHeader from '../components/SectionHeader';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await api.get('/achievements');
        setAchievements(res.data);
      } catch (err) {
        console.error('Error fetching achievements:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-2xl uppercase tracking-widest">Loading...</div>;

  return (
    <div className="min-h-screen py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionHeader 
        number="09"
        title="Our Achievements"
        description="Celebrating the milestones, victories, and accolades earned by the ENIGMA community."
      />

      <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 md:before:mx-auto before:-translate-x-px md:before:translate-x-0 before:h-full before:w-1 before:bg-black">
        {achievements.map((achievement, idx) => {
          return (
            <motion.div 
              key={achievement._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group`}
            >
              <div className={`flex items-center justify-center w-12 h-12 rounded-none border-4 border-black bg-primary text-black z-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 neo-shadow-sm`}>
                <Trophy size={20} strokeWidth={2.5} />
              </div>

              <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] neo-card p-8 bg-white border-4 border-black`}>
                <div className="flex flex-wrap items-center gap-4 mb-4 pb-4 border-b-4 border-black">
                  <span className="px-3 py-1 bg-primary text-black text-xs font-black uppercase tracking-widest border-2 border-black neo-shadow-sm">
                    {achievement.category || 'Achievement'}
                  </span>
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">{achievement.date}</span>
                </div>
                <h3 className="text-2xl font-black mb-4 uppercase text-charcoal">{achievement.title}</h3>
                <p className="text-gray-700 font-medium leading-relaxed mb-6">
                  {achievement.description}
                </p>
                {achievement.image && (
                  <div className="h-48 overflow-hidden border-4 border-black bg-gray-200">
                    <img 
                      src={getImageUrl(achievement.image)} 
                      alt={achievement.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;
