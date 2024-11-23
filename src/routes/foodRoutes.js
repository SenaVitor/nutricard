import express from "express";
import FoodController from "../controllers/foodController.js";

const router = express.Router();

router
    .get("/food", FoodController.listFood)
    .get("/food/:id", FoodController.listFoodById)
    .get("/food/meal/:id", FoodController.listFoodByMeal)

export default router;