import express from "express";
import MealController from "../controllers/mealController.js";

const router = express.Router();

router
    .get("/meal/:user_id/:start_date/:end_date", MealController.listMeal)
    .get("/meal/:name/:start_date/:end_date", MealController.listMealByName)
    .get("/meal/favorites/:user_id", MealController.listFavoriteMeals)
    .post("/meal/favorites", MealController.insertFavoriteMeal)
    .post("/meal/create", MealController.insert)
    .put("/meal/update", MealController.update)
    .delete("/meal/:meal_id", MealController.deleteMeal)
    .delete("/meal/:meal_id/food/:food_id", MealController.deleteFood)

export default router;