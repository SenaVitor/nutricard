import pg from "pg";
import env from "./env.js";

const client = new pg.Client(env.dbClient);

export default client;