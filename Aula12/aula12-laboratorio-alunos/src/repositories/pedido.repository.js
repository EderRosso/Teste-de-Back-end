/**
 * Repositório em memória para persistência de pedidos.
 * Permite isolamento total nos testes através do método limpar().
 */
class PedidoRepository {
  constructor() {
    this.pedidos = [];
    this.proximoId = 1;
  }

  /**
   * Salva um novo pedido na memória.
   * @param {Object} pedido - Dados do pedido { produto, quantidade, valor, total }
   * @returns {Object} Pedido persistido com ID gerado
   */
  criar(pedido) {
    const novoPedido = {
      id: this.proximoId++,
      produto: pedido.produto,
      quantidade: pedido.quantidade,
      valor: pedido.valor,
      total: pedido.total || pedido.quantidade * pedido.valor,
      criadoEm: new Date().toISOString()
    };
    this.pedidos.push(novoPedido);
    return { ...novoPedido };
  }

  /**
   * Busca um pedido pelo seu identificador único.
   * @param {number|string} id - ID do pedido
   * @returns {Object|null} Pedido encontrado ou null
   */
  buscarPorId(id) {
    const pedido = this.pedidos.find(p => String(p.id) === String(id));
    return pedido ? { ...pedido } : null;
  }

  /**
   * Retorna todos os pedidos cadastrados.
   * @returns {Array<Object>} Lista de pedidos
   */
  listar() {
    return this.pedidos.map(p => ({ ...p }));
  }

  /**
   * Limpa o estado interno do repositório.
   * Deve ser executado no beforeEach de cada suíte de testes para garantir isolamento.
   */
  limpar() {
    this.pedidos = [];
    this.proximoId = 1;
  }
}

// Exporta uma instância única (Singleton) para ser compartilhada na aplicação
const pedidoRepository = new PedidoRepository();

module.exports = pedidoRepository;
module.exports.PedidoRepository = PedidoRepository;
