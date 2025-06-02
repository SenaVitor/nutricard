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
            throw new Error("Erro ao buscar usuário!");
        }
    }

    static login = async (mail, password) => {
        try{
            const dbQuery = `select user_id, name, mail, height, weight, calorie_goal, calories_consumed, bmi 
                from user_data where mail = $1 and password = $2`
            const user = await db.query(dbQuery, [mail, password]);
            return user.rows.length > 0 ? user.rows : null;
        }catch(e) {
            console.error("Erro ao realizar login", e);
        }
    }

    static insert = async (user) => {
        try{
            user.bmi = user.bmi > 0 ? user.bmi : (user.weight / (user.height * user.height));
            if(!user.goal) user.goal = "perder peso";
            if(!user.calories_consumed) user.calories_consumed = 0;
            if(!user.calorie_goal) user.calorie_goal = this.getCalorieGoal(user) || 0;
            const bmiCategory = this.getCategory(user.bmi);
            const dbQuery = `
                insert into user_data 
                    (name, mail, password, height, weight, calorie_goal, calories_consumed, bmi, bmiCategory, gender, goal)
                values 
                    ('${user.name}', '${user.mail}', '${user.password}', ${user.height}, ${user.weight}, ${user.calorie_goal}, 
                    ${user.calories_consumed}, ${user.bmi}, '${bmiCategory}', '${user.gender}', '${user.goal}')
            `;
            console.log("dbQuery ", dbQuery);
            await db.query(dbQuery);
            return 'Usuário criado com sucesso!';
        }catch(error) {
            console.error("Erro ao adicionar novo usuário " + error);
        }
    }
    
    static update = async (user) => {
        try{
            console.log("atualizar ", user);
            let bmiCategory;
            let updateBMI = false;
            if(user.calories_consumed && user.calories_consumed < 0) user.calories_consumed = 0;
            // if(!user.calorie_goal) user.calorie_goal = this.getCalorieGoal(user);
            
            let dbQuery = `select * from user_data where user_id = ${user.user_id}`;
            let dbUser = await db.query(dbQuery);
            dbUser = dbUser.rows[0];
            dbQuery = `update user_data set`;

            if(user.name && dbUser.name !== user.name) dbQuery += ` name = '${user.name}'`; 
            if(user.newMail && dbUser.mail !== user.newMail) {
                if(dbQuery !== `update user_data set`) dbQuery += ',';
                dbQuery += ` mail = '${user.newMail}'`;
            }
            if(user.password && dbUser.password !== user.password) {
                if(dbQuery !== `update user_data set`) dbQuery += ',';
                dbQuery += ` password = '${user.password}'`; 
            }
            if(user.height && dbUser.height !== user.height) {
                if(dbQuery !== `update user_data set`) dbQuery += ',';
                dbQuery += ` height = ${user.height}`;
                updateBMI = true;
            }
            if(user.weight && dbUser.weight !== user.weight) {
                if(dbQuery !== `update user_data set`) dbQuery += ',';
                dbQuery += ` weight = ${user.weight}`;
                updateBMI = true;
            }
            if(user.calorie_goal && dbUser.calorie_goal !== user.calorie_goal) {
                if(dbQuery !== `update user_data set`) dbQuery += ',';
                dbQuery += ` calorie_goal = ${user.calorie_goal}`;
            } 
            if(user.calories_consumed && dbUser.calories_consumed !== user.calories_consumed) {
                if(dbQuery !== `update user_data set`) dbQuery += ',';
                dbQuery += ` calories_consumed = ${user.calories_consumed}`;
            } 
            if(user.gender && dbUser.gender !== user.gender) {
                if(dbQuery !== `update user_data set`) dbQuery += ',';
                dbQuery += ` gender = '${user.gender}'`;
            } 
            if(user.goal && dbUser.goal !== user.goal) {
                if(dbQuery !== `update user_data set`) dbQuery += ',';
                dbQuery += ` goal = '${user.goal}'`;
            }
            if(updateBMI){
                const bmi = (user.weight / (user.height * user.height))
                bmiCategory = this.getCategory(bmi);
                if(bmi && dbUser.bmi !== bmi) {
                    if(dbQuery !== `update user_data set`) dbQuery += ',';
                    dbQuery += ` bmi = ${bmi}`;
                }
                if(bmi && bmiCategory && dbUser.bmiCategory !== bmiCategory) {
                    if(dbQuery !== `update user_data set`) dbQuery += ',';
                    dbQuery += ` bmiCategory = '${bmiCategory}'`;
                }
            }
            
            dbQuery += ` where user_id = '${user.user_id}'`; 
            user = await db.query(dbQuery);
            return user;
        }catch(error) {
            console.error("Erro ao atualizar usuário " + error);
        }
    }
    
    static setCalories = async (user_id, operation, calories) => {
        try{
            let dbQuery = `
                update user_data set 
                    calories_consumed = calories_consumed ${operation} ${calories} 
                where user_id = ${user_id} returning calories_consumed
            `;
            console.log("calories ", calories);
            const user = await db.query(dbQuery);
            console.log("user ", user.rows)
            return user.rows;
        }catch(error) {
            console.error("Erro ao atualizar usuário " + error);
        }
    }

    static getCalorieGoal(user){
        let calorieGoal; 
        if(user.gender === "man"){
            calorieGoal = (13.75 * user.weight) + (500 * user.height) - (6.76 * user.age) + 66,5;
        }else{
            calorieGoal = (9.56 * user.weight) + (185 * user.height) - (4.68 * user.age) + 665;
        }

        return calorieGoal;
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