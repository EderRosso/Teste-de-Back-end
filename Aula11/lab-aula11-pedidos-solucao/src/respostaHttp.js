const { randomUUID } = require('crypto');

// Converte um erro em resposta HTTP SEGURA para o cliente.
function paraRespostaHttp(erro) {
  if (erro.status) {
    // erro conhecido (400, 404, 409, 503): a mensagem foi escrita por nós
    return { status: erro.status, body: { erro: erro.message } };
  }

  // erro inesperado: detalhes vão para o LOG; o cliente só recebe um código
  const idRastreio = randomUUID().slice(0, 8);
  console.error(`[${idRastreio}]`, erro);
  return {
    status: 500,
    body: { erro: 'Erro interno. Tente novamente mais tarde.', idRastreio },
  };
}

module.exports = { paraRespostaHttp };
