import Product from "../models/productmodel.js"
import { ApiFeatures } from "../utlis/ApiFeatures.js";
import { ApiResponse } from "../utlis/ApiResponse.js";

import {deleteFromCloudinary, uploadOnCloudinary} from "../utlis/cloudinary.js"

const createProduct= async(req ,res)=>{
    
    const {name,description ,price,category,stock}=req.body;
    req.body.user= req.user._id;
    // console.log(req.user)

    if (!name || !description || !price || !category || !stock) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

    if(!req.files || req.files.length ===0){
        return res.status(400).json({
            success:false,
            message:"images not found",

        })
    }

    const imagesLink=[];

    for( const file of req.files){
            const uploadResponse=await uploadOnCloudinary(file.path,"products");
            if(!uploadResponse){
                return res.status(400).json({
                    success:false,
                    message:"error in uploading the images !!",
        
                })
            }

            imagesLink.push({
                public_id:uploadResponse.public_id,
                url:uploadResponse.url
            })

    }

    const newProduct =await Product.create({
        name,
        description,
        price,
        images:imagesLink,

        category,
        stock,
        user: req.user._id 
    }) 
    

    if(!newProduct){
        return res.status(500).json({
            success:false,
            message:"error in creating the product !!",

        })
    }

    return res.status(201).json({
        success:true,
        message:"Product created successfully !!",
        data:newProduct
    })

}

const getAllProducts = async (req, res) => {

    const resultPerPage = 8;
    const productCount = await Product.countDocuments();
    let apiFeature = new ApiFeatures(Product.find(), req.query).search().filter()
    let products = await apiFeature.query;
    const filteredProductsCount = products.length;
    apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage)
    products = await apiFeature.query;
    res
        .status(200)
        .json(new ApiResponse(200, { products, productCount, filteredProductsCount, resultPerPage }, "All product fetched successfully"))

}
//yeh wala pagination ka system smjh nhi aaya !!

const getProductDetails =async (req,res)=>{

    const products = await Product.findById(req.params.id);

    if(!products){
        return res.status(400).json({
            success:false,
            message:"Products not found",

        })
    }

    return res.status(200).json({
        success:true,
        message:"Product founded successfully !!",
        data:products

    })
}

const getAllAdminProducts=async (req,res)=>{
    let products=await Product.find();

    if(!products){
        return res.status(400).json({
            success:false,
            message:"Products not found",

        })
    }

    return res.status(200).json({
        success:true,
        message:"Product founded successfully !!",
        data:products

    })
}

const viewAllProducts=async (req,res)=>{
    let products=await Product.find();

    if(!products){
        return res.status(400).json({
            success:false,
            message:"Products not found",

        })
    }

    return res.status(200).json({
        success:true,
        message:"Product founded successfully !!",
        data:products

    })
}


const batchUpdateProducts = async (req, res) => {
    console.log("reached the route !!");
    
  try {
    const { updatedStocks = {}, deleted = [] } = req.body;

    const updatePromises = [];
    const deletePromises = [];

    // ✅ Handle stock updates
    for (const [id, newStock] of Object.entries(updatedStocks)) {
      updatePromises.push(
        Product.findByIdAndUpdate(
          id,
          { stock: newStock },
          { new: true, runValidators: true }
        )
      );
    }

    // ✅ Handle deletions (with Cloudinary cleanup)
    for (const id of deleted) {
      const product = await Product.findById(id);
      if (!product) continue;

      // delete from Cloudinary
      for (const image of product.images) {
        await deleteFromCloudinary(image.public_id);
      }

      deletePromises.push(Product.findByIdAndDelete(id));
    }

    // ✅ Execute all operations
    await Promise.all([...updatePromises, ...deletePromises]);

    res.status(200).json({
      success: true,
      message: "Batch update successful ✅",
    });
  } catch (error) {
    console.error("Batch update error:", error);
    res.status(500).json({
      success: false,
      message: "Error performing batch update",
      error: error.message,
    });
  }
};


const updateProduct =async(req,res)=>{
    let {name,description,stock,category,price}=req.body;

    if(!req.files || req.files.length===0){
        const product= await Product.findByIdAndUpdate(
            req.params._id,
            {
                name,
                description,
                stock,
                price,
                category

            },
            {
                new: true,
                runValidators: true,
                useFindAndModify: false
            }
        )

        if(!product){
            return res.status(500).json({
                success:false,
                message:"product not found",
    
            })
    
        }
        return res.status(200).json({
            success:true,
            message:"product updated successfully !!",
            data:product

        })


    }
    else {

        const imageLink=[];
        
        

        for(const file of req.files){
        
            const uploadResponse= await uploadOnCloudinary(file.path,"products");

            if(uploadResponse){
                imageLink.push({
                    public_id: uploadResponse.public_id,
                    url: uploadResponse.url,
                })
            }
            else{
                
                return res.status(500).json({
                    success:false,
                    message:"error in uploading the images of the product !!",
        
                })
            
                
            }
        }

        const product= await Product.findByIdAndUpdate(
            req.params._id,
            {
                name,
                description,
                stock,
                price,
                category,
                images:imageLink

            },
            {
                new: true,
                runValidators: true,
                useFindAndModify: false
            }
        )

        if(!product){
             return res.status(500).json({
            success:false,
            message:"error in creating the product !!",

        })
    
        }

        return res.status(200).json({
            success:true,
            message:"product updated successsfully !!",
            // data: product
        })
        


    }
}

const deleteProduct =async(req,res)=>{
    const product= await Product.findById(req.params._id);

    if(!product){
        return res.status(400).json({
            success:false,
            message:"Products not found",

        })
    }

    for(const image in product.images){
        await deleteFromCloudinary(image.public_id);

    }

    await product.deleteOne();

    return res.status(200).json({
        success:true,
        message:"product deleted successfully !!",

    })

}

export {
    createProduct,
    updateProduct,
    getAllAdminProducts,
    getAllProducts,
    deleteProduct,
    getProductDetails,
    viewAllProducts,
    batchUpdateProducts
    
}