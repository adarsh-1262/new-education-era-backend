const cloudinary = require('cloudinary').v2;
const fs = require('fs')


const uploadOnCLoudinary = async(localPath) => {

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
  });

  try {
    console.log("localPath ",localPath)
    if(!localPath) return "file not found"
    const response = await cloudinary.uploader.upload(localPath, {
      resource_type: 'auto'
    })
    console.log("file uploaded ",response.url);
    fs.unlinkSync(localPath) // remove local file
    return response
    
  } catch (error) {
    console.log("unable to upload file ",error)
    fs.unlinkSync(localPath) // remove local file
    return null
  }
}

module.exports = uploadOnCLoudinary;