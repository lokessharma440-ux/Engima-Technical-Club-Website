import { getImageUrl } from '../../utils/getImageUrl';
import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Trash2, Plus, X, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const GalleryManager = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    colSpan: 'md:col-span-1',
    rowSpan: 'md:row-span-1'
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await api.get('/admin/gallery');
      setImages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select an image");
      return;
    }
    const data = new FormData();
    data.append('image', file);
    data.append('colSpan', formData.colSpan);
    data.append('rowSpan', formData.rowSpan);

    try {
      const res = await api.post('/admin/gallery', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setImages(prev => [res.data, ...prev]);
      setIsModalOpen(false);
      setFile(null);
    } catch (err) {
      alert('Error uploading image');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await api.delete(`/admin/gallery/${id}`);
      setImages(prev => prev.filter(img => img._id !== id));
    } catch (err) {
      alert('Error deleting');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black uppercase text-charcoal border-b-4 border-black pb-2">Gallery Manager</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary px-4 py-2 border-2 border-black font-black uppercase neo-shadow-sm hover:-translate-y-1 transition-transform"
        >
          <Plus size={20} /> Upload Photo
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {images.map(img => (
          <div key={img._id} className="relative group border-4 border-black neo-shadow bg-gray-200 aspect-square">
            {img.image ? (
              <img src={getImageUrl(img.image)} alt="Gallery item" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><ImageIcon size={48} className="text-gray-400"/></div>
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button onClick={() => handleDelete(img._id)} className="p-4 bg-red-500 border-2 border-black hover:bg-red-600 hover:-translate-y-1 transition-transform">
                <Trash2 size={24} className="text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white border-4 border-black w-full max-w-lg p-6 neo-shadow">
            <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-2">
              <h3 className="text-2xl font-black uppercase tracking-tight">Upload Image</h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:text-red-600"><X size={28} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-black uppercase mb-1">Select Image *</label>
                <div className="flex flex-col gap-2">
                  {file && (
                    <img src={URL.createObjectURL(file)} className="w-32 h-32 object-cover border-2 border-black" alt="Preview"/>
                  )}
                  <input type="file" onChange={(e) => setFile(e.target.files[0])} accept="image/*" required className="w-full p-2 border-2 border-black bg-gray-50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-black uppercase mb-1">Column Span</label>
                  <select name="colSpan" value={formData.colSpan} onChange={(e) => setFormData({...formData, colSpan: e.target.value})} className="w-full p-2 border-2 border-black bg-white">
                    <option value="md:col-span-1">1 Column (Default)</option>
                    <option value="md:col-span-2">2 Columns (Wide)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-black uppercase mb-1">Row Span</label>
                  <select name="rowSpan" value={formData.rowSpan} onChange={(e) => setFormData({...formData, rowSpan: e.target.value})} className="w-full p-2 border-2 border-black bg-white">
                    <option value="md:row-span-1">1 Row (Default)</option>
                    <option value="md:row-span-2">2 Rows (Tall)</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border-2 border-black font-black uppercase hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-black text-white font-black uppercase border-2 border-black hover:-translate-y-1 transition-transform">Upload</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GalleryManager;
