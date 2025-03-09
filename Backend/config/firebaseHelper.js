// config/firebaseHelper.js
import { bucket } from './firebase.js';

export const getSignedFileUrl = async (filePath) => {
  const file = bucket.file(filePath);
  const [url] = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + 60 * 60 * 1000, // URL valid for 1 hour
  });
  return url;
};
