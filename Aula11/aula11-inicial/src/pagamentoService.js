/**
 * Serviço de Processamento de Pagamentos e Resiliência
 * 
 * Versão Inicial (Frágil / Incompleta)
 * 
 * Problemas a resolver nesta versão:
 * 1. Não valida dados de entrada (aceita valor negativo ou nulo).
 * 2. Não possui proteção contra requisições que demoram indefinidamente (Falta Timeout).
 * 3. Se o gateway de pagamento externo oscilar (falha transitória), a requisição simplesmente falha.
 * 4. Não implementa Fallback de contingência.
 * 5. Não verifica idempotência antes de acionar a cobrança.
 */

const { ErroNegocio, FalhaTransitoria, ErroNaoEncontrado } = require('./erros');

class PagamentoService {
  /**
   * @param {object} repositorio - Repositório de persistência
   * @param {object} gateway - Integração externa com operadora de pagamentos
   */
  constructor(repositorio, gateway) {
    this.repositorio = repositorio;
    this.gateway = gateway;
  }

  /**
   * Processa uma transação de pagamento.
   * Versão frágil: repassa dados diretamente sem validações defensivas.
   * 
   * @param {object} dados
   * @returns {Promise<object>}
   */
  async processar(dados) {
    // ❌ FALHA 1: Nenhuma validação de negócio (Desafio 1 do aluno)
    // O aluno deve validar dados, dados.valor > 0, dados.clienteId, método de pagamento.

    // ❌ FALHA 2: Sem verificação de chave de idempotência

    // ❌ FALHA 3: Chamada direta sem timeout ou resiliência (Desafios 2 e 3)
    const respostaGateway = await this.gateway.cobrar({
      clienteId: dados.clienteId,
      valor: dados.valor
    });

    const transacaoSalva = await this.repositorio.salvar({
      clienteId: dados.clienteId,
      valor: dados.valor,
      metodoPagamento: dados.metodoPagamento,
      chaveIdempotencia: dados.chaveIdempotencia,
      status: 'CONCLUIDO',
      transacaoId: respostaGateway.idTransacao
    });

    return {
      sucesso: true,
      transacao: transacaoSalva
    };
  }

  /**
   * Consulta os dados de uma transação pelo ID.
   * @param {number} id
   * @returns {Promise<object>}
   */
  async consultarPorId(id) {
    // ❌ Incompleto: Se não encontrar, deve lançar ErroNaoEncontrado!
    const transacao = await this.repositorio.buscarPorId(id);
    return transacao;
  }
}

module.exports = PagamentoService;
