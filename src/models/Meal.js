import db from "../config/db.js";

class Meal {
    constructor(meal_id, name, date, user_id, calories, fat, carbohydrates, sodium, fiber, protein) {
        this.meal_id = meal_id;
        this.name = name;
        this.date = date;
        this.user_id = user_id;
        this.calories = calories;
        this.fat = fat;
        this.carbohydrates = carbohydrates;
        this.sodium = sodium;
        this.fiber = fiber;
        this.protein = protein;
    }
    
    static getMeal = async (user_id, start_date, end_date) => {
        try{
            const dbQuery = `select * from meal where user_id = '${user_id}' and start_date >= '${start_date}' 
                and end_date <= '${end_date}'`;
            console.log(dbQuery);
            const meal = await db.query(dbQuery);
            return meal.rows;
        }catch(e) {
            console.error("Erro " + e);
        }
    }

    static create = async (meal) => {
        try{
            let calories = 0, fat = 0, carbohydrates = 0, sodium = 0, fiber = 0, protein = 0;
            meal.foods.forEach(food => {
                calories += food.calories;
                fat += food.fat;
                carbohydrates += food.carbohydrates;
                sodium += food.sodium;
                fiber += food.fiber;
                protein += food.protein;
            });
            let dbQuery = `
                insert into meal 
                    (name, start_date, end_date, user_id, calories, fat, carbohydrates, sodium, fiber, protein) 
                values 
                    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning meal_id
            `;
            let values = [
                meal.name, meal.start_date, meal.end_date, meal.user_id, calories, fat, 
                carbohydrates, sodium, fiber, protein
            ];
            const { rows } = await db.query(dbQuery, values);
            const meal_id = rows[0].meal_id;
            dbQuery = `
                insert into meal_food (meal_id, food_id, amount) values ($1, $2, $3)
            `;
            for(const food of meal.foods) {
                values = [meal_id, food.food_id, food.amount]
                await db.query(dbQuery, values);
            };
            return { meal_id: meal_id, message: "Refeição inserida com sucesso!" };
        } catch (error) {
            console.error("Erro ao inserir a refeição:", error);
            throw new Error("Erro ao cadastrar a refeição.");
        }
    }
}

export default Meal;