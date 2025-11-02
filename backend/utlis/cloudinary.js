import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
// import {uploadOnCloudinary,deleteFromCloudinary} from "cloudinary"



const uploadOnCloudinary = async (localFilepath, folder) => {
    

    if (!localFilepath || typeof localFilepath != 'string') {
        throw new Error("localFilepath is required")
    }
    if (!folder || typeof folder !== 'string') {

        throw new Error("folder is required")

    }
    //upload file

    try {
        const response = await cloudinary.uploader.upload(localFilepath, {
            folder: `ShopNest/${folder}`,
            resource_type: "auto",
            fetch_format: "auto",      // serve modern formats (WebP/AVIF)
            quality: "70",      // optimize compression while keeping good visual quality
            transformation: [
                {
                width: 1000,           // target width
                height: 750,           // target height → 4:3 landscape aspect ratio
                crop: "fill",          // crop + resize while preserving proportions
                gravity: "auto",       // focus on the main subject automatically
                },
            ],
            });

        //file removed for the local folder
        return response;
    }
    catch (error) {
        console.log(error);
        
        throw new Error("error in uploading the file")
    }
    finally {
        try {
            fs.unlinkSync(localFilepath);
        }
        catch (error) {
            throw new Error("error in removing the file")
        }
    }
}

const deleteFromCloudinary = async (public_id) => {

    if (!public_id || typeof public_id !== 'string') {
        throw new Error("public_id is required")
    }

    try {
        const result = await cloudinary.uploader.destroy(public_id);

        return result;

    }
    catch (error) {
        throw new Error(" error in deleting the file")

    }
}

export { uploadOnCloudinary, deleteFromCloudinary }





