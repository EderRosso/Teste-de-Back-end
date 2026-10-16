const pedidoService = require('../src/services/pedido.service');
const { ValidationError, NotFoundError } = require('../src/services/pedido.service');
const pedidoRepository = require('../src/repositories/pedido.repository');

describe('Unit Tests: PedidoService', () => {
  // Garante que o repositório é reiniciado antes de cada teste (isolamento total)
  beforeEach(() => {
    pedidoRepository.limpar();
  });

  describe('cadastrarPedido', () => {
    test('1. Deve cadastrar um pedido válido com sucesso', async () => {
      const pedidoValido = {
        produto: 'Notebook Dell G7',
        quantidade: 2,
        valor: 4500
      };

      const resultado = await pedidoService.cadastrarPedido(pedidoValido);

      expect(resultado).toHaveProperty('id');
      expect(resultado.produto).toBe('Notebook Dell G7');
      expect(resultado.quantidade).toBe(2);
      expect(resultado.valor).toBe(4500);
      expect(resultado.total).toBe(9000);
      expect(resultado).toHaveProperty('criadoEm');
    });

    test('4. Deve rejeitar produto com nome vazio ou apenas espaços', async () => {
      await expect(
        pedidoService.cadastrarPedido({
          produto: '   ',
          quantidade: 1,
          valor: 100
        })
      ).rejects.toThrow(ValidationError);

      await expect(
        pedidoService.cadastrarPedido({
          produto: '',
          quantidade: 1,
          valor: 100
        })
      ).rejects.toThrow('O produto deve ter um nome válido.');
    });

    test('6. Deve rejeitar quantidade igual a zero', async () => {
      await expect(
        pedidoService.cadastrarPedido({
          produto: 'Mouse Gamer',
          quantidade: 0,
          valor: 120
        })
      ).rejects.toThrow(ValidationError);
    });

    /**
     * ⚠️ ATENÇÃO: TESTE DE REGRESSÃO DO BUG-001
     * -----------------------------------------------------------------------
     * Este teste REVELA O DEFEITO no projeto inicial dos alunos.
     * Na versão inicial, este teste VAI FALHAR intencionalmente, pois a API
     * aceita quantidades negativas (ex: -2).
     * O comportamento esperado é lançar ValidationError e recusar o cadastro!
     */
    test('5. [BUG-001] Deve rejeitar quantidade negativa lançando ValidationError', async () => {
      await expect(
        pedidoService.cadastrarPedido({
          produto: 'Mouse sem Fio',
          quantidade: -2,
          valor: 80
        })
      ).rejects.toThrow(ValidationError);
    });

    test('Extra. Deve rejeitar quantidade fracionária (não inteira)', async () => {
      await expect(
        pedidoService.cadastrarPedido({
          produto: 'Cabo HDMI',
          quantidade: 1.5,
          valor: 40
        })
      ).rejects.toThrow('A quantidade deve ser um número inteiro maior que zero.');
    });

    test('8. Deve rejeitar valor igual a zero', async () => {
      await expect(
        pedidoService.cadastrarPedido({
          produto: 'Teclado Mecânico',
          quantidade: 1,
          valor: 0
        })
      ).rejects.toThrow('O valor deve ser um número maior que zero.');
    });

    test('7. Deve rejeitar valor negativo', async () => {
      await expect(
        pedidoService.cadastrarPedido({
          produto: 'Monitor Ultrawide',
          quantidade: 1,
          valor: -500
        })
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('buscarPedidoPorId', () => {
    test('2. Deve consultar um pedido existente por ID com sucesso', async () => {
      const pedidoCriado = await pedidoService.cadastrarPedido({
        produto: 'Headset Gamer',
        quantidade: 1,
        valor: 350
      });

      const pedidoBuscado = await pedidoService.buscarPedidoPorId(pedidoCriado.id);

      expect(pedidoBuscado).toBeDefined();
      expect(pedidoBuscado.id).toBe(pedidoCriado.id);
      expect(pedidoBuscado.produto).toBe('Headset Gamer');
    });

    test('3. Deve lançar NotFoundError ao consultar pedido inexistente', async () => {
      await expect(
        pedidoService.buscarPedidoPorId(9999)
      ).rejects.toThrow(NotFoundError);

      await expect(
        pedidoService.buscarPedidoPorId(9999)
      ).rejects.toThrow('Pedido não encontrado.');
    });
  });
});
