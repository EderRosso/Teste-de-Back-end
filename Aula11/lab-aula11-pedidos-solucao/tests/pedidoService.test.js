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

  // Exercício 2
  test('pedido inexistente → 404', async () => {
    const repo = criarRepoMock();
    repo.buscarPorId.mockResolvedValue(null);
    const service = new PedidoService(repo, opcoes);

    await expect(service.buscarPedido(99))
      .rejects.toMatchObject({ status: 404, message: 'Pedido não encontrado' });
  });

  // Exercício 3
  test('banco fora → 503, sem expor a mensagem técnica', async () => {
    const repo = criarRepoMock();
    repo.buscarPorId.mockRejectedValue(new Error('connect ECONNREFUSED 10.0.0.5:27017'));
    const service = new PedidoService(repo, opcoes);

    const promessa = service.buscarPedido(1);
    await expect(promessa).rejects.toMatchObject({ status: 503 });
    await expect(promessa).rejects.not.toThrow('ECONNREFUSED');
  });

  // Exercício 4
  test('falha 1 vez e recupera na 2ª tentativa (Retry)', async () => {
    const repo = criarRepoMock();
    repo.buscarPorId
      .mockRejectedValueOnce(new Error('Timeout'))
      .mockResolvedValueOnce(pedido);
    const service = new PedidoService(repo, opcoes);

    await expect(service.buscarPedido(1)).resolves.toEqual(pedido);
    expect(repo.buscarPorId).toHaveBeenCalledTimes(2);
  });

  test('desiste depois de 3 tentativas', async () => {
    const repo = criarRepoMock();
    repo.buscarPorId.mockRejectedValue(new Error('Timeout'));
    const service = new PedidoService(repo, opcoes);

    await expect(service.buscarPedido(1)).rejects.toMatchObject({ status: 503 });
    expect(repo.buscarPorId).toHaveBeenCalledTimes(3);
  });

  // Desafio
  test('banco travado → 503 pelo Timeout', async () => {
    const repo = criarRepoMock();
    repo.buscarPorId.mockReturnValue(new Promise(() => {})); // nunca responde
    const service = new PedidoService(repo, opcoes);

    await expect(service.buscarPedido(1)).rejects.toMatchObject({ status: 503 });
    expect(repo.buscarPorId).toHaveBeenCalledTimes(3);
  });
});

describe('criarPedido', () => {
  // Exercício 1
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

  // Exercício 2
  test('pedido repetido → 409 e não salva de novo', async () => {
    const repo = criarRepoMock();
    repo.buscarPorId.mockResolvedValue(pedido);
    const service = new PedidoService(repo, opcoes);

    await expect(service.criarPedido(pedido)).rejects.toMatchObject({ status: 409 });
    expect(repo.salvar).not.toHaveBeenCalled();
  });

  // Exercício 4
  test('falha ao salvar → 503 SEM Retry (1 chamada só)', async () => {
    const repo = criarRepoMock();
    repo.buscarPorId.mockResolvedValue(null);
    repo.salvar.mockRejectedValue(new Error('Timeout'));
    const service = new PedidoService(repo, opcoes);

    await expect(service.criarPedido(pedido)).rejects.toMatchObject({ status: 503 });
    expect(repo.salvar).toHaveBeenCalledTimes(1);
  });
});
