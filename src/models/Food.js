import db from "../config/db.js";

class Food {
    constructor(name, unit_of_measure, image, calories, fat, carbohydrates, sodium, fiber, protein) {
        this.name = name;
        this.unit_of_measure = unit_of_measure;
        this.image = image;
        this.calories = calories;
        this.fat = fat;
        this.carbohydrates = carbohydrates;
        this.sodium = sodium;
        this.fiber = fiber;
        this.protein = protein;
    }
    
    static getFood = async (params) => {
        try{
            let dbQuery = `select * from food where name like '%${params.query}%'`; 
            if(params.sort) dbQuery += ` order by ${params.sort}`;
            if(params.sortDirection) dbQuery += ` ${params.sortDirection}`;
            dbQuery += ` limit ${params.number}`;
            console.log(dbQuery)
            const food = await db.query(dbQuery);
            // console.log("food " + JSON.stringify(food));
            return food.rows;
        }catch(e) {
            console.error("Erro " + e);
        }
    }
    
    static getFoodsByIds = async (ids) => {
        try{
            const dbQuery = `select * from food where food_id = ANY($1::int[]);`;
            const food = await db.query(dbQuery, [ids]);
            // console.log("food " + JSON.stringify(food));
            return food.rows;
        }catch(e) {
            console.error("Erro " + e);
        }
    }
    
    static getFoodsByMeal = async (id) => {
        try{
            const dbQuery = `select food_id from meal_food where meal_id = $1`;
            const foodIds = await db.query(dbQuery, [id]);
            const foods = await this.getFoodsByIds(foodIds.rows.map(row => row.food_id));
            console.log("foods " + JSON.stringify(foods));
            return foods;
        }catch(e) {
            console.error("Erro " + e);
        }
    }

    static insert = async (food) => {
        const dbQuery = `
            insert into food 
                (food_id, name, unit_of_measure, image, calories, fat, carbohydrates, sodium, fiber, protein) 
            values 
                (${food.id}, '${food.name}', '${food.nutrition.weightPerServing.unit}', '${food.image}', 
                ${this.getNutrient(food, "Calories")}, ${this.getNutrient(food, "Fat")}, 
                ${this.getNutrient(food, "Carbohydrates")}, ${this.getNutrient(food, "Sodium")}, 
                ${this.getNutrient(food, "Fiber")}, ${this.getNutrient(food, "Protein")})
        `;
        await db.query(dbQuery);
        return 'Alimento criado com sucesso!';
    }

    static getNutrient = (food, name) => {
        try{
            return food.nutrition.nutrients.find(nutrient => nutrient.name === name).amount;
        }catch(error){
            console.error(`Erro ao acessar o nutriente ${name} do alimento ${food.name}: ${error}`);
            return 0;
        }
    }
}

export default Food;