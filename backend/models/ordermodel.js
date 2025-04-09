import mongoose from 'mongoose';

const orderitemSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter name !!"],
        trim:true,
    },
    price:{
        type:Number,
        required:[true,"please enter price !!"],

    }
    ,
    quantity:{
        type:Number,
        required:[true,"please enter quantity !!"],

    },
    image:{
        type:String,
        required:true,
    },
    productId:{
        type:mongoose .Schema.Types.ObjectId,
        ref:"Product",
        required:true,
    }
})

const orderSchema=new mongoose.Schema({
    shippingInfo:{
        address:{
            type:String,
            required:true,
        },
        city:{
            type:String,
            required:true,
        },
        state:{
            type:String,
            required:true,
        },
        country:{
            type:String,
            required:true,
        },
        pinCode:{
            type:Number,
            required:true,
        },
        phoneNo:{
            type:Number,
            required:true,
        }
    },
    orderStatus:{
        type:String,
        enum:[
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        ],
        default:"Pending",
    },
    orderItems:[orderitemSchema],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    paymentInfo:{
        id:{
            type:String,
            required:true,
        },
        status:{
            type:String,
            required:true,
        }
    },
    paidAt:{
        type:Date,
        required:true,
        default:Date.now,
    },
    itemPrice:{
        type:Number,
        required:true,
        default:0,
    },
    taxPrice:{
        type:Number,
        required:true,
        default:0,
    },
    shippingPrice:{
        type:Number,
        required:true,
        default:0,
    },
    totalPrice:{
        type:Number,
        required:true,
        default:0,
    },
    deliveredAt:{
        type:Date,
    }



},{
    timestamps:true,
});

exports=mongoose.model("Order",orderSchema);
