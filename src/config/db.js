import pg from "pg";
import env from "./env.js";

const pool = new pg.Pool(env.pool);

export default pool;