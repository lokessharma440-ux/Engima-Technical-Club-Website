import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Star } from 'lucide-react';
import api from '../api';
import SectionHeader from '../components/SectionHeader';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await api.get('/resources');
        setResources(res.data);
      } catch (err) {
        console.error('Error fetching resources:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-2xl uppercase tracking-widest">Loading...</div>;

  return (
    <div className="min-h-screen py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionHeader 
        number="05"
        title="Learning Resources"
        description="Curated knowledge items to propel your tech career."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {resources.map((resource, idx) => (
          <motion.div 
            key={resource._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="neo-card p-8 flex flex-col h-full bg-white border-4 border-black group hover:-translate-y-2 transition-transform"
          >
            <div className="flex justify-between items-start mb-6 border-b-4 border-black pb-4">
              <span className="text-xs uppercase tracking-widest font-black text-black bg-primary border-2 border-black px-3 py-1 neo-shadow-sm">
                {resource.type}
              </span>
              {resource.isFeatured && <Star className="text-black w-8 h-8 fill-primary" strokeWidth={2.5} />}
            </div>
            <h3 className="text-2xl font-black mb-4 uppercase text-charcoal">{resource.title}</h3>
            <p className="text-gray-700 font-medium mb-8 flex-grow leading-relaxed">{resource.description}</p>
            
            <div className="flex flex-wrap gap-3 mb-8">
              {resource.tags.map(tag => (
                <span key={tag} className="text-xs font-bold uppercase tracking-widest bg-[#FAFAFA] border-2 border-black px-3 py-1 text-charcoal neo-shadow-sm">
                  #{tag}
                </span>
              ))}
            </div>
            
            <a 
              href={resource.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full gap-3 bg-charcoal text-white font-black uppercase tracking-widest py-4 px-6 border-2 border-black neo-shadow hover:translate-y-1 hover:shadow-none transition-all mt-auto"
            >
              Access Resource <ExternalLink size={20} strokeWidth={2.5} />
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Resources;
