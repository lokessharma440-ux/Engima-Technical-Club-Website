import React from 'react';
import { motion } from 'framer-motion';
import { Target, Lightbulb, Users, Zap } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';

const About = () => {
  return (
    <div className="min-h-screen py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <SectionHeader 
        number="01"
        title="About ENIGMA"
        description="Enigma Technical Club is the flagship technology community of AIMT, founded with the mission to bridge the gap between academics and industry. Through hackathons, workshops, guest lectures, and project-based learning, Enigma empowers students to become creators, problem-solvers, and future tech leaders."
      />

      {/* Manifesto & Pillars */}
      <div className="mb-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="neo-card p-12 bg-primary mb-16"
        >
          <div className="flex items-center mb-8">
            <span className="text-black font-black uppercase tracking-widest text-sm border-2 border-black px-3 py-1 bg-white neo-shadow-sm">// The Manifesto</span>
          </div>
          <p className="text-charcoal leading-relaxed text-2xl md:text-4xl font-bold uppercase tracking-tight">
            Enigma is the official technical club of the Computer Science & Engineering department at Ambalika Institute of Management & Technology — a place where students learn by building, teach by sharing, and grow by competing. We are student-run, student-built, and student-led.
          </p>
          <div className="w-full h-2 bg-black my-8"></div>
          <p className="text-black leading-none text-4xl md:text-6xl font-black uppercase">
            We exist to turn curiosity into craft.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: "Innovation", desc: "We explore cutting-edge technologies and implement real solutions to real-world problems — not just tutorials, but shipped work." },
            { icon: Users, title: "Community", desc: "A student-driven family. Build meaningful connections with passionate technologists and collaborate on ambitious projects." },
            { icon: Target, title: "Growth", desc: "Develop technical skills, leadership, and professional expertise through hands-on experience — from freshman to flagship lead." }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
              className="neo-card p-8 bg-white flex flex-col group"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="p-3 bg-primary border-2 border-black neo-shadow-sm text-black group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                  <item.icon size={32} strokeWidth={2.5} />
                </div>
                <span className="font-black text-charcoal text-2xl">0{idx + 1}</span>
              </div>
              <h3 className="text-3xl font-black mb-4 uppercase">{item.title}</h3>
              <p className="text-gray-700 font-medium leading-relaxed flex-grow">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
        className="neo-card p-12 bg-charcoal text-white relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-4 bg-primary border-b-4 border-black"></div>
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 pt-4 text-center">
          <div>
            <div className="text-6xl md:text-8xl font-black text-primary mb-2" style={{ WebkitTextStroke: '2px black' }}>50+</div>
            <div className="text-white font-bold uppercase tracking-widest text-sm">Events Conducted</div>
          </div>
          <div>
            <div className="text-6xl md:text-8xl font-black text-primary mb-2" style={{ WebkitTextStroke: '2px black' }}>1.2k</div>
            <div className="text-white font-bold uppercase tracking-widest text-sm">Active Members</div>
          </div>
          <div>
            <div className="text-6xl md:text-8xl font-black text-primary mb-2" style={{ WebkitTextStroke: '2px black' }}>30+</div>
            <div className="text-white font-bold uppercase tracking-widest text-sm">Workshops</div>
          </div>
          <div>
            <div className="text-6xl md:text-8xl font-black text-primary mb-2" style={{ WebkitTextStroke: '2px black' }}>15</div>
            <div className="text-white font-bold uppercase tracking-widest text-sm">Major Projects</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
