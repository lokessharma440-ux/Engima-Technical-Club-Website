import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  title: { type: String, default: 'Gallery Image' },
  image: { type: String, required: true },
  colSpan: { type: String, default: 'md:col-span-1' },
  rowSpan: { type: String, default: 'md:row-span-1' }
}, { timestamps: true });

export default mongoose.model('Gallery', gallerySchema);
