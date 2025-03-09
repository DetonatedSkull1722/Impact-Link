import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import NGO from '../models/NGO.js';
import User from '../models/User.js';
import { bucket } from '../config/firebase.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

async function uploadFileToFirebase(fileBuffer, fileName, folderPath, mimeType) {
  const finalFileName = `${folderPath}/${fileName}_${uuidv4()}`;
  const file = bucket.file(finalFileName);
  await file.save(fileBuffer, {
    metadata: {
      contentType: mimeType,
    },
    public: true,
  });
  return `https://storage.googleapis.com/${bucket.name}/${file.name}`;
}

router.post('/register', upload.fields([
  { name: 'certificate', maxCount: 1 },
  { name: 'aadhar', maxCount: 1 }
]), async (req, res) => {
  try {
    const { ngoName, ownerName, ownerEmail, password } = req.body;
    if (!req.files || !req.files.certificate || !req.files.aadhar) {
      return res.status(400).json({ error: 'Both certificate and aadhar files are required' });
    }
    
    // Define folder path for NGO_Information/{ngoName}
    const folderPath = `NGO_Information/${ngoName}`;

    const certificateFile = req.files.certificate[0];
    const aadharFile = req.files.aadhar[0];

    const certificateFileName = `${ngoName}_${ownerName}_certificate`;
    const aadharFileName = `${ngoName}_${ownerName}_aadhar`;

    const certificateUrl = await uploadFileToFirebase(
      certificateFile.buffer,
      certificateFileName,
      folderPath,
      certificateFile.mimetype || 'application/octet-stream'
    );

    const aadharUrl = await uploadFileToFirebase(
      aadharFile.buffer,
      aadharFileName,
      folderPath,
      aadharFile.mimetype || 'application/octet-stream'
    );

    // Hash the password for secure storage
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new NGO record with the provided details and hashed password
    const newNGO = new NGO({
      ngoName,
      ownerName,
      ownerEmail,
      ngoValidationCertificateUrl: certificateUrl,
      ownerAadharUrl: aadharUrl,
      password: hashedPassword,
    });
    await newNGO.save();

    // Create a corresponding User record for login using NGO owner's credentials
    const newUser = new User({
      name: ownerName,
      email: ownerEmail,
      password: hashedPassword,
      role: 'owner', // Mark this user as an owner of an NGO
      userNGO: ngoName,
      userNGOrole: 'owner'
    });
    await newUser.save();

    res.status(201).json({
      message: 'NGO registered successfully',
      ngo: newNGO,
    });
  } catch (error) {
    console.error('NGO registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
