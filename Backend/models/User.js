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
    // This field is optional if using Firebase authentication
  },
  userNGO: {
    type: String,
    default: "", // If the user associates with an NGO, store its identifier here
  },
  userNGOrole: {
    type: String,
    default: "", // Store the NGO role if applicable; otherwise, an empty string
  },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
