import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String },
  image: { type: String },
  category: { type: String }
}, { timestamps: true });

export default mongoose.model('Achievement', achievementSchema);
