import User from "../models/User.js";

class UserController {
    static login = async (req, res) => {
        const { mail, password } = req.body;
        
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
            res.status(500).json({ message: "Email ou Senha Incorretos!" });
        }
    }

    static listUser = async (req, res) => {
        const { id } = req.params;
        
        if (isNaN(id)) {
            return res.status(400).json({ message: "Id deve ser um número." });
        }
        
        try {
            const result = await User.getUserById(id);
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(400).json({ message: "Usuário não cadastrado!" });
            }
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }
    
    static register = async (req, res) => {
        const { user } = req.body;

        if (!user) {
            return res.status(400).json({ message: "O parâmetro 'user' é obrigatório." });
        }
        
        const result = await User.insert(user);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(500).json({ message: "Erro ao cadastrar usuário" + result });
        }
    }

    static update = async (req, res) => {
        const { user } = req.body;

        if (!user) {
            return res.status(400).json({ message: "O parâmetro 'user' é obrigatório." });
        }
        
        const result = await User.update(user);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(500).json({ message: "Erro ao atualizar usuário" + result });
        }
    }

}

export default UserController