import { getImageUrl } from '../../utils/getImageUrl';
import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Pencil, Trash2, Plus, X, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const ProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '', slug: '', description: '', category: '', github: '', liveDemo: '', technologies: '', developedBy: '', image: null, outerImage: null, innerImage: null
  });
  const [outerFile, setOuterFile] = useState(null);
  const [innerFile, setInnerFile] = useState(null);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/admin/projects');
      setProjects(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const openModal = (proj = null) => {
    if (proj) {
      setEditingId(proj._id);
      setFormData({
        title: proj.title, slug: proj.slug, description: proj.description,
        category: proj.category, github: proj.github || '', liveDemo: proj.liveDemo || '',
        technologies: proj.technologies ? proj.technologies.join(', ') : '',
        developedBy: proj.developedBy || '',
        image: proj.image || null, outerImage: proj.outerImage || null, innerImage: proj.innerImage || null
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', slug: '', description: '', category: 'Web Development', github: '', liveDemo: '', technologies: '', developedBy: '', image: null, outerImage: null, innerImage: null });
    }
    setOuterFile(null); setInnerFile(null); setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(k => {
      if (k === 'technologies') {
        const techs = formData[k].split(',').map(t => t.trim()).filter(Boolean);
        techs.forEach(t => data.append('technologies[]', t));
      } else if (k !== 'image' && k !== 'outerImage' && k !== 'innerImage') {
        data.append(k, formData[k]);
      }
    });
    if (outerFile) data.append('outerImage', outerFile);
    if (innerFile) data.append('innerImage', innerFile);

    try {
      if (editingId) {
        const res = await api.put(`/admin/projects/${editingId}`, data);
        setProjects(prev => prev.map(p => p._id === editingId ? res.data : p));
      } else {
        const res = await api.post('/admin/projects', data);
        setProjects(prev => [res.data, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) { alert('Error saving data'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try { 
      await api.delete(`/admin/projects/${id}`); 
      setProjects(prev => prev.filter(p => p._id !== id)); 
    } catch (err) { 
      console.error('Delete error:', err.response || err);
      alert('Error deleting: ' + (err.response?.data?.error || err.message)); 
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black uppercase text-charcoal border-b-4 border-black pb-2">Projects Manager</h2>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-primary px-4 py-2 border-2 border-black font-black uppercase neo-shadow-sm hover:-translate-y-1 transition-transform">
          <Plus size={20} /> Add Project
        </button>
      </div>

      <div className="overflow-x-auto bg-white border-4 border-black neo-shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b-4 border-black">
              <th className="p-4 font-black uppercase border-r-2 border-black w-24">Image</th>
              <th className="p-4 font-black uppercase border-r-2 border-black">Title</th>
              <th className="p-4 font-black uppercase border-r-2 border-black">Category</th>
              <th className="p-4 font-black uppercase w-32 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(p => (
              <tr key={p._id} className="border-b-2 border-gray-200">
                <td className="p-4 border-r-2 border-black">
                  {(p.outerImage || p.image) ? <img src={getImageUrl(p.outerImage || p.image)} className="w-16 h-12 object-cover border-2 border-black" alt={p.title}/> : <ImageIcon/>}
                </td>
                <td className="p-4 font-bold border-r-2 border-black">{p.title}</td>
                <td className="p-4 font-bold border-r-2 border-black">{p.category}</td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => openModal(p)} className="p-2 bg-yellow-300 border-2 border-black hover:bg-yellow-400"><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(p._id)} className="p-2 bg-red-400 border-2 border-black hover:bg-red-500"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white border-4 border-black w-full max-w-2xl max-h-[90vh] overflow-y-auto neo-shadow p-6">
            <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-2">
              <h3 className="text-2xl font-black uppercase">{editingId ? 'Edit' : 'Add'} Project</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={28} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block font-black uppercase mb-1">Title *</label><input type="text" name="title" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} required className="w-full p-2 border-2 border-black" /></div>
                <div><label className="block font-black uppercase mb-1">URL Slug *</label><input type="text" name="slug" value={formData.slug} onChange={e=>setFormData({...formData, slug: e.target.value})} required className="w-full p-2 border-2 border-black" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block font-black uppercase mb-1">Category *</label><input type="text" name="category" value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} required className="w-full p-2 border-2 border-black" /></div>
                <div><label className="block font-black uppercase mb-1">Tech (comma separated)</label><input type="text" name="technologies" value={formData.technologies} onChange={e=>setFormData({...formData, technologies: e.target.value})} className="w-full p-2 border-2 border-black" /></div>
              </div>
              <div><label className="block font-black uppercase mb-1">Description *</label><textarea name="description" value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} required className="w-full p-2 border-2 border-black h-20" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block font-black uppercase mb-1">GitHub URL</label><input type="text" name="github" value={formData.github} onChange={e=>setFormData({...formData, github: e.target.value})} className="w-full p-2 border-2 border-black" /></div>
                <div><label className="block font-black uppercase mb-1">Live Demo URL</label><input type="text" name="liveDemo" value={formData.liveDemo} onChange={e=>setFormData({...formData, liveDemo: e.target.value})} className="w-full p-2 border-2 border-black" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block font-black uppercase mb-1">Developed By</label><input type="text" name="developedBy" value={formData.developedBy} onChange={e=>setFormData({...formData, developedBy: e.target.value})} className="w-full p-2 border-2 border-black" placeholder="e.g. Lokesh Sharma"/></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-black uppercase mb-1">Outer Image (Thumbnail)</label>
                  <div className="flex flex-col gap-2">
                    {(outerFile || formData.outerImage || formData.image) && (
                      <img src={outerFile ? URL.createObjectURL(outerFile) : getImageUrl(formData.outerImage || formData.image)} className="w-full h-24 object-cover border-2 border-black" alt="Preview"/>
                    )}
                    <input type="file" onChange={e => setOuterFile(e.target.files[0])} accept="image/*" className="w-full p-2 border-2 border-black bg-gray-50" />
                  </div>
                </div>
                <div>
                  <label className="block font-black uppercase mb-1">Inner Image (Detail Hero)</label>
                  <div className="flex flex-col gap-2">
                    {(innerFile || formData.innerImage || formData.image) && (
                      <img src={innerFile ? URL.createObjectURL(innerFile) : getImageUrl(formData.innerImage || formData.image)} className="w-full h-24 object-cover border-2 border-black" alt="Preview"/>
                    )}
                    <input type="file" onChange={e => setInnerFile(e.target.files[0])} accept="image/*" className="w-full p-2 border-2 border-black bg-gray-50" />
                  </div>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-4">
                <button type="submit" className="px-6 py-2 bg-black text-white font-black uppercase border-2 border-black hover:-translate-y-1 transition-transform">Save</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
export default ProjectsManager;
