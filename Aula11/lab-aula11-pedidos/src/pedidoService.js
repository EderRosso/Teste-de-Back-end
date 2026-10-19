const { ErroHttp } = require('./erros');
const { comRetry, comTimeout } = require('./resiliencia');

// ATENÇÃO: versão INICIAL, que NÃO trata as falhas direito (laboratório da Aula 11).
// Use os testes para guiar a refatoração.
class PedidoService {
  constructor(repositorio, opcoes = {}) {
    this.repositorio = repositorio;
    this.tentativas = opcoes.tentativas ?? 3;
    this.esperaMs = opcoes.esperaMs ?? 200;
    this.timeoutMs = opcoes.timeoutMs ?? 1000;
  }

  async buscarPedido(id) {
    try {
      return await this.repositorio.buscarPorId(id);
    } catch (erro) {
      console.log('deu erro'); // engole o erro e segue como se nada tivesse acontecido
      return null;
    }
  }

  async criarPedido(dados) {
    // não valida nada e não confere se o pedido já existe
    return this.repositorio.salvar(dados);
  }
}

module.exports = { PedidoService };
