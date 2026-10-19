// Simula requisições à API usando o Repository em memória.
// Rode com: npm run simular
const { PedidoRepository } = require('../src/pedidoRepository');
const { PedidoService } = require('../src/pedidoService');
const { paraRespostaHttp } = require('../src/respostaHttp');

async function requisicao(descricao, acao, statusOk = 200) {
  try {
    const dados = await acao();
    console.log(`${descricao}\n  → ${statusOk}`, JSON.stringify(dados));
  } catch (erro) {
    const resposta = paraRespostaHttp(erro);
    console.log(`${descricao}\n  → ${resposta.status}`, JSON.stringify(resposta.body));
  }
}

async function main() {
  const repo = new PedidoRepository();
  const service = new PedidoService(repo, { esperaMs: 100, timeoutMs: 500 });

  await requisicao('POST pedido 1', () => service.criarPedido({ id: 1, cliente: 'Ana', quantidade: 2 }), 201);
  await requisicao('POST pedido 1 de novo', () => service.criarPedido({ id: 1, cliente: 'Ana', quantidade: 2 }), 201);
  await requisicao('POST quantidade 0', () => service.criarPedido({ id: 2, cliente: 'Bia', quantidade: 0 }), 201);
  await requisicao('GET pedido 1', () => service.buscarPedido(1));
  await requisicao('GET pedido 99', () => service.buscarPedido(99));

  repo.foraDoAr = true; // o banco cai
  await requisicao('GET pedido 1 (banco fora do ar)', () => service.buscarPedido(1));
}

main();
