import mongoose from 'mongoose';

const driveSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  date: {
    type: Date,
    required: true,
  },
  location: String,
  imageUrl: String, // This URL comes from Firebase Storage after the upload
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, { timestamps: true });


const Drive = mongoose.models.Drive || mongoose.model("Drive", driveSchema);
export default Drive;