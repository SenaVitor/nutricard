import Meal from "../models/Meal.js";

class MealController {
    static listMeal = async (req, res) => {
        const { user_id, start_date, end_date } = req.params;
        
        if (isNaN(user_id)) {
            return res.status(400).json({ message: "user_id deve ser um número." });
        }
        
        try {
            const result = await Meal.getMeal(user_id, start_date, end_date);
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(400).json({ message: "Refeição não cadastrada!" });
            }
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }
    
    static insert = async (req, res) => {
        try {
            const { meal } = req.body;
    
            if (!meal) {
                return res.status(400).json({ message: "O parâmetro 'meal' é obrigatório." });
            }
            
            const result = await Meal.create(meal);
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(500).json({ message: "Erro ao cadastrar refeição " + result });
            }
        } catch (error) {
            return `Erro ao cadastrar refeição: ${error.message}`;
        }
    };

    static update = async (req, res) => {
        try {
            const { meal } = req.body;
    
            if (!meal) {
                return res.status(400).json({ message: "O parâmetro 'meal' é obrigatório." });
            }
            
            const result = await Meal.update(meal);
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(500).json({ message: "Erro ao cadastrar refeição " + result });
            }
        } catch (error) {
            return `Erro ao cadastrar refeição: ${error.message}`;
        }
    };
    
    static deleteMeal = async (req, res) => {
        const { meal_id } = req.params;
        
        if (isNaN(meal_id)) {
            return res.status(400).json({ message: "meal_id deve ser um número." });
        }
        
        try {
            const result = await Meal.deleteMeal(meal_id);
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(400).json({ message: "Não foi possível deletar a refeição!" });
            }
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }
    
    static deleteFood = async (req, res) => {
        const { meal_id, food_id } = req.params;
        
        if (isNaN(meal_id) || isNaN(food_id)) {
            return res.status(400).json({ message: "meal_id e food_id devem ser números." });
        }
        
        try {
            const result = await Meal.deleteFood(meal_id, food_id);
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(400).json({ message: "Não foi possível deletar a refeição!" });
            }
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }
}

export default MealController;