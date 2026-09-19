import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../components/SectionHeader';
import api from '../api';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await api.get('/gallery');
        setImages(res.data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchImages();
  }, []);

  return (
    <div className="min-h-screen py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionHeader 
        number="08"
        title="Life at ENIGMA"
        description="A glimpse into our events, hackathons, and the vibrant community that makes it all happen."
      />

      <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[250px] gap-6">
        {loading ? (
          <div className="col-span-4 text-center font-bold text-2xl uppercase py-20 animate-pulse">Loading Gallery...</div>
        ) : images.map((img, idx) => (
          <motion.div
            key={img._id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: (idx % 10) * 0.1 }}
            className={`overflow-hidden border-4 border-black bg-gray-200 relative group neo-shadow ${img.colSpan || 'md:col-span-1'} ${img.rowSpan || 'md:row-span-1'} cursor-pointer hover:-translate-y-1 hover:-translate-x-1 transition-transform`}
          >
            <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 mix-blend-multiply"></div>
            <img src={img.image?.startsWith('http') ? img.image : `http://localhost:5000${img.image}`} alt={img.title || 'Gallery item'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
