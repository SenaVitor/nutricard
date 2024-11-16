import express from "express";
import UserController from "../controllers/userController.js";

const router = express.Router();

router
    .post("/user/create", UserController.register)
    .post("/user/login", UserController.login)

export default router;