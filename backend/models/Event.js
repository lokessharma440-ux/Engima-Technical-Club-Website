import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  label: { type: String, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['text', 'email', 'phone', 'number', 'textarea', 'select', 'radio', 'yes/no', 'checkbox'] 
  },
  required: { type: Boolean, default: false },
  options: [{ type: String }],
  order: { type: Number, default: 0 },
  validationRules: { type: mongoose.Schema.Types.Mixed }
});

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, // e.g., 'Hackathon', 'Workshop', 'Competition'
  date: { type: String, required: true },
  endDate: { type: Date }, // Used for automatic classification into Previous Events
  time: { type: String, required: true },
  venue: { type: String, required: true },
  image: { type: String }, // URL or local path
  bannerImage: { type: String }, // URL or local path for the inner box wide poster
  gallery: [{ type: String }],
  registrationDeadline: { type: Date }, // Updated to Date format, existing strings won't break if handled carefully, but Date is preferred
  registrationOpen: { type: Boolean, default: true },
  registrationLimit: { type: Number, default: 0 }, // 0 implies unlimited
  registeredCount: { type: Number, default: 0 },
  externalRegistrationLink: { type: String },
  published: { type: Boolean, default: true },
  formQuestions: [questionSchema]
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);
