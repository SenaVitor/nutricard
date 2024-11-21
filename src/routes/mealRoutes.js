import express from "express";
import MealController from "../controllers/mealController.js";

const router = express.Router();

router
    .get("/meal/:user_id/:date", MealController.listMeal)
    .post("/meal", MealController.insert)

export default router;