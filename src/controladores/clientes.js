const knex = require('../conexao');
const { config } = require("dotenv");
config();

const cadastrarCliente = async (req, res) => {
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;

    try {
        const emailExiste = await knex('clientes').where({ email }).first();

        const cpfExiste = await knex('clientes').where({ cpf }).first();

        if (cpfExiste) {
            return res.status(409).json({ error: 'CPF já cadastrado.' });
        }

        if (emailExiste) {
            return res.status(409).json({ mensagem: 'O email já existe!' });
        }

        const cadastroDoCliente = await knex('clientes')
            .insert({
                nome,
                email,
                cpf,
                cep,
                rua,
                numero,
                bairro,
                cidade,
                estado
            })
            .returning('*');

        return res.status(201).send()
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }

}

const detalharCliente = async (req, res) => {
    const id = req.params.id;

    try {

        const clienteEncontrado = await knex('clientes')
        .select('*')
        .where('id', id)
        .first();

        if (!clienteEncontrado) {
            return res.status(404).json({ mensagem: "Cliente não encontrado." });
        }

        return res.status(200).json(clienteEncontrado)
    } catch (error) {
        console.log({ mensagem: error });
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const editarDadosCliente = async (req, res) => {
    const { id } = req.params;
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;

    try {
        const clienteExistente = await knex('clientes')
            .where({ id })
            .first();

        if (!clienteExistente) {
            return res.status(404).json({ mensagem: 'Cliente não encontrado' });
        }
        
        if (cpf && cpf !== clienteExistente.cpf) {
            const cpfExiste = await knex('clientes')
                .where({ cpf })
                .whereNot('id', id)
                .first();

            if (cpfExiste) {
                return res.status(409).json({ mensagem: 'CPF já cadastrado ' });
            }
        }

        if (email !== clienteExistente.email) {
            const emailExiste = await knex('clientes')
                .where({ email })
                .whereNot('id', id)
                .first();
        
            if (emailExiste ) {
                return res.status(409).json({ mensagem: 'O e-mail informado já está sendo utilizado por outro usuário.' });
            }
        }
        
        await knex('clientes')
            .where({ id })
            .update({
                nome,
                email,
                cpf,
                cep, 
                rua, 
                numero, 
                bairro, 
                cidade, 
                estado
            });

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro no servidor' });
    }
};


const listarClientes = async (req, res) => {
    try {
        const clientes = await knex('clientes').select('*');

        if (clientes.length === 0) {
            return res.status(404).json({ mensagem: "Nenhum cliente encontrado." });
        }

        return res.json(clientes);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor", erro: error.message });
    }
};

module.exports = {
    detalharCliente,
    listarClientes,
    cadastrarCliente,
    editarDadosCliente
};