const joi = require('joi');

const schemaCadastrarCliente = joi.object({
    nome: joi.string().required().messages({
        'any.required': 'O campo nome é obrigatório',
        'string.empty': 'O campo nome não pode ser vazio',
    }),

    email: joi.string().email().required().messages({
        'string.email': 'O campo email precisa ter um formato válido',
        'any.required': 'O campo email é obrigatório',
        'string.empty': 'O campo email não pode ser vazio',
    }),

    cpf: joi.string().length(11).required().pattern(/^\d+$/).messages({
        'any.required': 'O campo CPF é obrigatório',
        'string.empty': 'O campo CPF não pode ser vazio',
        'string.length': 'O CPF deve ter exatamente 11 dígitos',
        'string.pattern.base': 'O CPF deve conter apenas números',
    }),

    cep: joi.string().allow('').optional(),

    rua: joi.string().allow('').optional(),

    numero: joi.string().allow('').optional(),

    bairro: joi.string().allow('').optional(),

    cidade: joi.string().allow('').optional(),

    estado: joi.string().allow('').optional(),
});

const schemaEditarDadosCliente = joi.object({
    nome: joi.string().required().messages({
        'any.required': 'O campo nome é obrigatório',
        'string.empty': 'O campo nome não pode ser vazio',
    }),

    email: joi.string().email().required().messages({
        'string.email': 'O campo email precisa ter um formato válido',
        'any.required': 'O campo email é obrigatório',
        'string.empty': 'O campo email não pode ser vazio',
    }),

    cpf: joi.string().length(11).required().pattern(/^\d+$/).messages({
        'any.required': 'O campo CPF é obrigatório',
        'string.empty': 'O campo CPF não pode ser vazio',
        'string.length': 'O CPF deve ter exatamente 11 dígitos',
        'string.pattern.base': 'O CPF deve conter apenas números',
    }),
    cep: joi.string().allow('').optional(),

    rua: joi.string().allow('').optional(),

    numero: joi.string().allow('').optional(),

    bairro: joi.string().allow('').optional(),

    cidade: joi.string().allow('').optional(),

    estado: joi.string().allow('').optional(),
});

module.exports = {
    schemaCadastrarCliente,
    schemaEditarDadosCliente
};