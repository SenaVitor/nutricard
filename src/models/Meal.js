import db from "../config/db.js";

class Meal {
    constructor(meal_id, name, date, user_id, ) {
        this.meal_id = meal_id;
        this.name = name;
        this.date = date;
        this.user_id = user_id;
    }
    
    static getMeal = async (user_id, date) => {
        try{
            if (!user_id || !date) {
                return res.status(400).json({ message: "Os parâmetros 'userId' e 'date' são obrigatórios." });
            }
            const dbQuery = `select * from meal where user_id = '${user_id}' and date = ${date}`;
            console.log(dbQuery);
            const meal = await db.query(dbQuery);
            return food.rows;
        }catch(e) {
            console.error("Erro " + e);
        }
    }

    static create = async (meal) => {
        try{
            let dbQuery = `
                insert into meal (name, date, user_id) values ($1, $2, $3) returning meal_id
            `;
            const values = [meal.name, meal.date, meal.user_id];
            const { rows } = await db.query(dbQuery, values);
            const meal_id = rows[0].meal_id;
            dbQuery = `
                insert into meal_food (meal_id, food_id, amount) values ($1, $2, $3)
            `;
            for(const food of meal.foods) {
                values = [meal_id, food.food_id, meal.amount]
                await db.query(dbQuery);
            };
            return { meal_id: meal_id, message: "Refeição inserida com sucesso!" };
        } catch (error) {
            console.error("Erro ao inserir a refeição:", error);
            throw new Error("Erro ao cadastrar a refeição.");
        }
    }
}

export default Meal;