import db from "../config/db.js";
import Food from "./Food.js";
import User from "./User.js";

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
    
    static getMealById = async (meal_id) => {
        try{
            const dbQuery = `select * from meal where meal_id = '${meal_id}'`;
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
                calories += Number(food.calories);
                fat += Number(food.fat);
                carbohydrates += Number(food.carbohydrates);
                sodium += Number(food.sodium);
                fiber += Number(food.fiber);
                protein += Number(food.protein);
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
            const today = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
            const startDate = meal.start_date;
            const endDate = meal.end_date;
            const operation = "+";
            if (startDate <= today && endDate >= today) await User.setCalories(meal.user_id, operation, calories);

            return { meal_id: meal_id, message: "Refeição inserida com sucesso!" };
        } catch (error) {
            console.error("Erro ao inserir a refeição:", error);
            throw new Error("Erro ao cadastrar a refeição.");
        }
    }
    
    static update = async (meal) => {
        try{
            // let calories = 0, fat = 0, carbohydrates = 0, sodium = 0, fiber = 0, protein = 0;
            // meal.foods.forEach(food => {
            //     calories += food.calories;
            //     fat += food.fat;
            //     carbohydrates += food.carbohydrates;
            //     sodium += food.sodium;
            //     fiber += food.fiber;
            //     protein += food.protein;
            // });
            let dbQuery = `select * from meal where meal_id = $1`;
            const dbMeal = await db.query(dbQuery, [meal.meal_id]);
            dbQuery = `update meal set `;

            if(meal.name && dbMeal.name !== meal.name) dbQuery += `name = '${meal.name}'`; 
            if(meal.start_date && dbMeal.start_date !== meal.start_date) 
                dbQuery += `, set start_date = '${meal.start_date}'`;
            if(meal.end_date && dbMeal.end_date !== meal.end_date) dbQuery += `, end_date = '${meal.end_date}'`; 
            // if(dbMeal.calories !== calories) dbQuery += `, calories = ${calories}`;
            // if(dbMeal.fat !== fat) dbQuery += `, fat = ${fat}`;
            // if(dbMeal.carbohydrates !== carbohydrates) dbQuery += `, carbohydrates = ${carbohydrates}`;
            // if(dbMeal.sodium !== sodium) dbQuery += `, sodium = ${sodium}`;
            // if(dbMeal.fiber !== fiber) dbQuery += `, fiber = ${fiber}`;
            // if(dbMeal.protein !== protein) dbQuery += `, protein = '${protein}'`;
            
            const today = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
            const oldStartDate = new Date(dbMeal.start_date).toISOString().split('T')[0];
            const oldEndDate = new Date(dbMeal.end_date).toISOString().split('T')[0];
            const newStartDate = new Date(meal.start_date).toISOString().split('T')[0];
            const newEndDate = new Date(meal.end).toISOString().split('T')[0];
            // if(oldStartDate <= today && oldEndDate >= today && !(newStartDate <= today && newEndDate >= today)) {
            const operation = "-";
            await User.setCalories(meal.user_id, operation, dbMeal.calories);
            // }

            dbQuery += ` where meal_id = ${meal.meal_id}`; 

            await db.query(dbQuery);
            
            // dbQuery = `update meal_food where meal_id = '${1}' and food_id = ${2} set amount = ${3}`;
            // for(const food of meal.foods) {
            //     const foodQuery = `select amount from meal_food where meal_id = ${1} and food_id = '${2}'`;
            //     let values = [meal_id, food_id];
            //     const foodAmount = await db.query(foodQuery, values);
            //     const amount = foodAmount.rows[0].amount;
            //     if(food.amound !== amount) {
            //         values = [meal.meal_id, food.food_id, food.amount]
            //         await db.query(dbQuery, values);
            //     }
            // };
            return { meal_id: meal.meal_id, message: "Refeição inserida com sucesso!" };
        } catch (error) {
            console.error("Erro ao inserir a refeição:", error);
            throw new Error("Erro ao cadastrar a refeição.");
        }
    }
    
    static deleteMeal = async (meal_id) => {
        try{
            const dbQuery = `delete from meal where meal_id = $1 returning calories, start_date, end_date`;
            const result = await db.query(dbQuery, [meal_id]);
            
            if (result.rowCount === 0) {
                return false;
            }
            
            const meal = result.rows[0];
            // const today = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
            // const startDate = meal.start_date;
            // const endDate = meal.end_date;
            const operation = "-";
            // if (startDate <= today && endDate >= today) await User.setCalories(meal.user_id, operation, meal.calories);
            await User.setCalories(meal.user_id, operation, meal.calories);
            
            return true;
        }catch(e) {
            console.error("Erro ao deletar refeição" + e);
            throw new Error("Erro ao deletar refeição.");
        }
    }

    static deleteFood = async (meal_id, food_id) => {
        try{
            let dbQuery = `delete from meal_food where meal_id = $1 and food_id = $2 returning amount`;
            const result = await db.query(dbQuery, [meal_id, food_id]);
            
            if (result.rowCount === 0) {
                return false;
            }
            
            let dbMeal = await this.getMealById(meal_id);
            dbMeal = dbMeal[0];
            let food = await Food.getFoodsByIds([food_id]);
            food = food[0];
            const amount = result.rows[0].amount;
            const calories = dbMeal.calories - (food.calories * amount); 
            const fat = dbMeal.fat - (food.fat * amount); 
            const carbohydrates = dbMeal.carbohydrates - (food.carbohydrates * amount); 
            const sodium = dbMeal.sodium - (food.sodium * amount);
            const fiber = dbMeal.fiber - (food.fiber * amount);
            const protein = dbMeal.protein - (food.protein * amount);
            dbMeal.calories -= calories; 
            dbMeal.fat -= fat;
            dbMeal.carbohydrates -= carbohydrates; 
            dbMeal.sodium -= sodium;
            dbMeal.fiber -= fiber;
            dbMeal.protein -= protein; 

            dbQuery = `
                update meal set calories = ${dbMeal.calories}, fat = ${dbMeal.fat}, 
                carbohydrates = ${dbMeal.carbohydrates}, sodium = ${dbMeal.sodium}, fiber = ${dbMeal.fiber}, 
                protein = ${dbMeal.protein} where meal_id = ${meal_id}
            `;

            await db.query(dbQuery);

            // const today = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
            // const startDate = dbMeal.start_date;
            // const endDate = dbMeal.end_date;
            // if (startDate <= today && endDate >= today) {
            const operation = "-";
            await User.setCalories(dbMeal.user_id, operation, food.calories);
            // } 

            return dbMeal;
        }catch(e) {
            console.error("Erro ao deletar alimento" + e);
            throw new Error("Erro ao deletar alimento.");
        }
    }

}

export default Meal;