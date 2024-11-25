import express from "express";
import FoodController from "../controllers/foodController.js";

const router = express.Router();

router
    .get("/food", FoodController.listFood)
    .get("/food/:id", FoodController.listFoodById)
    .get("/food/meal/:id", FoodController.listFoodByMeal)
    .get("/food/favorites/:user_id", FoodController.listFavoritesFood)
    .post("/food/favorites", FoodController.insertFavoriteFood)

export default router;