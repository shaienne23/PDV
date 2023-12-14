const jwt = require('jsonwebtoken')
const knex = require("../conexao");

const validacaoToken = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ mensagem: 'Não autorizado. Autenticação obrigatória.' })
    }

    try {
        const token = authorization.replace('Bearer ', '').trim();

        const { id } = jwt.verify(token, process.env.SENHA_JWT);


        const usuarioExiste = await knex('usuarios').where({ id }).first();

        if (!usuarioExiste) {
            return res.status(404).json('Usuário não encontrado');
        }

        const { senha, ...usuario } = usuarioExiste;

        req.usuario = usuario;

        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
}


module.exports = validacaoToken
