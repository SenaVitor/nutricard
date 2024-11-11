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
            const dbQuery = `select * from user_data`
            const users = await db.query(dbQuery);
            return users.rows;
        }catch(e) {
            console.error("Erro ao buscar usuários " + e);
        }
    }

    static getUserById = async (id) => {
        try{
            const dbQuery = `select * from user_data where user_id  = ${id}`
            const user = await db.query(dbQuery);
            return user.rows;
        }catch(e) {
            console.error("Usuário não cadastrado " + e);
        }
    }

    static insert = async (user) => {
        try{
            await db.connect();
            const dbQuery = `
                insert into user_data 
                    (name, mail, password, height, weight, calorie_goal, calories_consumed)
                values 
                    ('${user.name}', '${user.mail}', '${user.password}', ${user.height}, 
                    ${user.weight}, ${user.calorie_goal}, ${user.calories_consumed})
            `;
            await db.query(dbQuery);
            return 'Usuário criado com sucesso!';
        }catch(error) {
            console.error("Erro ao adicionar novo usuário " + error);
        }
    }
}

export default User;