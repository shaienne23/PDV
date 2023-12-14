const Joi = require('joi');

const schemaCadastrarPedido = Joi.object({
    cliente_id: Joi.number().integer().min(1).required().messages({
        'any.required': 'O campo cliente_id é obrigatório',
        'number.base': 'O campo cliente_id deve ser um número',
        'number.integer': 'O campo cliente_id deve ser um número inteiro',
        'number.min': 'O campo cliente_id deve ser um número maior ou igual a 1'
    }),

    observacao: Joi.string().required().messages({
        'any.required': 'O campo observacao é obrigatório',
        'string.empty': 'O campo observacao não pode ser vazio',
    }),

    pedido_produtos: Joi.array().items(
        Joi.object({
            produto_id: Joi.number().integer().min(1).required().messages({
                'any.required': 'O campo produto_id é obrigatório',
                'number.base': 'O campo produto_id deve ser um número',
                'number.integer': 'O campo produto_id deve ser um número inteiro',
                'number.min': 'O campo produto_id deve ser um número maior ou igual a 1'
            }),

            quantidade_produto: Joi.number().integer().min(1).required().messages({
                'any.required': 'O campo quantidade_produto é obrigatório',
                'number.base': 'O campo quantidade_produto deve ser um número',
                'number.integer': 'O campo quantidade_produto deve ser um número inteiro',
                'number.min': 'O campo quantidade_produto deve ser um número maior ou igual a 1',
            })

    
    }))
});

module.exports = { schemaCadastrarPedido }