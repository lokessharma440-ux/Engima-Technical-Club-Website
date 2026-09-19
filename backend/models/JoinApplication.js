import mongoose from 'mongoose';

const joinApplicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  department: { type: String },
  year: { type: String },
  rollNumber: { type: String },
  interests: { type: String },
  skills: { type: String },
  motivation: { type: String }
}, { timestamps: true });

export default mongoose.model('JoinApplication', joinApplicationSchema);
