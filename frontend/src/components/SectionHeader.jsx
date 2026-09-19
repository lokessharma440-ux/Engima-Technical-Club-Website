import React from 'react';
import { motion } from 'framer-motion';

const SectionHeader = ({ number, title, description, dark = false }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }}
      className={`mb-16 border-l-4 border-black pl-6 ${dark ? 'text-white border-primary' : 'text-charcoal'}`}
    >
      <div className="flex items-center gap-4 mb-4">
        {number && (
          <span className={`font-mono text-sm font-bold px-2 py-1 border-2 border-black ${dark ? 'bg-primary text-black' : 'bg-primary text-black'} neo-shadow-sm`}>
            {number}
          </span>
        )}
        <span className="tracking-widest uppercase text-sm font-bold">
          {title}
        </span>
      </div>
      <h2 className={`text-4xl md:text-5xl font-bold mb-4 uppercase leading-tight ${dark ? 'text-white' : 'text-charcoal'}`}>
        {title}
      </h2>
      {description && (
        <p className={`max-w-2xl text-lg font-medium ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
          {description}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeader;
