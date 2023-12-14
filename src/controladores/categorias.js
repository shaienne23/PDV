const { config } = require("dotenv");
config();
const knex = require("../conexao");

const listarCategorias = async (req, res) => {

    try {
        const categorias = await knex('categorias').select('id', 'descricao');
        res.status(200).json(categorias);

    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
}

module.exports = { listarCategorias };