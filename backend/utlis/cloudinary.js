import{v2 as cloudinary} from cloudinary;
import fs from 'fs';


const uploadOnCloudinary=async (localFilepath,folder)=>{

    if(!localFilepath || typeof localFilepath !='string'){
       throw new Error("localFilepath is required")
    }
    if(!folder || typeof folder !=='string'){
        
        throw new Error("folder is required")

    }
    //upload file

    try{
        const response = await cloudinary.uploader.upload(localFilePath, {
            folder: `ShopNest/${folder}`,
            height: 150,
            width: 150,
            crop: "scale",
            resource_type: "auto",
        });

        //file removed for the local folder
        try{
            fs.unlinkSync(localFilepath)
            

        }
        catch(error){
            throw new Error("error in removing the file")
        }
        return response;
    }
    catch(error){
        throw new Error("error in uploading the file")

        
    }
}

const deleteFromCloudinary= async (public_id)=>{
    
    if(!public_id || typeof public_id!=='string'){
        throw new Error("public_id is required")
    }

    try{
        const result=await cloudinary.uploader.destroy(public_id);
        
        return result;

    }
    catch(error){
        throw new Error(" error in deleting the file")

    }
}

export  {uploadOnCloudinary,deleteFromCloudinary}





