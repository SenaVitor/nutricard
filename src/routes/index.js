import express from "express";
import food from "./foodRoutes.js";
import user from "./userRoutes.js";

const routes = (app) => {
    app.route('./').get((req, res) => {
        res.status(200).send({name: "NutriCard"});
    });

    app.use(
        express.json(),
        food,
        user,
    )
}

export default routes;