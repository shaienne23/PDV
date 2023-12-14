require('dotenv').config();
const express = require('express');
const multer = require('./intermediarios/multer')

const { login, detalharUsuario, cadastrarUsuario, editarUsuario } = require('./controladores/usuarios');
const { listarCategorias } = require('./controladores/categorias');
const { listarProdutos, editarDadosProduto, excluirProduto, cadastrarProduto, detalharProduto } = require('./controladores/produtos');
const { detalharCliente, listarClientes, cadastrarCliente, editarDadosCliente } = require('./controladores/clientes');

const validacaoToken = require('./intermediarios/validacaoToken');
const validarCorpoRequisicao = require('./intermediarios/validarCorpoRequisicao');

const { schemaLoginUsuario, schemaCadastrarUsuario, schemaEditarUsuario } = require('./validacoes/schemaUsuario');
const { schemaCadastrarCliente, schemaEditarDadosCliente } = require('./validacoes/schemaCliente');
const { schemaEditarProduto, schemaCadastrarProduto } = require('./validacoes/schemaProduto');
const { schemaCadastrarPedido } = require('./validacoes/schemaPedidos')

const { cadastrarPedido, listarPedidos } = require('./controladores/pedidos')

const rotas = express();

rotas.get('/categoria', listarCategorias); 
rotas.post("/usuario", validarCorpoRequisicao(schemaCadastrarUsuario), cadastrarUsuario);
rotas.post("/login", validarCorpoRequisicao(schemaLoginUsuario), login);

rotas.use(validacaoToken);

rotas.get('/usuario', detalharUsuario);
rotas.put('/usuario', validarCorpoRequisicao(schemaEditarUsuario), editarUsuario);

rotas.post('/produto', multer.single('arquivo'), validarCorpoRequisicao(schemaCadastrarProduto), cadastrarProduto);
rotas.put('/produto/:id', multer.single('arquivo'), validarCorpoRequisicao(schemaEditarProduto), editarDadosProduto);
rotas.get('/produto/:id', detalharProduto);
rotas.get('/produto', listarProdutos);
rotas.delete('/produto/:id', excluirProduto);

rotas.post('/cliente', validarCorpoRequisicao(schemaCadastrarCliente), cadastrarCliente);
rotas.put('/cliente/:id', validarCorpoRequisicao(schemaEditarDadosCliente), editarDadosCliente);
rotas.get('/cliente', listarClientes);
rotas.get('/cliente/:id', detalharCliente);

rotas.get('/pedido', listarPedidos)
rotas.post('/pedido', validarCorpoRequisicao(schemaCadastrarPedido), cadastrarPedido)


module.exports = rotas