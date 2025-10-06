import Order from "../models/ordermodel.js"
import Product from "../models/productmodel.js"

const newOrder=async(req,res)=>{

    const {
        shippingInfo,    
        orderItems,
        paymentInfo,       
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,        
    }=req.body;

    const order= await Order.create({
        shippingInfo,
        // orderStatus,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id,
        // deliveredAt

    })

    if(!order){
        return res.status(400).json({
               success:false,
               message:"order not created !!",
    
           })

    }
     return res.status(200).json({
               success:true,
               message:"order  created successfully !!",
               data:order
    
        })
}

const getSingleOrder=async (req,res)=>{
    let order=await Order.findById(req.params.id).populate("user","name email");

    if(!order){
        return res.status(400).json({
               success:false,
               message:"orders not fetched  !!",
    
           })

    }
     return res.status(200).json({
               success:true,
               message:"order  fetched successfully !!",
               data:order
    
        })
}
const myOrders=async (req,res)=>{
    
    console.log(req.user);
    
    if(!req.user || !req.user._id){
        return  res.status(400).json({
            success:false,
            message:"user not found in orders",
        })
    }

    let orders=await Order.find({user:req.user._id});

    if(!orders){
        return res.status(400).json({
               success:false,
               message:"orders not fetched  !!",
    
           })

    }
     return res.status(200).json({
               success:true,
               message:"order  fetched successfully !!",
               data:orders
    
        })
}

//get all orders By Admin

const getAllOrders=async(req,res)=>{
    let orders= await Order.find();

    if(!orders){
        return res.status(400).json({
               success:false,
               message:"order not fetched by admin !!",
    
           })

    }
     return res.status(200).json({
               success:true,
               message:"order  fetched by admin successfully !!",
               data:orders
    
        })
}

const updateOrder=async (req,res)=>{
    try{
        const order=await Order.findById(req.params._id);
    
    if(!order){
        return res.status(400).json({
               success:false,
               message:"order not fetched by admin !!",
    
           })

    }

    for(const item of order.orderItems) {
        if((order.orderStatus === "PENDING" || order.orderStatus === "PROCESSING" || order.orderStatus === "CANCELLED") && (req.body.status === "SHIPPED" || req.body.status === "DELIVERED")) {
            await updateStock(item.productId, item.quantity, "decrease");
        }

        else if((order.orderStatus === "SHIPPED" || order.orderStatus === "DELIVERED" ) && (req.body.status === "CANCELLED" || req.body.status === "PROCESSING" || req.body.status === "PENDING")) {
            await updateStock(item.productId, item.quantity, "increase");
        }
        else{
            
            return res.status(200).json({
                success:true,
                message:"status checking condition false !!",
        
            })
        }
    }

        order.orderStatus = req.body.status;

        if (req.body.status === "DELIVERED") {
            order.deliveredAt = Date.now();
        }

        await order.save({ validateBeforeSave: false })
        
        return res.status(200).json({
               success:true,
               message:"status updated successfully  !!",
    
           })
    }
    catch(err){
        return res.status(400).json({
               success:false,
               message: err.message,
    
           })

    }
}

async function updateStock(id,quantity,status){
            let product= await Product.findById(id);

            console.log("entered",id);
            
            if(!product){
                
                throw new Error("product not found !!");
                
                
            }
            console.log("product :",product);
            if(status==="decrease"){
                if(product.stock<quantity) {
                    console.log("quantity less :",product.stock);
                    throw new Error("insufficient product stock !!");
                    
                }
                console.log("quantity sufficient :",product.stock);
            product.stock-=quantity;
            
        }
        if(status==="increase"){
            product.stock+=quantity;
            
        }
        
        console.log("updated stock :",product.stock);
        product.save({validateBeforeSave:false})
    }

const deleteOrder = async(req,res)=>{
    let order= await Order.findById(req.params._id);

    if(!order){
        return res.status(400).json({
               success:false,
               message:"order not found !!",
    
           })
    }

    await order.deleteOne();

    return res.status(200).json({
               success:true,
               message:"order deleted successfully !!",
    
           })
}

export {
    newOrder,
    getSingleOrder,
    myOrders,
    getAllOrders,
    updateOrder,
    deleteOrder
}
        
        

    

   
 
    
    




