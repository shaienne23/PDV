const fs = require('fs/promises')
const transportador = require('../servicos/email')
const compilador = require('../servicos/compilamento')
const knex = require('../conexao');
const { config } = require("dotenv");
config();


const cadastrarPedido = async (req, res) => {
    const { cliente_id, observacao, pedido_produtos } = req.body;

    try {

        const idCliente = await knex('clientes')
            .where('id', cliente_id)
            .first();

        if (!idCliente) {
            return res.status(404).json({ erro: 'ID do cliente não encontrada no sistema.' })
        }

        for (const item of pedido_produtos) {
            const produtosACadastrar = await knex('produtos').where('id', item.produto_id).first();

            if (!produtosACadastrar) {
                return res.status(404).json({ erro: 'Número de ID não relacionado aos produtos existentes.' });
            }
            const quantidadeEstoque = await knex('produtos')
                .select('quantidade_estoque')
                .where('id', item.produto_id)
                .first()

            if (quantidadeEstoque.quantidade_estoque < item.quantidade_produto) {
                return res.status(400).json({ erro: 'Estoque insuficiente para a quantidade de produtos.' });
            };

        for (const item of pedido_produtos) {
            const descontarDoEstoque = await knex('produtos')
            .where('id', item.produto_id)
            .update({
                quantidade_estoque: quantidadeEstoque.quantidade_estoque - item.quantidade_produto,
        })}
    }

        let total = await knex('produtos')
            .whereIn('id', pedido_produtos.map(item => item.produto_id))
            .sum('valor as total')
            .first();


        let [pedidoInserido] = await knex('pedidos')
            .returning('*')
            .insert({
                cliente_id,
                observacao,
                valor_total: total.total,
            });
        
        const listaDeProdutos = []

        for (const item of pedido_produtos) {
            let quantidadeProduto = item.quantidade_produto
            let idDoProduto = item.produto_id
            let valorProduto = await knex('produtos')
                .select('valor')
                .where('id', item.produto_id)
                .first()

            quantidadeProduto = Number(quantidadeProduto);
            valorProduto = Number(valorProduto.valor);


            const cadastrarPedidoProdutos = {
                pedido_id: pedidoInserido.id,
                produto_id: idDoProduto,
                quantidade_produto: quantidadeProduto,
                valor_produto: valorProduto
            };
            listaDeProdutos.push(cadastrarPedidoProdutos);
            await knex('pedido_produtos').insert(cadastrarPedidoProdutos);
        }

        const visualizacaoProdutos = listaDeProdutos.map(({ produto_id, quantidade_produto }) => ({
            produto_id,
            quantidade_produto
        }));

        const resposta = {
            cliente_id: pedidoInserido.cliente_id,
            observacao: pedidoInserido.observacao,
            pedido_produtos: visualizacaoProdutos
        }
        
        if (visualizacaoProdutos.length > 0) {
            const nomeNoBanco = await knex('clientes')
                .select('nome')
                .where('id', cliente_id);
            const emailEmail = await knex('clientes')
                .select('email')
                .where('id', cliente_id);
            
            const email = emailEmail[0]['email']
            const nomeEmail = nomeNoBanco[0]['nome']
            
            const html = await compilador('src/templates/template.html', {
                nomecliente: nomeEmail
            });
        
            try {
                
                await transportador.sendMail({
                    from: process.env.EMAIL_FROM,
                    to: email,
                    subject: 'Novo Pedido',
                    html
                });
        
                console.log('E-mail enviado com sucesso!');
            } catch (erro) {
                console.error('Erro ao enviar e-mail:', erro);
            }
        }
        
        res.status(201).json(resposta)

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ mensagem: "Erro interno do servidor!" });
    }
}

const listarPedidos = async (req, res) => {
    const { cliente_id } = req.query;

    try {
        const pedidosQuery = knex('pedidos').select('*');

        
        if (cliente_id) {
            pedidosQuery.where('cliente_id', cliente_id);
        }

        const pedidos = await pedidosQuery;

        if (pedidos.length === 0) {
            return res.status(404).json({ mensagem: 'Nenhum pedido cadastrado para o cliente designado.' });
        }

        const todosProdutos = await knex('pedido_produtos').select('*');

        let resultado;

        
        resultado = pedidos.map((pedido) => {
            const produtosDoPedido = todosProdutos
                .filter((produto) => produto.pedido_id === pedido.id);
        
            return {
                pedido: {
                    id: pedido.id,
                    valor_total: pedido.valor_total,
                    observacao: pedido.observacao,
                    cliente_id: pedido.cliente_id,
                },
                pedido_produtos: produtosDoPedido,
            };
        });

        res.status(200).json(resultado);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
};


module.exports = { cadastrarPedido, listarPedidos }