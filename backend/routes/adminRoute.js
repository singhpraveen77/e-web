import express from "express"
import { batchUpdateUsers, deleteUser, getAllUsers, getAnyUser, updateUserRole } from "../controllers/userController.js";
import { batchUpdateProducts, createProduct, deleteProduct, getAllAdminProducts, updateProduct } from "../controllers/productController.js";
import { deleteOrder, getAllOrders, updateOrder } from "../controllers/orderController.js";
import { upload } from "../middlewares/multermiddleware.js";

const Router =express.Router();


//user
Router.route("/users").get(getAllUsers)

Router.route("/user/:_id")
    .get(getAnyUser)
    .put(updateUserRole)
    .delete(deleteUser)
Router.route("/users/batch-update").post(batchUpdateUsers)

//product
Router.route("/product/all").get(getAllAdminProducts)
Router.route("/product/new").post(upload.array("images", 6), createProduct)
Router.route("/product/batch-update").post(batchUpdateProducts);

Router.route("/product/:_id")
.put(upload.array("images", 6), updateProduct)
.delete(deleteProduct)

//order
Router.route("/order/all").get(getAllOrders);
Router.route("/order/:_id")
.put(updateOrder)
.delete(deleteOrder);

export default Router


