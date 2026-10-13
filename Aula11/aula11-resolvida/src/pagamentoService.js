/**
 * Serviço de Processamento de Pagamentos e Resiliência
 * (Versão Resolvida — Padrão de Engenharia Resiliente)
 */

const { ErroNegocio, ErroNaoEncontrado, FalhaTransitoria } = require('./erros');

/**
 * Função utilitária para executar uma Promise com limite de tempo (Timeout).
 * @param {Promise} promessa - Operação assíncrona a vigiar
 * @param {number} tempoLimiteMs - Limite em milissegundos
 * @returns {Promise}
 */
function executarComTimeout(promessa, tempoLimiteMs = 2000) {
  let timerId;

  const promessaTimeout = new Promise((_, reject) => {
    timerId = setTimeout(() => {
      reject(new FalhaTransitoria(`Tempo limite de ${tempoLimiteMs}ms excedido na comunicação.`));
    }, tempoLimiteMs);
  });

  return Promise.race([promessa, promessaTimeout])
    .finally(() => {
      clearTimeout(timerId); // Libera o timer para não reter o Event Loop
    });
}

/**
 * Utilitário de Retry seguro para falhas transitórias.
 * @param {Function} operacao - Função assíncrona a executar
 * @param {number} maxTentativas - Número máximo de execuções
 * @param {number} atrasoMs - Tempo de espera entre tentativas
 * @returns {Promise}
 */
async function executarComRetry(operacao, maxTentativas = 2, atrasoMs = 50) {
  let ultimoErro;

  for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
    try {
      return await operacao();
    } catch (erro) {
      ultimoErro = erro;

      // Só re-tenta se for comprovadamente uma falha transitória
      const ehTransitória = erro instanceof FalhaTransitoria || erro.name === 'FalhaTransitoria';
      if (!ehTransitória || tentativa >= maxTentativas) {
        throw erro;
      }

      // Pequena pausa (Backoff) antes da nova tentativa
      if (atrasoMs > 0) {
        await new Promise(resolve => setTimeout(resolve, atrasoMs));
      }
    }
  }

  throw ultimoErro;
}

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
   * Valida os dados de entrada da requisição de pagamento.
   * @private
   */
  _validarDados(dados) {
    if (!dados || typeof dados !== 'object') {
      throw new ErroNegocio('Dados do pagamento são obrigatórios.');
    }

    if (!dados.clienteId || typeof dados.clienteId !== 'string') {
      throw new ErroNegocio('Identificador do cliente é obrigatório.');
    }

    if (typeof dados.valor !== 'number' || dados.valor <= 0) {
      throw new ErroNegocio('O valor do pagamento deve ser um número positivo.');
    }

    const metodosPermitidos = ['PIX', 'CARTAO', 'BOLETO'];
    if (!dados.metodoPagamento || !metodosPermitidos.includes(dados.metodoPagamento)) {
      throw new ErroNegocio('Método de pagamento inválido.');
    }
  }

  /**
   * Processa uma transação de pagamento aplicando idempotência, timeout, retry e fallback.
   * 
   * @param {object} dados
   * @returns {Promise<object>}
   */
  async processar(dados) {
    // 1. Validação de Negócio Defensiva
    this._validarDados(dados);

    // 2. Proteção por Idempotência (Evita duplicidade de cobrança no cartão/PIX)
    if (dados.chaveIdempotencia) {
      const transacaoExistente = await this.repositorio.buscarPorChaveIdempotencia(dados.chaveIdempotencia);
      if (transacaoExistente && transacaoExistente.status === 'CONCLUIDO') {
        return {
          sucesso: true,
          repetido: true,
          transacao: transacaoExistente
        };
      }
    }

    // 3. Execução no Gateway com Timeout e Retry Inteligente
    try {
      const operacaoGateway = () => this.gateway.cobrar({
        clienteId: dados.clienteId,
        valor: dados.valor,
        metodoPagamento: dados.metodoPagamento
      });

      // Aplica retry controlado (máximo 2 tentativas) com timeout de 2000ms por tentativa
      const respostaGateway = await executarComRetry(
        () => executarComTimeout(operacaoGateway(), 2000),
        2,
        20
      );

      // Persistência da transação aprovada com sucesso
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

    } catch (erro) {
      // 4. Mecanismo de Fallback (Degradação Graciosa)
      // Se a falha for de infraestrutura/transitória, salva como pendente para conciliação
      const transacaoPendente = await this.repositorio.salvar({
        clienteId: dados.clienteId,
        valor: dados.valor,
        metodoPagamento: dados.metodoPagamento,
        chaveIdempotencia: dados.chaveIdempotencia,
        status: 'PENDENTE_RECONCILIACAO'
      });

      return {
        sucesso: false,
        fallback: true,
        motivo: erro.message,
        transacao: transacaoPendente
      };
    }
  }

  /**
   * Consulta os dados de uma transação pelo ID.
   * @param {number} id
   * @returns {Promise<object>}
   */
  async consultarPorId(id) {
    if (!id || typeof id !== 'number') {
      throw new ErroNegocio('ID de consulta inválido.');
    }

    const transacao = await this.repositorio.buscarPorId(id);
    if (!transacao) {
      throw new ErroNaoEncontrado(`Transação com identificador ${id} não localizada.`);
    }

    return transacao;
  }
}

module.exports = PagamentoService;
