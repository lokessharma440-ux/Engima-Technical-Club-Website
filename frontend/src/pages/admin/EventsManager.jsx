import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Pencil, Trash2, Plus, X, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const EventsManager = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '', slug: '', description: '', category: 'Workshop', date: '', endDate: '', time: '', venue: ''
  });
  const [file, setFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  
  const [galleryModalEvent, setGalleryModalEvent] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try { 
      const res = await api.get('/admin/events'); 
      setEvents(res.data); 
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const openModal = (evt = null) => {
    if (evt) {
      setEditingId(evt._id);
      setFormData({
        title: evt.title, slug: evt.slug, description: evt.description, category: evt.category,
        date: evt.date, endDate: evt.endDate ? evt.endDate.split('T')[0] : '', time: evt.time, venue: evt.venue
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', slug: '', description: '', category: 'Workshop', date: '', endDate: '', time: '', venue: '' });
    }
    setFile(null);
    setBannerFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(k => {
      if (k === 'endDate' && !formData[k]) return; // Skip empty dates
      data.append(k, formData[k]);
    });
    if (file) data.append('image', file);
    if (bannerFile) data.append('bannerImage', bannerFile);

    try {
      if (editingId) await api.put(`/admin/events/${editingId}`, data);
      else await api.post('/admin/events', data);
      fetchEvents(); setIsModalOpen(false);
    } catch (err) { alert('Error saving data'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try { 
      await api.delete(`/admin/events/${id}`); 
      fetchEvents(); 
    } catch (err) { 
      console.error('Delete error:', err.response || err);
      alert('Error deleting: ' + (err.response?.data?.error || err.message)); 
    }
  };

  const openGalleryModal = (evt) => {
    setGalleryModalEvent(evt);
    setGalleryFiles([]);
  };

  const handleGalleryUpload = async (e) => {
    e.preventDefault();
    if (galleryFiles.length === 0) return;
    const data = new FormData();
    Array.from(galleryFiles).forEach(file => data.append('images', file));
    try {
      const res = await api.post(`/admin/events/${galleryModalEvent._id}/gallery`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setGalleryFiles([]);
      setGalleryModalEvent(res.data);
      fetchEvents();
    } catch (err) { alert('Error uploading images'); }
  };

  const handleGalleryRemove = async (imgPath) => {
    if (!window.confirm('Remove this image?')) return;
    try {
      const res = await api.put(`/admin/events/${galleryModalEvent._id}/gallery/remove`, { imgPath });
      setGalleryModalEvent(res.data);
      fetchEvents();
    } catch (err) { alert('Error removing image'); }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black uppercase text-charcoal border-b-4 border-black pb-2">Events Manager</h2>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-primary px-4 py-2 border-2 border-black font-black uppercase neo-shadow-sm hover:-translate-y-1 transition-transform">
          <Plus size={20} /> Add Event
        </button>
      </div>

      <div className="overflow-x-auto bg-white border-4 border-black neo-shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b-4 border-black">
              <th className="p-4 font-black uppercase border-r-2 border-black w-24">Image</th>
              <th className="p-4 font-black uppercase border-r-2 border-black">Title</th>
              <th className="p-4 font-black uppercase border-r-2 border-black">Category</th>
              <th className="p-4 font-black uppercase border-r-2 border-black">Date</th>
              <th className="p-4 font-black uppercase w-32 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(e => (
              <tr key={e._id} className="border-b-2 border-gray-200">
                <td className="p-4 border-r-2 border-black">
                  {e.image ? <img src={`http://localhost:5000${e.image}`} className="w-16 h-12 object-cover border-2 border-black" alt={e.title}/> : <ImageIcon/>}
                </td>
                <td className="p-4 font-bold border-r-2 border-black">{e.title}</td>
                <td className="p-4 font-bold border-r-2 border-black">{e.category}</td>
                <td className="p-4 font-bold border-r-2 border-black">{e.date}</td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => openGalleryModal(e)} className="p-2 bg-blue-300 border-2 border-black hover:bg-blue-400" title="Manage Gallery"><ImageIcon size={16} /></button>
                    <button onClick={() => openModal(e)} className="p-2 bg-yellow-300 border-2 border-black hover:bg-yellow-400" title="Edit"><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(e._id)} className="p-2 bg-red-400 border-2 border-black hover:bg-red-500" title="Delete"><Trash2 size={16} /></button>
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
              <h3 className="text-2xl font-black uppercase">{editingId ? 'Edit' : 'Add'} Event</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={28} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block font-black uppercase mb-1">Title *</label><input type="text" name="title" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} required className="w-full p-2 border-2 border-black" /></div>
                <div><label className="block font-black uppercase mb-1">URL Slug *</label><input type="text" name="slug" value={formData.slug} onChange={e=>setFormData({...formData, slug: e.target.value})} required className="w-full p-2 border-2 border-black" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block font-black uppercase mb-1">Start Date (String) *</label><input type="text" name="date" value={formData.date} onChange={e=>setFormData({...formData, date: e.target.value})} required placeholder="e.g. 24th Oct 2026" className="w-full p-2 border-2 border-black" /></div>
                <div><label className="block font-black uppercase mb-1">End Date (For Classification)</label><input type="date" name="endDate" value={formData.endDate} onChange={e=>setFormData({...formData, endDate: e.target.value})} className="w-full p-2 border-2 border-black" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block font-black uppercase mb-1">Time *</label><input type="text" name="time" value={formData.time} onChange={e=>setFormData({...formData, time: e.target.value})} required className="w-full p-2 border-2 border-black" /></div>
                <div><label className="block font-black uppercase mb-1">Venue *</label><input type="text" name="venue" value={formData.venue} onChange={e=>setFormData({...formData, venue: e.target.value})} required className="w-full p-2 border-2 border-black" /></div>
              </div>
              <div><label className="block font-black uppercase mb-1">Category *</label><input type="text" name="category" value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} required className="w-full p-2 border-2 border-black" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block font-black uppercase mb-1">Outer Card Poster</label><input type="file" onChange={e => setFile(e.target.files[0])} accept="image/*" className="w-full p-2 border-2 border-black bg-gray-50" /></div>
                <div><label className="block font-black uppercase mb-1">Inner Wide Banner</label><input type="file" onChange={e => setBannerFile(e.target.files[0])} accept="image/*" className="w-full p-2 border-2 border-black bg-gray-50" /></div>
              </div>
              <div><label className="block font-black uppercase mb-1">Description *</label><textarea name="description" value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} required className="w-full p-2 border-2 border-black h-20" /></div>
              <div className="pt-4 flex justify-end gap-4">
                <button type="submit" className="px-6 py-2 bg-black text-white font-black uppercase border-2 border-black hover:-translate-y-1 transition-transform">Save</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {galleryModalEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white border-4 border-black w-full max-w-4xl max-h-[90vh] overflow-y-auto neo-shadow p-6">
            <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-2">
              <h3 className="text-2xl font-black uppercase">Gallery: {galleryModalEvent.title}</h3>
              <button onClick={() => setGalleryModalEvent(null)}><X size={28} /></button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {galleryModalEvent.gallery && galleryModalEvent.gallery.length > 0 ? (
                galleryModalEvent.gallery.map((img, idx) => (
                  <div key={idx} className="relative group border-4 border-black aspect-square bg-gray-200">
                    <img src={img.startsWith('http') ? img : `http://localhost:5000${img}`} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <button onClick={() => handleGalleryRemove(img)} className="p-2 bg-red-500 border-2 border-black hover:bg-red-600"><Trash2 className="text-white" size={20}/></button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 font-bold text-gray-500">No images in gallery yet.</div>
              )}
            </div>

            <form onSubmit={handleGalleryUpload} className="flex gap-4 items-end bg-gray-100 p-4 border-4 border-black">
              <div className="flex-1">
                <label className="block font-black uppercase mb-1">Upload New Images</label>
                <input type="file" multiple accept="image/*" onChange={(e) => setGalleryFiles(e.target.files)} className="w-full p-2 border-2 border-black bg-white" />
              </div>
              <button type="submit" disabled={galleryFiles.length === 0} className="px-6 py-2 bg-primary text-black font-black uppercase border-2 border-black hover:-translate-y-1 transition-transform disabled:opacity-50 disabled:hover:transform-none">
                Upload
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
export default EventsManager;
