import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
// Parse CLOUDINARY_URL: cloudinary://api_key:api_secret@cloud_name
if (process.env.CLOUDINARY_URL) {
  const url = process.env.CLOUDINARY_URL.replace('cloudinary://', 'https://')
  const parsedUrl = new URL(url)
  cloudinary.config({
    cloud_name: parsedUrl.hostname,
    api_key: parsedUrl.username,
    api_secret: parsedUrl.password,
    secure: true,
  })
} else if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
    secure: true,
  })
}

export default cloudinary

