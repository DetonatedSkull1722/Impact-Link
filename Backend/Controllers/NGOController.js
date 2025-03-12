// controllers/NGOController.js
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import NGO from '../models/NGO.js';
import User from '../models/User.js';
import { bucket } from '../config/firebase.js';

export const uploadFileToFirebase = async (fileBuffer, fileName, folderPath, mimeType) => {
  const finalFileName = `${folderPath}/${fileName}_${uuidv4()}`;
  const file = bucket.file(finalFileName);
  await file.save(fileBuffer, {
    metadata: {
      contentType: mimeType,
    },
    public: false,
  });
  return `https://storage.googleapis.com/${bucket.name}/${file.name}`;
};

export const registerNGO = async (req, res) => {
  try {
    const { ngoName, ownerName, ownerEmail, password } = req.body;
    if (!req.files || !req.files.certificate || !req.files.aadhar) {
      return res.status(400).json({ error: 'Both certificate and aadhar files are required' });
    }
    
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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newNGO = new NGO({
      ngoName,
      ownerName,
      ownerEmail,
      ngoValidationCertificateUrl: certificateUrl,
      ownerAadharUrl: aadharUrl,
      password: hashedPassword,
    });
    await newNGO.save();

    const newUser = new User({
      name: ownerName,
      email: ownerEmail,
      password: hashedPassword,
      role: 'owner',
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
};