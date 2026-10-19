// ATENÇÃO: versão INICIAL, INSEGURA (laboratório da Aula 11).
// Devolve a mensagem técnica e o stack trace para quem chamou a API.
function paraRespostaHttp(erro) {
  return {
    status: 500,
    body: { erro: erro.message, stack: erro.stack },
  };
}

module.exports = { paraRespostaHttp };
