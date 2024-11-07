import axios from "axios";
import env from "../config/env.js";

class FoodController {
    static callApi = async (url, query, number) => {
        try {
            const response = await axios.get(url, {
                params: {
                    query: query,
                    number: number,
                    apiKey: env.apiKey
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar os alimentos:', error.response ? error.response.data : error.message);
            return null;
        }
    }

    static listFood = async (req, res) => {
        const url = `https://api.spoonacular.com/food/ingredients/search`;
        const { query, number = 1 } = req.query;  // `number` será 1 por padrão se não for fornecido

        if (!query) {
            return res.status(400).json({ message: "O parâmetro 'query' é obrigatório." });
        }
        
        const result = await this.callApi(url, query, number);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(500).json({ message: "Erro ao buscar ingredientes" });
        }
    }

    static listFoodByName = async (req, res) => {
        const url = `https://api.spoonacular.com/food/ingredients/autocomplete`;
        const { query, number = 1 } = req.query;

        if (!query) {
            return res.status(400).json({ message: "O parâmetro 'query' é obrigatório." });
        }
        
        const result = await this.callApi(url, query, number);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(500).json({ message: "Erro ao buscar ingredientes" });
        }
    }

}

export default FoodController