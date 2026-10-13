/**
 * Mapeador e Formatador de Respostas HTTP para Exceções
 * 
 * ATENÇÃO (Desafio para o Aluno):
 * Na versão inicial, esta função apresenta vulnerabilidades:
 * 1. Não mapeia adequadamente a classe 'FalhaTransitoria' para o status 503.
 * 2. Em alguns cenários, pode vazar a propriedade 'stack' do erro no JSON de resposta!
 */

const { ErroNegocio, ErroNaoEncontrado, FalhaTransitoria } = require('./erros');

/**
 * Converte um objeto de erro capturado em uma resposta HTTP semântica e segura.
 * @param {Error} erro
 * @returns {{ status: number, corpo: object }}
 */
function mapearErroParaHttp(erro) {
  if (erro instanceof ErroNegocio) {
    return {
      status: erro.statusHttp || 400,
      corpo: {
        sucesso: false,
        codigo: 'ERRO_NEGOCIO',
        mensagem: erro.message
      }
    };
  }

  if (erro instanceof ErroNaoEncontrado) {
    return {
      status: 404,
      corpo: {
        sucesso: false,
        codigo: 'NAO_ENCONTRADO',
        mensagem: erro.message
      }
    };
  }

  // TODO (Aluno - Desafio 4):
  // 1. Tratar FalhaTransitoria com status 503 e código 'SERVICO_INDISPONIVEL'.
  // 2. Garantir que a propriedade 'stack' NUNCA seja enviada ao cliente!

  // Implementação inicial vulnerável / genérica:
  return {
    status: 500,
    corpo: {
      sucesso: false,
      codigo: 'ERRO_INTERNO',
      mensagem: erro.message || 'Erro interno no servidor.',
      stack: erro.stack // ❌ VULNERABILIDADE: Vazamento de Stack Trace em Produção!
    }
  };
}

module.exports = {
  mapearErroParaHttp
};
