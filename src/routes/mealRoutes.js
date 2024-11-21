import express from "express";
import MealController from "../controllers/mealController.js";

const router = express.Router();

router
    .get("/meal", MealController.listMeal)
    .post("/meal/:user_id/:date", MealController.insert)

export default router;