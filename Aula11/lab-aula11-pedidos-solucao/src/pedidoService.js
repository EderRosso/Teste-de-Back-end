const { ErroHttp } = require('./erros');
const { comRetry, comTimeout } = require('./resiliencia');

class PedidoService {
  constructor(repositorio, opcoes = {}) {
    this.repositorio = repositorio;
    this.tentativas = opcoes.tentativas ?? 3;
    this.esperaMs = opcoes.esperaMs ?? 200;
    this.timeoutMs = opcoes.timeoutMs ?? 1000;
  }

  // LEITURA: pode repetir sem risco -> Retry + Timeout
  async buscarPedido(id) {
    let pedido;
    try {
      pedido = await comRetry(
        () => comTimeout(this.repositorio.buscarPorId(id), this.timeoutMs),
        this.tentativas,
        this.esperaMs,
      );
    } catch (erro) {
      throw new ErroHttp(503, 'Serviço temporariamente indisponível');
    }

    if (!pedido) {
      throw new ErroHttp(404, 'Pedido não encontrado');
    }
    return pedido;
  }

  // ESCRITA: NÃO repetir automaticamente (risco de pedido duplicado)
  async criarPedido(dados) {
    if (!dados.cliente) {
      throw new ErroHttp(400, 'Cliente é obrigatório');
    }
    if (!(dados.quantidade > 0)) {
      throw new ErroHttp(400, 'Quantidade inválida');
    }

    let existente;
    try {
      existente = await this.repositorio.buscarPorId(dados.id);
    } catch (erro) {
      throw new ErroHttp(503, 'Serviço temporariamente indisponível');
    }
    if (existente) {
      throw new ErroHttp(409, 'Pedido já cadastrado');
    }

    try {
      return await this.repositorio.salvar(dados);
    } catch (erro) {
      throw new ErroHttp(503, 'Serviço temporariamente indisponível');
    }
  }
}

module.exports = { PedidoService };
