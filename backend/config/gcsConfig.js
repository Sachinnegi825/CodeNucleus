import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';
dotenv.config();

// 🛠️ Bulletproof Private Key Formatter
const getFormattedPrivateKey = () => {
  const key = process.env.GCS_PRIVATE_KEY;
  if (!key) return '';
  
  // 1. Remove surrounding quotes if they were accidentally added in the .env
  let formattedKey = key.replace(/^"|"$/g, '');
  
  // 2. Convert literal "\n" strings into actual structural line breaks
  formattedKey = formattedKey.replace(/\\n/g, '\n');
  
  return formattedKey;
};

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  credentials: {
    client_email: process.env.GCS_CLIENT_EMAIL,
    private_key: getFormattedPrivateKey(), // Uses the cleaned key
  }
});

export const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

// Helper: Generate 10-Minute Signed URL for Medical PDFs
export const generateSignedUrl = async (fileKey) => {
  const options = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + 10 * 60 * 1000, // 10 minutes from now
  };

  const [url] = await bucket.file(fileKey).getSignedUrl(options);
  return url;
};