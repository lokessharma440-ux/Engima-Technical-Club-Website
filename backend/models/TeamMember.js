import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  category: { type: String, required: true }, // 'Patron', 'Core', 'New', 'Alumni'
  image: { type: String },
  bio: { type: String },
  branch: { type: String },
  specialty: { type: String },
  quote: { type: String },
  email: { type: String },
  linkedin: { type: String },
  github: { type: String }
}, { timestamps: true });

export default mongoose.model('TeamMember', teamMemberSchema);
