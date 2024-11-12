import User from "../models/User.js";
import env from "../config/env.js";

class UserController {
    static login = async (req, res) => {
        const { mail, password } = req.query;
        
        if (!mail) {
            return res.status(400).json({ message: "Insira um email!" });
        }
        
        if (!password) {
            return res.status(400).json({ message: "Insira uma senha!" });
        }
        
        const result = await User.login(mail, password);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(500).json({ message: "Erro ao logar!" });
        }
    }

    static register = async (req, res) => {
        const { user } = req.query;

        if (!user) {
            return res.status(400).json({ message: "O parâmetro 'user' é obrigatório." });
        }
        
        const result = await User.insert(user);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(500).json({ message: "Erro ao cadastrar usuário" });
        }
    }

}

export default UserController