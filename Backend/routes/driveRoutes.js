import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

import Drive from '../models/Drive.js';
import User from '../models/User.js';
import { bucket } from '../config/firebase.js'; // from your firebase.js config

const router = express.Router();

// 1) Multer setup: using memoryStorage to pass file buffer to Firebase
const upload = multer({ storage: multer.memoryStorage() });

/**
 * Utility function to upload a file buffer to Firebase Storage
 * @param {Buffer} fileBuffer - The file buffer from multer
 * @param {string} originalName - Original file name
 * @param {string} customName - Custom file name you want to assign
 * @returns {string} - Public URL of the uploaded file
 */
async function uploadImageToFirebase(fileBuffer, originalName, customName) {
  // Example: Construct final file name => {customName}_{uuid}_{originalName}
  const finalFileName = `${customName}_${uuidv4()}_${originalName}`;

  // Create a file object in the Firebase bucket
  const file = bucket.file(finalFileName);

  // Upload file buffer
  await file.save(fileBuffer, {
    metadata: {
      contentType: 'image/png', // or detect dynamically
    },
    public: true, // Make file publicly readable
  });

  // Get public URL
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
  return publicUrl;
}

/**
 * 1) GET /api/drives
 *    Fetch all drives (for carousel or general listing).
 */
router.get('/', async (req, res) => {
  try {
    const drives = await Drive.find().populate('createdBy', 'name email');
    res.json(drives);
  } catch (error) {
    console.error('Error fetching drives:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * 2) POST /api/drives/create
 *    Create a new drive/initiative, including image upload to Firebase.
 *    Using multer to handle the "image" field in the form-data.
 */
router.post('/create', upload.single('image'), async (req, res) => {
  try {
    // Destructure fields from request body
    const { title, description, date, location, createdBy } = req.body;
    let imageUrl = '';

    // If an image is uploaded, push to Firebase
    if (req.file) {
      // Build a custom name for the file, e.g., date_nameOfNGO_time_random
      // For demonstration, we’ll just do "date_title" + a UUID
      const customFileName = `${Date.now()}_${(title || 'drive')}`;
      imageUrl = await uploadImageToFirebase(
        req.file.buffer,
        req.file.originalname,
        customFileName
      );
    }

    // Create the drive in MongoDB
    const newDrive = await Drive.create({
      title,
      description,
      date,
      location,
      imageUrl,
      createdBy,
      participants: [],
    });

    res.status(201).json({
      message: 'Drive created successfully',
      drive: newDrive,
    });
  } catch (error) {
    console.error('Error creating drive:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * 3) POST /api/drives/:id/participate
 *    A user participates in a drive by adding their user ID to the participants array.
 *    Optionally, increment user points.
 */
router.post('/:id/participate', async (req, res) => {
  try {
    const { userId } = req.body; // ID of the user who wants to participate
    const driveId = req.params.id;

    // Find the drive and update participants
    const drive = await Drive.findById(driveId);
    if (!drive) {
      return res.status(404).json({ error: 'Drive not found' });
    }

    // Check if user already in participants
    if (drive.participants.includes(userId)) {
      return res
        .status(400)
        .json({ error: 'User is already participating in this drive' });
    }

    drive.participants.push(userId);
    await drive.save();

    // Optionally, update user points
    const user = await User.findById(userId);
    if (user) {
      user.points = (user.points || 0) + 1;
      await user.save();
    }

    res.json({ message: 'Participation successful', drive });
  } catch (error) {
    console.error('Error participating in drive:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
