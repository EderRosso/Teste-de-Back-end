const express = require('express');
const pedidoController = require('./controllers/pedido.controller');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// Middleware para processamento de JSON no corpo das requisições
app.use(express.json());

// Rotas da API de Pedidos
app.post('/pedidos', pedidoController.cadastrar);
app.get('/pedidos/:id', pedidoController.buscarPorId);

// Middleware de tratamento global de exceções (deve ser o último app.use)
app.use(errorMiddleware);

module.exports = app;
