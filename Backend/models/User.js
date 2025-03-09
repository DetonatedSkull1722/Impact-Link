// Updated User.js
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
    enum: ['user', 'owner'], // Only two roles: user and owner
    default: 'user',
  },
  points: {
    type: Number,
    default: 0,
  },
  password: {
    type: String,
  },
  userNGO: {
    type: String,
    default: "", // If the user is associated with an NGO, store its identifier here
  },
  userNGOrole: {
    type: String,
    default: "", // Store the NGO role if applicable
  },
}, { timestamps: true, minimize: false });

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
