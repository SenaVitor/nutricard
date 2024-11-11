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
    
    static getFood = async (query, number) => {
        try{
            const dbQuery = `select * from food where name like %${query}% limit ${number}`
            const food = await db.query(dbQuery);
            console.log("food " + food);
            return food.rows;
        }catch(e) {
            console.error("Erro " + e);
        }
    }

    async insert(food){
        const dbQuery = `
            insert into food 
                (name, unit_of_measure, image, calories, fat, saturated_fat, carbohydrates, sugar, sodium, fiber) 
            values 
                (${food.name}, ${food.unit_of_measure}, ${food.image}, ${getNutrient(food, "Calories")}, ${getNutrient(food, "Fat")}, ${getNutrient(food, "Saturated Fat")}, 
                ${getNutrient(food, "Carbohydrates")}, ${getNutrient(food, "Sugar")}, ${getNutrient(food, "Sodium")}, ${getNutrient(food, "Fiber")})
        `;
        const result = await db.query(dbQuery);
        return result;
    }

    getNutrient(food, name){
        return food.nutrition.nutrients.find(nutrient => nutrient.name === name);
    }
}

export default Food;