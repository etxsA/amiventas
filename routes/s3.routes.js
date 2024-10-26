// routes/s3Routes.js
import express from 'express';
import { generateImageURL, generateUserImageURL} from '../config/s3.js';

const router = express.Router();

router.get('/s3url/image', async (req, res) => {
  try {
    const url = await generateImageURL();
    res.json({ url });
  } catch (err) {
    console.error('Error generating S3 URL for image:', err);
    res.status(400).json({ alert: 'Error generating S3 URL for image' });
  }
});

router.get('/s3url/image/user', async (req, res) => {
  try {
    const url = await generateUserImageURL();
    res.json({ url });
  } catch (err) {
    console.error('Error generating S3 URL for user image:', err);
    res.status(400).json({ alert: 'Error generating S3 URL for user image' });
  }
});

export default router;
