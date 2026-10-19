// Repository SIMULADO: guarda os pedidos em memória (no lugar de um banco real).
// Nos testes, NÃO usamos este arquivo: entregamos ao Service um mock com jest.fn().
// Ele existe para o script "npm run simular" e para mostrar o formato do repositório.

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class PedidoRepository {
  constructor() {
    this.pedidos = new Map();
    this.foraDoAr = false; // mude para true para simular o banco caído
  }

  async buscarPorId(id) {
    await esperar(20);
    if (this.foraDoAr) throw new Error('connect ECONNREFUSED 10.0.0.5:27017');
    return this.pedidos.get(id) || null;
  }

  async salvar(pedido) {
    await esperar(20);
    if (this.foraDoAr) throw new Error('connect ECONNREFUSED 10.0.0.5:27017');
    this.pedidos.set(pedido.id, pedido);
    return pedido;
  }
}

module.exports = { PedidoRepository };
