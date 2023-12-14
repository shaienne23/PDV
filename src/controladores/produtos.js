const knex = require('../conexao');
const { config } = require("dotenv");
const { uploadArquivo, excluirArquivo } = require('../servicos/armazenamento');
config();


const listarProdutos = async (req, res) => {
    const { categoria_id } = req.query;

    try {

        if (!categoria_id) {
            const todosOsProdutos = await knex('produtos')
            .select('id', 'descricao', 'quantidade_estoque', 'valor', 'categoria_id')
            .orderBy('categoria_id', 'asc');

        res.status(200).json(todosOsProdutos);
           
        } else {
            const categoriaExistente = await knex('categorias')
            .where('id', categoria_id)
            .first();
    
            if (!categoriaExistente) {
                return res.status(400).json({ mensagem: 'Categoria não encontrada para o ID fornecido.' });
            } 

            const produtosPorCategoria = await knex('produtos')
            .select('id', 'descricao', 'quantidade_estoque', 'valor', 'categoria_id')
            .where('categoria_id', categoria_id)
            .orderBy('id', 'asc');

        res.status(200).json(produtosPorCategoria);
        }
    } catch (error) {
        return res.status(500).json('Erro interno do servidor');
    }

}

const editarDadosProduto = async (req, res) => {
    const { id } = req.params;
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;   

    try {
        const produto = await knex('produtos')
            .select('id', 'descricao', 'quantidade_estoque', 'valor', 'categoria_id', 'produto_imagem')
            .where('id', id)
            .first();

        if (!produto) {
            return res.status(400).json({ mensagem: 'Produto não encontrado para o ID fornecido.' });
        }

        const categoriaExistente = await knex('categorias')
            .where('id', categoria_id)
            .first();

        if (!categoriaExistente) {
            return res.status(400).json({ mensagem: 'Categoria não encontrada para o ID fornecido.' });
        }
        
        let produto_imagem = produto.produto_imagem;

        if (req.file) {
            try {
                if (produto_imagem) {
                    await excluirArquivo(produto_imagem);
                }

                const resultadoUpload = await uploadArquivo(
                    `${req.file.originalname}`,
                    req.file.buffer,
                    req.file.mimetype
                );

                produto_imagem = resultadoUpload;

            } catch (uploadError) {
                return res.status(500).json({ mensagem: 'Erro interno no servidor durante o upload da imagem.' });
            }
        }
        const atualizarProduto = await knex('produtos')
            .where('id', id)
            .update({ descricao, 
                quantidade_estoque, 
                valor, 
                categoria_id, 
                produto_imagem, 
            })
                .returning(['descricao', 'quantidade_estoque', 'valor', 'categoria_id', 'produto_imagem']);

        return res.status(201).json(atualizarProduto[0]);
        
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
};

const excluirProduto = async (req, res) => {
    const id = req.params.id;

    try {
        const produto = await knex('produtos')
            .select('*')
            .where('id', id)
            .first();

        if (!produto) {
            return res.status(404).json({ mensagem: "Produto não encontrado." });
        }

        const produtoVinculadoPedido = await knex('pedido_produtos')
        .select('pedido_id')
        .where('produto_id', id)
        .first();

    if (produtoVinculadoPedido) {
        return res.status(400).json({ mensagem: "Não é possível excluir o produto, pois está vinculado a um pedido." });
    }
        
        await excluirArquivo(produto.produto_imagem);

        const produtoExcluido = await knex('produtos')
        .where('id', id)
        .del();

        return res.status(204).send()
    } catch (error) {
        console.error('Erro interno:', error.message);
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}


const cadastrarProduto = async (req, res) => {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;

    try {
        const categoriaExiste = await knex('categorias')
        .where('id', categoria_id)
        .first();

        if (!categoriaExiste) {
            return res.status(400).json({ erro: 'A categoria informada não existe.' });
        }

        let produto_imagem;

        if (req.file) {
            try {
                const resultadoUpload = await uploadArquivo(
                    `${req.file.originalname}`,
                    req.file.buffer,
                    req.file.mimetype
                );

                produto_imagem = resultadoUpload;

            } catch (uploadError) {
                return res.status(500).json({ mensagem: 'Erro interno no servidor durante o upload da imagem.' });
            }
        }
        const novoProduto = {
            descricao,
            quantidade_estoque,
            valor,
            categoria_id,
            produto_imagem
        };
     

        try {
            await knex('produtos').insert(novoProduto);
           
        } catch (dbError) {
            return res.status(500).json({ mensagem: 'Erro interno no servidor ao inserir o produto no banco de dados.' });
        }
       
        return res.status(201).json(novoProduto);

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
    }
};

const detalharProduto = async (req, res) => {
    const { id } = req.params;

    try {
        const produto = await knex('produtos').where('id', id).first();

        if (!produto) {
            return res.status(404).json({ erro: 'Produto não encontrado.' });
        }

        res.status(200).json({ produto });

        const produtoExcluido = await knex('produtos')
        .where('id', id)
        .del();

        return res.status(204).send()
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

module.exports = { listarProdutos, 
                    editarDadosProduto,
                    excluirProduto, 
                    cadastrarProduto, 
                    detalharProduto };