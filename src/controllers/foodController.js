import axios from "axios";
import env from "../config/env.js";
import Food from "../models/Food.js";

class FoodController {
    static callApi = async (url, params) => {
        try {
            const response = await axios.get(url, {
                params: params
            });
            const log = {
                "status": response['status'],
                "statusText": response['statusText'],
                "quota-request": response['headers']['x-api-quota-request'],
                "quota-used": response['headers']['x-api-quota-used'],
                "quota-left": response['headers']['x-api-quota-left'] 
            }
            console.log(JSON.stringify(log));
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar os alimentos:', error.response ? error.response.data : error.message);
            return null;
        }
    }

    static listFood = async (req, res) => {
        let result;
        const { query, sort, sortDirection, number = 1 } = req.query;  // `number` será 1 por padrão se não for fornecido
        
        const params = {
            query: query,
            sort: sort, 
            sortDirection: sortDirection,
            number: number,
            apiKey: env.apiKey
        }

        result = await Food.getFood(params);
        console.log("Result ", JSON.stringify(result));
        if(result && result.length < number){
            const url = `https://api.spoonacular.com/food/ingredients/search`;
            const foods = await this.callApi(url, params);
            const dbFoods = await this.insert(result, foods);
            result = result.concat(dbFoods);    
        }

        if (result) {
            res.status(200).json(result);
        } else {
            res.status(500).json({ message: "Erro ao buscar alimentos" });
        }
    }

    static listFoodById = async (req, res) => {
        const { id } = req.params;
        const { amount = 1 } = req.query;
        
        if (isNaN(id)) {
            return res.status(400).json({ message: "Id deve ser um número." });
        }

        try {
            const detailedFoods = await this.fetchDetailedFoods([id], amount);

            if (detailedFoods && detailedFoods.length > 0) {
                res.status(200).json(detailedFoods[0]);
            } else {
                res.status(404).json({ message: "Alimento não encontrado" });
            }
        } catch (error) {
            res.status(500).json({ message: "Erro ao buscar alimento", error: error.message });
        }
    }

    static fetchDetailedFoods = async (foodIds, amount) => {
        try {
            const detailedFoods = await Promise.all(
                foodIds.map(async (id) => {
                    const params = { amount: amount, apiKey: env.apiKey };
                    const url = `https://api.spoonacular.com/food/ingredients/${id}/information`;
                    return await this.callApi(url, params);
                })
            );
            return detailedFoods;
        } catch (error) {
            console.error("Erro ao buscar alimentos detalhados:", error);
            throw new Error("Falha ao buscar alimentos detalhados");
        }
    };

    static insert = async (dataBaseFoods, foods) => {
        try {
            const foodIds = foods.results
                .filter(food => !dataBaseFoods.some(dbFood => dbFood.food_id === food.id))
                .map(food => food.id);
            console.log(foodIds);
            const detailedFoods = await this.fetchDetailedFoods(foodIds, 1);
            await Promise.all(
                detailedFoods.map(async (food) => await Food.insert(food))
            );
            console.log("Alimentos cadastrados com sucesso!");
            return await Food.getFoodsByIds(foodIds);
        } catch (error) {
            return `Erro ao cadastrar alimentos: ${error.message}`;
        }
    };
    

}

export default FoodController