import express from "express";
import FoodController from "../controllers/foodController.js";

const router = express.Router();

router
    .get("/food", FoodController.listFood)
    .get("/food/name", FoodController.listFoodByName)

export default router;