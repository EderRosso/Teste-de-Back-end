// Erro com código HTTP. Use para erros de NEGÓCIO (400, 404, 409)
// e para avisar que um serviço está fora do ar (503).
class ErroHttp extends Error {
  constructor(status, mensagem) {
    super(mensagem);
    this.name = 'ErroHttp';
    this.status = status;
  }
}

module.exports = { ErroHttp };
