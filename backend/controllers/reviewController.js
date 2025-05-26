import Product from "../models/productmodel.js"

const createProductReview = async(req,res)=>{
    console.log("entered controller !!")
    const {_id:userId,name}=req.user;
    // const {_id:userId,name,avatar}=req.user;
    const {rating,comment,productId}=req.body
    console.log("extracted data !!")
    
    const review={
        userId,
        name,
        // avatar,
        rating:Number(rating),
        comment
    }
    
    console.log(review);
    console.log("review data !!")
    const product=await Product.findById(productId);
    console.log("product data !!")
    console.log(product);
    
    const isReviewed = product.reviews.find(review =>(
        review &&  review.userId && req.user._id && review.userId.toString()===req.user._id.toString()
    ))
    let message;
    // console.log("reviewed comment data !!")
    
    if(isReviewed){
        product.reviews.forEach(review => {
            if(review.userId.toString()===req.user._id.toString()){
                review.comment=comment;
                review.rating=rating;
                review.name=req.user.name;
                // review.avatar=req.user.avatar
                
                
            }
        });
        message="Review updated successfully !!"
        // console.log("reviewed updated successfully !!")
    }
    else {
        product.reviews.push(review);
        product.numberOfReviews=product.reviews.length;
        message="Review added successfully !!"
        // console.log("reviewed updated successfully !!")
    }

    product.ratings=product.reviews.reduce((acc,items)=>items.rating+acc,0)/product.reviews.length;
    await product.save({validateBeforeSave:false});

    return res.status(200).json({
        success:true,
        message:message,
        data:review

    })
}

const getAllReviews= async(req,res)=>{
    const product=await Product.findById(req.query._id);

    if(!product){
        return res.status(400).json({
            success:false,
            message:"Product not found",

        })
    }

    res.status(200).json({
        success:true,
        message:"All reviews fetched successfully",
        data:product.reviews
    })
}

const deleteReview=async(req,res)=>{
    let {productId,reviewId}=req.query;

    if(!productId  || !reviewId){
        return res.status(400).json({
            success:false,
            message:"Productid and reviewId are required !!",

        })
    
    }
    
    let product=await Product.findById(productId);
    
    if(!product){
        return res.status(400).json({
            success:false,
            message:"Product not found !!",

        })
    }

    const updatedReviews= product.reviews.filter((review)=>(review._id.toString()!==reviewId.toString()))

    const totalRating= updatedReviews.reduce((sum,rev)=>sum+rev.rating,0);
    const rating =updatedReviews.length >0 ? totalRating / updatedReviews.length :0;

    product.reviews =updatedReviews;
    product.rating=rating;
    product.numberOfReviews=updatedReviews.length;

    await product.save();

    return res.status(200).json({
        success:true,
        message:"Review deleted successfully !!",
        data:product.reviews

    })

}
export {
    createProductReview,
    getAllReviews,
    deleteReview
}