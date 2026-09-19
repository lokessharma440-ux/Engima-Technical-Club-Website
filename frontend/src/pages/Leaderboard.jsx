import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Code, Flame } from 'lucide-react';
import api from '../api';
import SectionHeader from '../components/SectionHeader';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/leaderboard');
        setLeaderboard(res.data);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-2xl uppercase tracking-widest">Loading...</div>;

  return (
    <div className="min-h-screen py-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <SectionHeader 
        number="07"
        title="Club Leaderboard"
        description="Real-time competitive programming statistics of our members."
      />

      <div className="neo-card p-0 bg-white border-4 border-black overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-charcoal border-b-4 border-black text-xs uppercase tracking-widest text-white font-black">
                <th className="p-6">Rank</th>
                <th className="p-6">Member</th>
                <th className="p-6 text-center">Streak</th>
                <th className="p-6 text-right">Problems Solved</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user, idx) => (
                <motion.tr 
                  key={user._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b-4 border-black hover:bg-gray-100 transition-colors last:border-b-0"
                >
                  <td className="p-6 font-black text-2xl text-charcoal">
                    #{idx + 1}
                    {idx < 3 && <Trophy className={`inline ml-3 w-8 h-8 ${idx === 0 ? 'text-primary' : idx === 1 ? 'text-gray-400' : 'text-amber-600'}`} strokeWidth={2.5} />}
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <img src={user.avatar} alt={user.name} className="w-12 h-12 border-2 border-black neo-shadow-sm bg-gray-200 object-cover" />
                      <div>
                        <div className="font-black text-lg text-charcoal uppercase flex items-center gap-3">
                          {user.name}
                          {user.badge !== 'None' && (
                            <span className="text-[10px] px-2 py-1 bg-primary text-black border-2 border-black neo-shadow-sm uppercase tracking-widest">
                              {user.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 mt-1">
                          <Code size={16} strokeWidth={2.5} /> {user.platform}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <span className="inline-flex items-center justify-center gap-2 text-charcoal font-black text-xl">
                      <Flame size={24} strokeWidth={2.5} /> {user.streak}
                    </span>
                  </td>
                  <td className="p-6 text-right font-black text-charcoal text-4xl">
                    {user.problemsSolved}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
