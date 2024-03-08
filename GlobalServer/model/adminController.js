import userModel from "./users";
const Upload = require('./cloudinary');

const uploadFile = async (req, res) => {
    try {
        const upload = await Upload.uploadFileToCloudinary(req.file.path);

        var userModel = new userModel
    } catch (error) {
        
    }
}