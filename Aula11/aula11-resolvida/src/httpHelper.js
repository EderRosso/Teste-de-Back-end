/**
 * Mapeador e Formatador Seguro de Respostas HTTP para Exceções
 * (Versão Resolvida — Padrão Corporativo e Seguro)
 */

const { ErroNegocio, ErroNaoEncontrado, FalhaTransitoria } = require('./erros');

/**
 * Converte um objeto de erro capturado em uma resposta HTTP semântica e segura.
 * Garante que dados internos sensíveis e stack traces JAMAIS vazem para o cliente.
 * 
 * @param {Error} erro - Exceção capturada
 * @param {string} [protocolo='req-padrao'] - Identificador único da requisição para rastreabilidade
 * @returns {{ status: number, corpo: object }}
 */
function mapearErroParaHttp(erro, protocolo = 'req-padrao') {
  // 1. Erros de Domínio / Regra de Negócio (400, 409, etc.)
  if (erro instanceof ErroNegocio) {
    return {
      status: erro.statusHttp || 400,
      corpo: {
        sucesso: false,
        codigo: erro.statusHttp === 409 ? 'CONFLITO_NEGOCIO' : 'ERRO_NEGOCIO',
        mensagem: erro.message,
        protocolo
      }
    };
  }

  // 2. Recurso Não Encontrado (404)
  if (erro instanceof ErroNaoEncontrado) {
    return {
      status: 404,
      corpo: {
        sucesso: false,
        codigo: 'NAO_ENCONTRADO',
        mensagem: erro.message,
        protocolo
      }
    };
  }

  // 3. Falha Transitória / Indisponibilidade Temporária (503)
  if (erro instanceof FalhaTransitoria) {
    return {
      status: 503,
      corpo: {
        sucesso: false,
        codigo: 'SERVICO_INDISPONIVEL',
        mensagem: 'Serviço temporariamente indisponível. Por favor, tente novamente em alguns instantes.',
        protocolo
      }
    };
  }

  // 4. Erros Técnicos / Inesperados (500)
  // SEGURANÇA: Registra o erro detalhado no console do servidor para o time de SRE/Dev,
  // mas devolve ao cliente externo uma mensagem padronizada e higienizada sem stack trace!
  return {
    status: 500,
    corpo: {
      sucesso: false,
      codigo: 'ERRO_INTERNO_SERVIDOR',
      mensagem: 'Ocorreu um erro interno no servidor. Contate o suporte com o código do protocolo.',
      protocolo
    }
  };
}

module.exports = {
  mapearErroParaHttp
};
