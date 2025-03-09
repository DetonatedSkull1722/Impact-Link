// routes/secureFileRoutes.js
// this file is for admin purposes only
// we have made this so tha whenver a file is generated it is not made publically available and only can be accessed by the admin using the credentials we are using 
import express from 'express';
import { getSignedFileUrl } from '../config/firebaseHelper.js';

const router = express.Router();

router.get('/signed-url', async (req, res) => {
  try {
    const { filePath } = req.query;
    if (!filePath) {
      return res.status(400).json({ error: 'filePath query parameter is required' });
    }
    const signedUrl = await getSignedFileUrl(filePath);
    res.json({ signedUrl });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
