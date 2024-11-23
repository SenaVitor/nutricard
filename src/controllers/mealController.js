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
}

export default MealController;