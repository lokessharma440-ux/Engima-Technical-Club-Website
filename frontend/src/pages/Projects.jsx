import { getImageUrl } from '../utils/getImageUrl';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code, ExternalLink, Terminal } from 'lucide-react';
import api from '../api';
import SectionHeader from '../components/SectionHeader';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        setProjects(res.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-2xl uppercase tracking-widest">Loading...</div>;

  return (
    <div className="min-h-screen py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionHeader 
        number="04"
        title="Student Projects"
        description="Explore the innovative solutions and applications built by members of ENIGMA."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {projects.map((project, idx) => (
          <motion.div 
            key={project._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="neo-card p-0 flex flex-col group bg-white border-4 border-black hover:-translate-y-2 transition-transform"
          >
            <div className="h-64 overflow-hidden relative border-b-4 border-black bg-gray-200">
              <img src={getImageUrl(project.outerImage || project.image)} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 right-4 bg-primary px-3 py-1 text-xs font-black text-black border-2 border-black neo-shadow-sm uppercase tracking-widest">
                {project.category}
              </div>
            </div>
            
            <div className="p-8 flex-grow flex flex-col">
              <h3 className="text-3xl font-black mb-4 uppercase text-charcoal">{project.title}</h3>
              <p className="text-gray-700 font-medium leading-relaxed mb-6 flex-grow">{project.description}</p>
              
              <div className="flex flex-wrap gap-3 mb-8">
                {project.technologies?.slice(0,4).map((tech, i) => (
                  <span key={i} className="px-3 py-1 bg-[#FAFAFA] border-2 border-black text-xs font-bold uppercase tracking-widest text-charcoal flex items-center neo-shadow-sm">
                    <Code size={14} strokeWidth={2.5} className="mr-2 text-black" /> {tech}
                  </span>
                ))}
                {project.technologies?.length > 4 && (
                  <span className="px-3 py-1 bg-[#FAFAFA] border-2 border-black text-xs font-bold uppercase tracking-widest text-charcoal neo-shadow-sm">
                    +{project.technologies.length - 4} more
                  </span>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t-4 border-black pt-6 gap-4">
                <div className="flex gap-6">
                  {project.github && project.github !== '#' && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-charcoal hover:text-primary transition-colors flex items-center gap-2 font-black uppercase tracking-widest">
                      <Terminal size={20} strokeWidth={2.5} /> View on GitHub
                    </a>
                  )}
                  {project.liveDemo && project.liveDemo !== '#' && (
                    <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className="text-charcoal hover:text-primary transition-colors flex items-center gap-2 font-black uppercase tracking-widest">
                      <ExternalLink size={20} strokeWidth={2.5} /> Live Demo
                    </a>
                  )}
                </div>
                <Link to={`/projects/${project._id}`} className="px-6 py-3 bg-primary text-black font-black uppercase tracking-widest border-2 border-black neo-shadow-sm text-center hover:translate-x-1 hover:-translate-y-1 transition-transform w-full sm:w-auto">
                  Details
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
