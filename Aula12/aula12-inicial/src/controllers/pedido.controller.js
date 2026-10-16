const pedidoService = require('../services/pedido.service');

class PedidoController {
  constructor(service = pedidoService) {
    this.service = service;
    this.cadastrar = this.cadastrar.bind(this);
    this.buscarPorId = this.buscarPorId.bind(this);
    this.listar = this.listar.bind(this);
  }

  /**
   * Endpoint POST /pedidos
   * Cadastra um novo pedido no sistema.
   */
  async cadastrar(req, res, next) {
    try {
      const { produto, quantidade, valor, precoUnitario } = req.body;
      const valorFinal = valor !== undefined ? valor : precoUnitario;
      const novoPedido = await this.service.cadastrarPedido({
        produto,
        quantidade,
        valor: valorFinal
      });
      return res.status(201).json(novoPedido);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Endpoint GET /pedidos
   * Lista todos os pedidos cadastrados.
   */
  async listar(req, res, next) {
    try {
      const pedidos = await this.service.listarPedidos();
      return res.status(200).json(pedidos);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Endpoint GET /pedidos/:id
   * Consulta um pedido existente pelo ID.
   */
  async buscarPorId(req, res, next) {
    try {
      const { id } = req.params;
      const pedido = await this.service.buscarPedidoPorId(id);
      return res.status(200).json(pedido);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PedidoController();
module.exports.PedidoController = PedidoController;
