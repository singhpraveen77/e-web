 const mongoose = require('mongoose');

 const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter name !!"],
        trim:true,
    },
    description:{
        type:String,
        required:[true,"please enter description !!"],

    },
    price:{
        type:Number,
        required:[true,"please enter price !!"],
    },
    rating:{
        type:Number,
        // enum:[0,1,2,3,4,5],
        default:0,
    },
    images:[
        {
            public_id:{
                type:String,
                required:true,
            },
            url:{
                type:String,
                required:true,
            }
        }
    ],
    category:{
        type:String,
        required:[true,"please enter category !!"],
        
    },

    // category:[
    //     {
    //         type:String,
    //         required:true,
    //         enum:[
    //             "laptop",
    //             "mobile",
    //             "watch",
    //             "camera",
    //             "headphone",
    //             "tablet",
    //             "accessories",
    //             "other"
    //         ]

            
    //     },
    // ],

    stock:{
        type:Number,
        required:[true,"please enter stock !!"],
        maxLength:[4,"stock cannot exceed 4 digits"],

        default:1,
    },
    numOfReviews:{
        type:Number,
        default:0,
    },
    reviews:[
        {
            userId: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            avatar: {
                public_id: {
                    type: String,
                },
                url: {
                    type: String,
                },
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            },
        }
    ],
    user:{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    }

    

    
 },{
    timestamps:true,
 })

 const Product = mongoose.model("Product",productSchema);
module.exports = Product;