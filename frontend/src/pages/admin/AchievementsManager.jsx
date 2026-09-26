import { getImageUrl } from '../../utils/getImageUrl';
import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Pencil, Trash2, Plus, X, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const AchievementsManager = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({ title: '', description: '', date: '', category: '', image: null });
  const [file, setFile] = useState(null);

  useEffect(() => { fetchAchievements(); }, []);

  const fetchAchievements = async () => {
    try { const res = await api.get('/admin/achievements'); setAchievements(res.data); } 
    catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingId(item._id);
      setFormData({ title: item.title, description: item.description, date: item.date || '', category: item.category || '', image: item.image || null });
    } else {
      setEditingId(null);
      setFormData({ title: '', description: '', date: '', category: 'Competition', image: null });
    }
    setFile(null); setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(k => data.append(k, formData[k]));
    if (file) data.append('image', file);

    try {
      if (editingId) {
        const res = await api.put(`/admin/achievements/${editingId}`, data);
        setAchievements(prev => prev.map(a => a._id === editingId ? res.data : a));
      } else {
        const res = await api.post('/admin/achievements', data);
        setAchievements(prev => [res.data, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) { alert('Error saving data'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this achievement?')) return;
    try { 
      await api.delete(`/admin/achievements/${id}`); 
      setAchievements(prev => prev.filter(a => a._id !== id)); 
    } catch (err) { 
      console.error('Delete error:', err.response || err);
      alert('Error deleting: ' + (err.response?.data?.error || err.message)); 
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black uppercase text-charcoal border-b-4 border-black pb-2">Achievements Manager</h2>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-primary px-4 py-2 border-2 border-black font-black uppercase neo-shadow-sm hover:-translate-y-1 transition-transform">
          <Plus size={20} /> Add Achievement
        </button>
      </div>

      <div className="overflow-x-auto bg-white border-4 border-black neo-shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b-4 border-black">
              <th className="p-4 font-black uppercase border-r-2 border-black w-24">Image</th>
              <th className="p-4 font-black uppercase border-r-2 border-black">Title</th>
              <th className="p-4 font-black uppercase border-r-2 border-black">Date</th>
              <th className="p-4 font-black uppercase w-32 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {achievements.map(a => (
              <tr key={a._id} className="border-b-2 border-gray-200">
                <td className="p-4 border-r-2 border-black">
                  {a.image ? <img src={getImageUrl(a.image)} className="w-16 h-12 object-cover border-2 border-black" alt={a.title}/> : <ImageIcon/>}
                </td>
                <td className="p-4 font-bold border-r-2 border-black">{a.title}</td>
                <td className="p-4 font-bold border-r-2 border-black">{a.date}</td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => openModal(a)} className="p-2 bg-yellow-300 border-2 border-black hover:bg-yellow-400"><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(a._id)} className="p-2 bg-red-400 border-2 border-black hover:bg-red-500"><Trash2 size={16} /></button>
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
              <h3 className="text-2xl font-black uppercase">{editingId ? 'Edit' : 'Add'} Achievement</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={28} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block font-black uppercase mb-1">Title *</label><input type="text" name="title" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} required className="w-full p-2 border-2 border-black" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block font-black uppercase mb-1">Date</label><input type="text" name="date" value={formData.date} onChange={e=>setFormData({...formData, date: e.target.value})} className="w-full p-2 border-2 border-black" placeholder="e.g. October 2026"/></div>
                <div><label className="block font-black uppercase mb-1">Category</label><input type="text" name="category" value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} className="w-full p-2 border-2 border-black" /></div>
              </div>
              <div><label className="block font-black uppercase mb-1">Description *</label><textarea name="description" value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} required className="w-full p-2 border-2 border-black h-20" /></div>
              <div>
                <label className="block font-black uppercase mb-1">Image / Certificate</label>
                <div className="flex items-center gap-4">
                  {(file || formData.image) && (
                    <img src={file ? URL.createObjectURL(file) : getImageUrl(formData.image)} className="w-16 h-16 object-cover border-2 border-black" alt="Preview"/>
                  )}
                  <input type="file" onChange={e => setFile(e.target.files[0])} accept="image/*" className="flex-1 p-2 border-2 border-black bg-gray-50" />
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
export default AchievementsManager;
