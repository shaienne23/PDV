const Joi = require('joi');

const schemaEditarProduto = Joi.object({
    arquivo: Joi.string().allow('').optional(),
   
    descricao: Joi.string().required().messages({
        'any.required': 'O campo descrição é obrigatório',
        'string.empty': 'O campo descrição não pode ser vazio',
    }),

    quantidade_estoque: Joi.number().integer().min(1).required().messages({
        'any.required': 'O campo quantidade_estoque é obrigatório',
        'number.base': 'O campo quantidade_estoque deve ser um número',
        'number.integer': 'O campo quantidade_estoque deve ser um número inteiro',
        'number.min': 'O campo quantidade_estoque deve ser um número maior ou igual a 1',
    }),

    valor: Joi.number().min(1).required().messages({
        'any.required': 'O campo valor é obrigatório.',
        'number.base': 'O campo valor deve ser um número.',
        'number.empty': 'O campo valor não pode estar vazio.',
        'number.min': 'O campo valor deve ser um número maior ou igual a 1',
    }),

    categoria_id: Joi.number().integer().min(1).required().messages({
        'any.required': 'O campo categoria_id é obrigatório',
        'number.base': 'O campo categoria_id deve ser um número',
        'number.integer': 'O campo categoria_id deve ser um número inteiro',
        'number.min': 'O campo categoria_id deve ser um número maior ou igual a 1',
    }),
});

const schemaCadastrarProduto = Joi.object({
    arquivo: Joi.string().allow('').optional(),
    
    descricao: Joi.string().required().messages({
        'any.required': 'O campo descrição é obrigatório',
        'string.empty': 'O campo descrição não pode ser vazio',
    }),

    quantidade_estoque: Joi.number().integer().min(1).required().messages({
        'any.required': 'O campo quantidade_estoque é obrigatório',
        'number.base': 'O campo quantidade_estoque deve ser um número',
        'number.integer': 'O campo quantidade_estoque deve ser um número inteiro',
        'number.min': 'O campo quantidade_estoque deve ser um número maior ou igual a 1',
    }),

    valor: Joi.number().min(1).required().messages({
        'any.required': 'O campo valor é obrigatório.',
        'number.base': 'O campo valor deve ser um número.',
        'number.empty': 'O campo valor não pode estar vazio.',
        'number.min': 'O campo valor deve ser um número maior ou igual a 1',
    }),

    categoria_id: Joi.number().integer().min(1).required().messages({
        'any.required': 'O campo categoria_id é obrigatório',
        'number.base': 'O campo categoria_id deve ser um número',
        'number.integer': 'O campo categoria_id deve ser um número inteiro',
        'number.min': 'O campo categoria_id deve ser um número maior ou igual a 1',
    }),
});

module.exports = {
    schemaEditarProduto,
    schemaCadastrarProduto
};

