import { getImageUrl } from '../utils/getImageUrl';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Terminal, ExternalLink, Users, Tag, Code } from 'lucide-react';
import api from '../api';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${id}`);
        setProject(res.data);
      } catch (err) {
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-2xl uppercase tracking-widest">Loading...</div>;
  if (!project) return <div className="min-h-screen flex items-center justify-center font-black text-2xl uppercase tracking-widest">Project not found</div>;

  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#FAFAFA]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/projects" className="inline-flex items-center text-charcoal hover:bg-primary border-2 border-transparent hover:border-black transition-colors mb-8 font-black uppercase tracking-widest py-1 px-2">
          <ArrowLeft size={24} className="mr-2" strokeWidth={3} /> Back to Projects
        </Link>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="neo-card p-0 mb-16 overflow-hidden">
          <div className="w-full h-[40vh] md:h-[50vh] border-b-4 border-black relative bg-gray-200">
            <img src={getImageUrl(project.innerImage || project.image)} alt={project.title} className="w-full h-full object-cover" />
          </div>
          
          <div className="p-8 md:p-12 bg-white">
            <div className="flex flex-wrap gap-4 mb-6">
              <span className="flex items-center px-4 py-2 bg-primary text-black font-black uppercase tracking-widest text-xs border-2 border-black neo-shadow-sm">
                <Tag size={16} className="mr-2" strokeWidth={3} /> {project.category}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black mb-6 uppercase text-charcoal leading-none">{project.title}</h1>
            <p className="text-xl text-gray-700 mb-10 leading-relaxed font-medium border-l-8 border-primary pl-4">{project.description}</p>
            
            <div className="flex flex-wrap gap-6 mb-12 pb-12 border-b-4 border-black">
              {project.github && project.github !== '#' && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center px-8 py-4 bg-white text-black border-2 border-black font-black uppercase tracking-widest neo-btn">
                  <Terminal size={24} className="mr-3" strokeWidth={2.5} /> View Source
                </a>
              )}
              {project.liveDemo && project.liveDemo !== '#' && (
                <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className="flex items-center px-8 py-4 bg-primary text-black border-2 border-black font-black uppercase tracking-widest neo-btn">
                  <ExternalLink size={24} className="mr-3" strokeWidth={2.5} /> Live Demo
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-2">
                <h3 className="text-3xl font-black mb-6 uppercase text-charcoal tracking-tight">Project Overview</h3>
                <div className="text-gray-800 leading-relaxed font-medium text-lg whitespace-pre-wrap">
                  {project.detailedDescription || project.description}
                </div>
              </div>
              
              <div className="space-y-10">
                <div>
                  <h3 className="text-xl font-black mb-6 flex items-center uppercase tracking-widest border-b-4 border-primary pb-2 inline-block"><Code className="text-black mr-2" strokeWidth={3} /> Technologies</h3>
                  <div className="flex flex-wrap gap-3">
                    {project.technologies?.map((tech, i) => (
                      <span key={i} className="px-4 py-2 bg-[#FAFAFA] border-2 border-black text-xs font-bold uppercase tracking-widest text-charcoal neo-shadow-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                {project.developedBy && (
                  <div>
                    <h3 className="text-xl font-black mb-6 flex items-center uppercase tracking-widest border-b-4 border-primary pb-2 inline-block"><Users className="text-black mr-2" strokeWidth={3} /> Developed By</h3>
                    <div className="text-gray-800 flex items-center font-bold text-lg">
                      <div className="w-4 h-4 bg-primary border-2 border-black mr-4 neo-shadow-sm"></div>
                      {project.developedBy}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {project.screenshots && project.screenshots.length > 0 && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h3 className="text-3xl font-black mb-8 uppercase text-charcoal border-l-8 border-primary pl-4 tracking-tight">Screenshots</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {project.screenshots.map((img, i) => (
                <div key={i} className="h-64 overflow-hidden neo-card p-0 border-4 border-black bg-gray-200">
                  <img src={img} alt={`Screenshot ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
