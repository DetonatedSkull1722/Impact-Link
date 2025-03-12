// controllers/SecureFileController.js
import { getSignedFileUrl } from '../config/firebaseHelper.js';

export const getSignedUrl = async (req, res) => {
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
};