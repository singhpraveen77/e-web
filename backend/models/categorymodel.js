import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        // enum: [
        //     "laptop",
        //     "mobile",
        //     "watch",
        //     "camera",
        //     "headphone",
        //     "tablet",
        //     "accessories",
        //     "other"
        // ],
        required: [true, "please enter category name !!"],
        trim: true,
    },
    // products: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "Product",
    //     }
    // ]
}, { timestamps: true });