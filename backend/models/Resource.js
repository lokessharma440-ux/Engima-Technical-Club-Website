import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, // 'dsa', 'core', 'dev', 'interview'
  difficulty: { type: String },
  tags: [{ type: String }],
  link: { type: String },
  isFeatured: { type: Boolean, default: false },
  type: { type: String } // e.g., 'Coding Sheet', 'YouTube Course'
}, { timestamps: true });

export default mongoose.model('Resource', resourceSchema);
