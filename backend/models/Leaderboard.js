import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String },
  platform: { type: String },
  problemsSolved: { type: Number, default: 0 },
  globalRank: { type: Number },
  badge: { type: String },
  streak: { type: Number, default: 0 },
  avatar: { type: String }
}, { timestamps: true });

export default mongoose.model('Leaderboard', leaderboardSchema);
