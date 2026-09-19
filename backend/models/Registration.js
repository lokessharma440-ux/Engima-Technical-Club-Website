import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  event: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event', 
    required: true 
  },
  registrationId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  qrToken: { 
    type: String, 
    required: true, 
    unique: true 
  },
  participantName: { 
    type: String, 
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    lowercase: true, 
    trim: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  // Store dynamic answers securely linked to the original question ID
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    value: { type: mongoose.Schema.Types.Mixed }
  }],
  registrationStatus: { 
    type: String, 
    enum: ['REGISTERED', 'CANCELLED'], 
    default: 'REGISTERED' 
  },
  checkInStatus: { 
    type: String, 
    enum: ['PENDING', 'CHECKED_IN'], 
    default: 'PENDING' 
  },
  checkInTime: { 
    type: Date 
  },
  checkedInBy: { 
    type: String // Username of the admin/volunteer who checked them in
  }
}, { timestamps: true });

// Prevent a single email from registering multiple times for the exact same event
registrationSchema.index({ event: 1, email: 1 }, { unique: true });

export default mongoose.model('Registration', registrationSchema);
