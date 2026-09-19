import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Pencil, Trash2, Plus, X, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const TeamManager = ({ categoryFilter, title }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    category: categoryFilter || 'Technical Team',
    bio: '',
    github: '',
    linkedin: ''
  });
  const [file, setFile] = useState(null);

  const categories = [
    'Mentors', 'Coordinator', 'Report & Analysis Team', 
    'Development Team', 'Social Media Team', 'Technical Team', 'Videography & Editing Team'
  ];

  useEffect(() => {
    fetchMembers();
  }, [categoryFilter]);

  const fetchMembers = async () => {
    try {
      const res = await api.get('/admin/members');
      const filtered = categoryFilter 
        ? res.data.filter(m => m.category === categoryFilter)
        : res.data.filter(m => !['Mentors', 'Coordinator'].includes(m.category));
      setMembers(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (member = null) => {
    if (member) {
      setEditingId(member._id);
      setFormData({
        name: member.name,
        role: member.role,
        category: member.category,
        bio: member.bio || '',
        github: member.github || '',
        linkedin: member.linkedin || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        role: '',
        category: categoryFilter || 'Technical Team',
        bio: '',
        github: '',
        linkedin: ''
      });
    }
    setFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (file) data.append('image', file);

    try {
      if (editingId) {
        await api.put(`/admin/members/${editingId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/admin/members', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      fetchMembers();
      setIsModalOpen(false);
    } catch (err) {
      alert('Error saving data');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await api.delete(`/admin/members/${id}`);
      fetchMembers();
    } catch (err) {
      alert('Error deleting');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black uppercase text-charcoal border-b-4 border-black pb-2">{title}</h2>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary px-4 py-2 border-2 border-black font-black uppercase neo-shadow-sm hover:-translate-y-1 transition-transform"
        >
          <Plus size={20} /> Add New
        </button>
      </div>

      <div className="overflow-x-auto bg-white border-4 border-black neo-shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b-4 border-black">
              <th className="p-4 font-black uppercase border-r-2 border-black w-24">Image</th>
              <th className="p-4 font-black uppercase border-r-2 border-black">Name</th>
              <th className="p-4 font-black uppercase border-r-2 border-black">Role</th>
              {!categoryFilter && <th className="p-4 font-black uppercase border-r-2 border-black">Team</th>}
              <th className="p-4 font-black uppercase w-32 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center font-bold">No records found.</td></tr>
            ) : (
              members.map(member => (
                <tr key={member._id} className="border-b-2 border-gray-200 hover:bg-gray-50">
                  <td className="p-4 border-r-2 border-black">
                    {member.image ? (
                      <img src={`http://localhost:5000${member.image}`} alt={member.name} className="w-12 h-12 object-cover border-2 border-black rounded-full" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 border-2 border-black rounded-full flex items-center justify-center"><ImageIcon size={20}/></div>
                    )}
                  </td>
                  <td className="p-4 font-bold border-r-2 border-black">{member.name}</td>
                  <td className="p-4 font-bold border-r-2 border-black">{member.role} {member.role === 'Team Head' && '👑'}</td>
                  {!categoryFilter && <td className="p-4 font-bold border-r-2 border-black">{member.category}</td>}
                  <td className="p-4 border-r-2 border-black">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => openModal(member)} className="p-2 bg-yellow-300 border-2 border-black hover:bg-yellow-400"><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(member._id)} className="p-2 bg-red-400 border-2 border-black hover:bg-red-500"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white border-4 border-black w-full max-w-2xl max-h-[90vh] overflow-y-auto neo-shadow">
            <div className="flex justify-between items-center p-6 border-b-4 border-black bg-primary">
              <h3 className="text-2xl font-black uppercase tracking-tight">{editingId ? 'Edit' : 'Add'} {title.split(' ')[0]}</h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:text-red-600"><X size={28} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block font-black uppercase mb-1">Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border-2 border-black" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-black uppercase mb-1">Role *</label>
                  <input type="text" name="role" value={formData.role} onChange={handleChange} required placeholder="e.g. Member, Team Head" className="w-full p-2 border-2 border-black" />
                </div>
                {!categoryFilter && (
                  <div>
                    <label className="block font-black uppercase mb-1">Team Category *</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border-2 border-black bg-white">
                      {categories.filter(c => !['Mentors', 'Coordinator'].includes(c)).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                )}
              </div>
              <div>
                <label className="block font-black uppercase mb-1">Profile Image</label>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} accept="image/*" className="w-full p-2 border-2 border-black bg-gray-50" />
                <p className="text-xs font-bold text-gray-500 mt-1">Leave empty to keep existing image</p>
              </div>
              <div>
                <label className="block font-black uppercase mb-1">Bio / Specialty</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} className="w-full p-2 border-2 border-black h-24" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-black uppercase mb-1">LinkedIn URL</label>
                  <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full p-2 border-2 border-black" />
                </div>
                <div>
                  <label className="block font-black uppercase mb-1">GitHub URL</label>
                  <input type="url" name="github" value={formData.github} onChange={handleChange} className="w-full p-2 border-2 border-black" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border-2 border-black font-black uppercase hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-black text-white font-black uppercase border-2 border-black hover:-translate-y-1 transition-transform">Save</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
};

export default TeamManager;
