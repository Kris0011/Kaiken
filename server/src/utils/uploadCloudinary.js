const cloudinary = require("../config/cloudinary");



const uploadImageToCloudinary = async (fileBuffer) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: "events" },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        ).end(fileBuffer);
    });
};

module.exports = uploadImageToCloudinary;
