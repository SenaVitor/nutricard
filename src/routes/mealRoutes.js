import express from "express";
import MealController from "../controllers/mealController.js";

const router = express.Router();

router
    .get("/meal/:user_id/:start_date/:end_date", MealController.listMeal)
    .post("/meal/create", MealController.insert)

export default router;