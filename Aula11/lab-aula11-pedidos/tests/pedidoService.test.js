const { PedidoService } = require('../src/pedidoService');

// Repository simulado com jest.fn(): cada teste escolhe como ele se comporta.
function criarRepoMock() {
  return { buscarPorId: jest.fn(), salvar: jest.fn() };
}

// esperaMs: 0 e timeoutMs: 50 deixam os testes rápidos
const opcoes = { esperaMs: 0, timeoutMs: 50 };
const pedido = { id: 1, cliente: 'Ana', quantidade: 2 };

describe('buscarPedido', () => {
  test('retorna o pedido quando ele existe', async () => {
    const repo = criarRepoMock();
    repo.buscarPorId.mockResolvedValue(pedido);
    const service = new PedidoService(repo, opcoes);

    await expect(service.buscarPedido(1)).resolves.toEqual(pedido);
  });

  // EXERCÍCIO 2 — este teste já está pronto e começa VERMELHO
  test('pedido inexistente → 404', async () => {
    const repo = criarRepoMock();
    repo.buscarPorId.mockResolvedValue(null);
    const service = new PedidoService(repo, opcoes);

    await expect(service.buscarPedido(99))
      .rejects.toMatchObject({ status: 404, message: 'Pedido não encontrado' });
  });

  // EXERCÍCIO 3 — TODO: banco fora do ar → 503
  //   repo.buscarPorId.mockRejectedValue(new Error('connect ECONNREFUSED 10.0.0.5:27017'))
  //   espere status 503 e confira que a mensagem NÃO contém 'ECONNREFUSED'

  // EXERCÍCIO 4 — TODO: falha 1 vez e recupera na 2ª tentativa (Retry)
  //   use .mockRejectedValueOnce(...) seguido de .mockResolvedValueOnce(pedido)
  //   confira: resolves.toEqual(pedido) e toHaveBeenCalledTimes(2)

  // EXERCÍCIO 4 — TODO: sempre falha → desiste depois de 3 tentativas (503)

  // DESAFIO — TODO: banco travado (nunca responde) → 503 pelo Timeout
  //   repo.buscarPorId.mockReturnValue(new Promise(() => {}))
});

describe('criarPedido', () => {
  // EXERCÍCIO 1 — estes dois testes já estão prontos e começam VERMELHOS
  test('quantidade zero → 400', async () => {
    const service = new PedidoService(criarRepoMock(), opcoes);

    await expect(service.criarPedido({ id: 2, cliente: 'Bia', quantidade: 0 }))
      .rejects.toMatchObject({ status: 400, message: 'Quantidade inválida' });
  });

  test('sem cliente → 400', async () => {
    const service = new PedidoService(criarRepoMock(), opcoes);

    await expect(service.criarPedido({ id: 2, quantidade: 1 }))
      .rejects.toMatchObject({ status: 400, message: 'Cliente é obrigatório' });
  });

  test('salva um pedido válido', async () => {
    const repo = criarRepoMock();
    repo.buscarPorId.mockResolvedValue(null);
    repo.salvar.mockResolvedValue(pedido);
    const service = new PedidoService(repo, opcoes);

    await expect(service.criarPedido(pedido)).resolves.toEqual(pedido);
    expect(repo.salvar).toHaveBeenCalledWith(pedido);
  });

  // EXERCÍCIO 2 — TODO: pedido repetido → 409 e o salvar NÃO pode ser chamado
  //   repo.buscarPorId.mockResolvedValue(pedido)  (o pedido já existe)
  //   expect(repo.salvar).not.toHaveBeenCalled()

  // EXERCÍCIO 4 — TODO: falha ao salvar → 503 SEM Retry
  //   repo.salvar.mockRejectedValue(new Error('Timeout'))
  //   expect(repo.salvar).toHaveBeenCalledTimes(1)
});
