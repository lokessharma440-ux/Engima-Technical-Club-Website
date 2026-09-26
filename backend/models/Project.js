import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  detailedDescription: { type: String },
  image: { type: String },
  technologies: [{ type: String }],
  category: { type: String, required: true }, // Web Development, AI/ML, etc.
  teamMembers: [{ type: String }],
  github: { type: String },
  liveDemo: { type: String },
  screenshots: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
