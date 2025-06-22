import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import userSlice from "../slices/userSlice.js"

// import { configureStore } from '@reduxjs/toolkit';
// import productSlice from "../slices/userSlice.js"
// import cartSlice from "../slices/cartSlice.js";
// import orderSlice from "../slices/orderSlice.js"
// import reviewSlice from "../slices/reviewSlice.js"
// import adminSlice from "../slices/adminSlice.js"
const store = configureStore({
    reducer: {
        // productsData: productSlice,
        userData: userSlice,
        // cartData: cartSlice,
        // orderData: orderSlice,
        // reviewData: reviewSlice,
        // adminData: adminSlice,
        cart: cartReducer,
    },
    // preloadedState: {
    //     cartData: {
    //         cartItems: localStorage.getItem("cartItems")
    //             ? JSON.parse(localStorage.getItem("cartItems"))
    //             : [],
    //         shippingInfo: localStorage.getItem("shippingInfo")
    //             ? JSON.parse(localStorage.getItem("shippingInfo"))
    //             : {},
    //     },
    // },
})
export default store;