import express from "express"
import { getAllProducts, getProductDetails, viewAllProducts } from "../controllers/productController.js";

const router =express.Router();

router.get("/all",getAllProducts);
router.get("/viewall",viewAllProducts);
router.get("/:id",getProductDetails);

export default router