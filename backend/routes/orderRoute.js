import express from "express"
import { verifyJWT } from "../middlewares/authmiddleware.js";
import { getSingleOrder, myOrders, newOrder } from "../controllers/orderController.js";

const router =express.Router();

router.route("/new").post(verifyJWT,newOrder);
router.route("/myorder").get(verifyJWT,myOrders);
router.route("/:id").get(verifyJWT,getSingleOrder);

export default router;
