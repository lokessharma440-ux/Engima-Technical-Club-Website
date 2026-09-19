import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String },
  content: { type: String },
  author: { type: String, required: true },
  authorImage: { type: String },
  date: { type: String },
  readTime: { type: String },
  category: { type: String },
  image: { type: String }
}, { timestamps: true });

export default mongoose.model('Blog', blogSchema);
