import db from "../config/db.js";

class Food {
    constructor(name, unit_of_measure, image, calories, fat, saturated_fat, carbohydrates, sugar, sodium, fiber) {
        this.name = name;
        this.unit_of_measure = unit_of_measure;
        this.image = image;
        this.calories = calories;
        this.fat = fat;
        this.saturated_fat = saturated_fat;
        this.carbohydrates = carbohydrates;
        this.sugar = sugar;
        this.sodium = sodium;
        this.fiber = fiber;
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

    static insert = async (food) => {
        const dbQuery = `
            insert into food 
                (food_id, name, unit_of_measure, image, calories, fat, saturated_fat, carbohydrates, sugar, sodium, fiber) 
            values 
                (${food.id}, '${food.name}', '${food.nutrition.weightPerServing.unit}', '${food.image}', 
                ${this.getNutrient(food, "Calories")}, ${this.getNutrient(food, "Fat")}, 
                ${this.getNutrient(food, "Saturated Fat")}, ${this.getNutrient(food, "Carbohydrates")}, 
                ${this.getNutrient(food, "Sugar")}, ${this.getNutrient(food, "Sodium")}, 
                ${this.getNutrient(food, "Fiber")})
        `;
        await db.query(dbQuery);
        return 'Alimento criado com sucesso!';
    }
    
    static getFoodsByIds = async (ids) => {
        try{
            const dbQuery = `select * from food where food_id = ANY($1::int[]);
            `;
            const food = await db.query(dbQuery, [ids]);
            // console.log("food " + JSON.stringify(food));
            return food.rows;
        }catch(e) {
            console.error("Erro " + e);
        }
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