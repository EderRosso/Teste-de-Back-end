const pedidoRepository = require('../repositories/pedido.repository');

/**
 * Classes de erro customizadas com códigos de status HTTP correspondentes.
 */
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
  }
}

class PedidoService {
  constructor(repository = pedidoRepository) {
    this.repository = repository;
  }

  /**
   * Valida e cadastra um novo pedido.
   * 
   * Regras de negócio:
   * 1. O produto deve ter nome válido (não vazio e tipo string).
   * 2. A quantidade deve ser um número inteiro maior que zero.
   * 3. O valor deve ser um número maior que zero.
   * 
   * @param {Object} dados - { produto, quantidade, valor }
   * @returns {Promise<Object>} Pedido cadastrado
   */
  async cadastrarPedido({ produto, quantidade, valor }) {
    // 1. Validação do produto
    if (!produto || typeof produto !== 'string' || produto.trim().length === 0) {
      throw new ValidationError('O produto deve ter um nome válido.');
    }

    // =========================================================================
    // ✅ CORREÇÃO DO BUG-001 (Solução do Professor)
    // -------------------------------------------------------------------------
    // Regra de negócio: "A quantidade deve ser um número inteiro maior que zero."
    // Correção: A condição anterior (!Number.isInteger(quantidade) || quantidade === 0)
    // foi substituída por (!Number.isInteger(quantidade) || quantidade <= 0).
    // Agora números negativos (< 0) e zero são devidamente rejeitados com status 400!
    // =========================================================================
    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      throw new ValidationError('A quantidade deve ser um número inteiro maior que zero.');
    }

    // 3. Validação do valor
    if (typeof valor !== 'number' || isNaN(valor) || valor <= 0) {
      throw new ValidationError('O valor deve ser um número maior que zero.');
    }

    const total = Number((quantidade * valor).toFixed(2));

    const pedidoCriado = this.repository.criar({
      produto: produto.trim(),
      quantidade,
      valor,
      total
    });

    return pedidoCriado;
  }

  /**
   * Consulta um pedido existente por ID.
   * Lança NotFoundError se o pedido não existir.
   * 
   * @param {string|number} id - Identificador do pedido
   * @returns {Promise<Object>} Dados do pedido
   */
  async buscarPedidoPorId(id) {
    const pedido = this.repository.buscarPorId(id);
    if (!pedido) {
      throw new NotFoundError('Pedido não encontrado.');
    }
    return pedido;
  }

  /**
   * Consulta todos os pedidos existentes.
   * 
   * @returns {Promise<Array<Object>>} Lista de pedidos
   */
  async listarPedidos() {
    return this.repository.listar();
  }
}

module.exports = new PedidoService();
module.exports.PedidoService = PedidoService;
module.exports.ValidationError = ValidationError;
module.exports.NotFoundError = NotFoundError;
