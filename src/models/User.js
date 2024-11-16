import db from "../config/db.js";

class User {
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

    static getUsers = async () => {
        try{
            const dbQuery = `select user_id, name, mail, height, weight, calorie_goal, calories_consumed, bmi  
                from user_data`
            const users = await db.query(dbQuery);
            return users.rows;
        }catch(e) {
            console.error("Erro ao buscar usuários " + e);
        }
    }

    static getUserById = async (id) => {
        try{
            const dbQuery = `select user_id, name, mail, height, weight, calorie_goal, calories_consumed, bmi
                from user_data where user_id  = ${id}`
            const user = await db.query(dbQuery);
            return user.rows;
        }catch(e) {
            console.error("Usuário não cadastrado " + e);
        }
    }

    static login = async (mail, password) => {
        try{
            const dbQuery = `select user_id, name, mail, height, weight, calorie_goal, calories_consumed, bmi 
                from user_data where mail = $1 and password = $2`
            const user = await db.query(dbQuery, [mail, password]);
            return user.rows.length > 0 ? user.rows : "Email ou Senha Incorretos!";
        }catch(e) {
            console.error("Erro ao realizar login", e);
        }
    }

    static insert = async (user) => {
        try{
            console.log(JSON.stringify(user));
            user.bmi = user.bmi || (user.weight / (user.height * user.height));
            if(!user.calories_consumed) user.calories_consumed = 0;
            if(!user.calorie_goal) user.calorie_goal = 2000;
            // const bmiCategory = this.getCategory(user.bmi);
            const bmiCategory = "teste";
            const dbQuery = `
                insert into user_data 
                    (name, mail, password, height, weight, calorie_goal, calories_consumed, bmi, bmiCategory)
                values 
                    ('${user.name}', '${user.mail}', '${user.password}', ${user.height}, ${user.weight}, 
                    ${user.calorie_goal}, ${user.calories_consumed}, ${user.bmi}, '${bmiCategory}')
            `;
            await db.query(dbQuery);
            return 'Usuário criado com sucesso!';
        }catch(error) {
            console.error("Erro ao adicionar novo usuário " + error);
        }
    }

    static getCategory(bmi){
        if(bmi <= 18.5){
            return "Abaixo do peso";
        }else if(bmi <= 24.9){
            return "Peso ideal";
        }else if(bmi <= 29.9){
            return "Sobrepeso";
        }else if(bmi <= 34.9){
            return "Obesidade grau I";
        }else if(bmi <= 39.9){
            return "Obesidade grau II";
        }else{
            return "Obesidade mórbida";
        }
    }
}

export default User;