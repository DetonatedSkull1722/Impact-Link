import mongoose from 'mongoose';

const driveSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  startDate: {  // Start date and time of the event
    type: Date,
    required: true,
  },
  endDate: {    // End date and time of the event
    type: Date,
    required: true,
  },
  location: String,
  imageUrl: String, // URL from Firebase Storage after the upload
  role:{
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, { timestamps: true, minimize: false });

const Drive = mongoose.models.Drive || mongoose.model("Drive", driveSchema);
export default Drive;
