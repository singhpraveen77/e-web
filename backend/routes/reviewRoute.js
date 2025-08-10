import express from "express"
import { createProductReview, deleteReview, getAllReviews } from "../controllers/reviewController.js";
import { verifyJWT } from "../middlewares/authmiddleware.js";

const router= express.Router();

router.route("/new").post(verifyJWT,createProductReview)

router.route("/all").get(getAllReviews)
router.route("/delete").post(verifyJWT,deleteReview)

export default router

