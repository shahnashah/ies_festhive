import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  mobile: String,
  branch: String,
  enrollment: String,
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
});

// Prevent OverwriteModelError
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
