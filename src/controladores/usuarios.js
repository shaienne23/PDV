const { config } = require("dotenv");
config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const knex = require("../conexao");


const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const emailExiste = await knex('usuarios').where({ email }).first();

        if (emailExiste) {
            return res.status(409).json({ mensagem: 'O email já existe!' });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const usuario = await knex('usuarios')
            .insert({
                nome,
                email,
                senha: senhaCriptografada
            })
            .returning('*')
           

        if (!usuario[0]) {
            return res.status(500).json({ mensagem: 'Não foi possível cadastrar o usuário' });
        }

        return res.status(201).send();
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor', error: error.message });
    }

}

const login = async (req, res) => {
     const { email, senha } = req.body;
    
    try {
       
        const usuario = await knex('usuarios').where({ email }).first();

        if (!usuario) {
            return res.status(404).json('O usuário não foi encontrado');
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(400).json({ mensagem: 'E-mail ou senha inválida' });
        }

        const token = jwt.sign({ id: usuario.id }, process.env.SENHA_JWT, { expiresIn: '8h' });

        const { senha: _, ...dadosUsuario } = usuario;

        return res.status(200).json({
            usuario: dadosUsuario,
            token
        });

        
    } catch (error) {
		return res.status(500).json({ mensagem: error.message })
	}
};

const detalharUsuario = async (req, res) => {
    const { id, nome, email } = req.usuario;

    try {
      const usuario = await knex('usuarios')
        .select('id', 'nome', 'email')
        .where('id', id)
        .first();

      if (!usuario) {
        return res.status(404).json({ mensagem: 'Usuário não existe' });
      }

      return res.json({ id, nome, email });

    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
  };

  const editarUsuario = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        const { id } = req.usuario;

        const emailExiste = await knex('usuarios')
            .where('email', email)
            .whereNot('id', id)
            .count('id as count')
            .first();

        if (emailExiste.count > 0) {
            return res.status(400).json({ mensagem: 'O e-mail informado já está sendo utilizado por outro usuário.' });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        await knex('usuarios')
            .where('id', id)
            .update({ nome, email, senha: senhaCriptografada });

        return res.status(204).send();

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
      }
};



module.exports = { cadastrarUsuario, login, detalharUsuario, editarUsuario}

