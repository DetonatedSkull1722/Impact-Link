import mongoose from 'mongoose';

const ngoSchema = new mongoose.Schema({
  ngoName: {
    type: String,
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  ownerEmail: {
    type: String,
    required: true,
  },
  ngoValidationCertificateUrl: {
    type: String,
    required: true,
  },
  ownerAadharUrl: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true, minimize: false });

const NGO = mongoose.models.NGO || mongoose.model("NGO", ngoSchema);
export default NGO;
