import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  detailedDescription: { type: String },
  image: { type: String },
  outerImage: { type: String },
  innerImage: { type: String },
  technologies: [{ type: String }],
  category: { type: String, required: true },
  teamMembers: [{ type: String }],
  developedBy: { type: String },
  github: { type: String },
  liveDemo: { type: String },
  screenshots: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
