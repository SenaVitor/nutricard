import express from "express";
import UserController from "../controllers/userController.js";

const router = express.Router();

router
    .post("/user/create", UserController.register)
    .post("/user/update", UserController.update)
    .post("/user/login", UserController.login)
    .get("/user/:id", UserController.listUser)

export default router;