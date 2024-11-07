import express from "express";
import food from "./foodRoutes.js";

const routes = (app) => {
    app.route('./').get((req, res) => {
        res.status(200).send({name: "NutriCard"});
    });

    app.use(
        express.json(),
        food,
    )
}

export default routes;