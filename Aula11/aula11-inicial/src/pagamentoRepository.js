/**
 * Repositório de Pagamentos Simulado em Memória
 */

let transacoes = [];
let contadorId = 1;

class PagamentoRepository {
  /**
   * Salva ou atualiza uma transação no banco em memória.
   * @param {object} dados
   * @returns {Promise<object>} Transação persistida
   */
  async salvar(dados) {
    if (!dados) {
      throw new Error('Dados da transação são obrigatórios para salvar.');
    }

    const novaTransacao = {
      id: dados.id || contadorId++,
      clienteId: dados.clienteId,
      valor: dados.valor,
      metodoPagamento: dados.metodoPagamento,
      chaveIdempotencia: dados.chaveIdempotencia || null,
      status: dados.status || 'CRIADO',
      criadoEm: dados.criadoEm || new Date().toISOString()
    };

    transacoes.push(novaTransacao);
    return { ...novaTransacao };
  }

  /**
   * Busca uma transação pelo seu identificador único.
   * @param {number} id
   * @returns {Promise<object|null>}
   */
  async buscarPorId(id) {
    if (!id || typeof id !== 'number') {
      return null;
    }
    const encontrada = transacoes.find(t => t.id === id);
    return encontrada ? { ...encontrada } : null;
  }

  /**
   * Busca uma transação prévia pela chave de idempotência.
   * @param {string} chave
   * @returns {Promise<object|null>}
   */
  async buscarPorChaveIdempotencia(chave) {
    if (!chave || typeof chave !== 'string') {
      return null;
    }
    const encontrada = transacoes.find(t => t.chaveIdempotencia === chave);
    return encontrada ? { ...encontrada } : null;
  }

  /**
   * Retorna todas as transações registradas.
   * @returns {Promise<Array>}
   */
  async listar() {
    return [...transacoes];
  }

  /**
   * Limpa os dados em memória (útil para suítes de testes isoladas).
   */
  async limpar() {
    transacoes = [];
    contadorId = 1;
  }
}

module.exports = PagamentoRepository;
