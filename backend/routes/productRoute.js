import express from "express"
import { getAllProducts, getProductDetails } from "../controllers/productController.js";

const router =express.Router();

router.get("/all",getAllProducts);
router.get("/v2/:id",getProductDetails);

export default router