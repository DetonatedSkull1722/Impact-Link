import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['user', 'ngo'],
    default: 'user',
  },
  points: {
    type: Number,
    default: 0,
  },
  password: {
    type: String,
    // This field is optional if you are using Firebase authentication
  },
}, { timestamps: true });


const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;