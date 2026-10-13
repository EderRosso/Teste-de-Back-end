/**
 * Suíte de Testes de Unidade e Resiliência do PagamentoService
 */

const PagamentoService = require('../src/pagamentoService');
const PagamentoRepository = require('../src/pagamentoRepository');
const { ErroNegocio, ErroNaoEncontrado, FalhaTransitoria } = require('../src/erros');

describe('PagamentoService — Validação, Erros e Resiliência', () => {
  let repositorio;
  let gatewayMock;
  let service;

  beforeEach(async () => {
    repositorio = new PagamentoRepository();
    await repositorio.limpar();

    // Gateway mock padrão com jest.fn()
    gatewayMock = {
      cobrar: jest.fn().mockResolvedValue({ idTransacao: 'GW-1001', status: 'APROVADO' })
    };

    service = new PagamentoService(repositorio, gatewayMock);
  });

  // ==========================================================================
  // BLOCO 1: Validações de Regra de Negócio (Desafio 1)
  // ==========================================================================
  describe('Validações de Regra de Negócio (ErroNegocio)', () => {
    test('deve rejeitar pagamento se dados forem nulos', async () => {
      await expect(service.processar(null))
        .rejects
        .toThrow(ErroNegocio);
    });

    test('deve rejeitar se clienteId estiver ausente', async () => {
      const dados = { valor: 150, metodoPagamento: 'PIX' };
      await expect(service.processar(dados))
        .rejects
        .toThrow('Identificador do cliente é obrigatório.');
    });

    test('deve rejeitar se o valor for menor ou igual a zero', async () => {
      const dadosNegativo = { clienteId: 'CLI-1', valor: -50, metodoPagamento: 'PIX' };
      await expect(service.processar(dadosNegativo))
        .rejects
        .toThrow('O valor do pagamento deve ser um número positivo.');

      const dadosZero = { clienteId: 'CLI-1', valor: 0, metodoPagamento: 'PIX' };
      await expect(service.processar(dadosZero))
        .rejects
        .toThrow('O valor do pagamento deve ser um número positivo.');
    });

    test('deve rejeitar método de pagamento não suportado', async () => {
      const dadosInvalido = { clienteId: 'CLI-1', valor: 100, metodoPagamento: 'CHEQUE' };
      await expect(service.processar(dadosInvalido))
        .rejects
        .toThrow('Método de pagamento inválido.');
    });
  });

  // ==========================================================================
  // BLOCO 2: Fluxo de Sucesso e Proteção por Idempotência
  // ==========================================================================
  describe('Caminho Feliz e Idempotência', () => {
    test('deve processar pagamento com sucesso e salvar transação', async () => {
      const dados = {
        clienteId: 'CLI-1',
        valor: 200,
        metodoPagamento: 'PIX',
        chaveIdempotencia: 'IDEMP-ABC'
      };

      const resultado = await service.processar(dados);

      expect(resultado.sucesso).toBe(true);
      expect(resultado.transacao.status).toBe('CONCLUIDO');
      expect(gatewayMock.cobrar).toHaveBeenCalledTimes(1);
    });

    test('IDEMPOTÊNCIA: não deve chamar o gateway se a transação já foi concluída', async () => {
      const dados = {
        clienteId: 'CLI-1',
        valor: 200,
        metodoPagamento: 'PIX',
        chaveIdempotencia: 'IDEMP-DUPLICADA'
      };

      // Primeira execução: chama o gateway
      await service.processar(dados);
      expect(gatewayMock.cobrar).toHaveBeenCalledTimes(1);

      // Segunda execução com a MESMA chave: deve retornar a transação sem cobrar novamente!
      const resultadoDuplicado = await service.processar(dados);

      expect(resultadoDuplicado.sucesso).toBe(true);
      expect(resultadoDuplicado.repetido).toBe(true);
      // Garante que o gateway NÃO foi chamado uma segunda vez
      expect(gatewayMock.cobrar).toHaveBeenCalledTimes(1);
    });
  });

  // ==========================================================================
  // BLOCO 3: Resiliência — Falhas Transitórias, Mocks e Fallback
  // ==========================================================================
  describe('Padrões de Resiliência (Retry e Fallback)', () => {
    test('deve recuperar e concluir com sucesso após 1 falha transitória (Retry)', async () => {
      // Simula: falha na primeira tentativa (503) e sucesso na segunda
      gatewayMock.cobrar
        .mockRejectedValueOnce(new FalhaTransitoria('Oscilação 503 na operadora'))
        .mockResolvedValueOnce({ idTransacao: 'GW-RECUPERADO', status: 'APROVADO' });

      const dados = {
        clienteId: 'CLI-2',
        valor: 350,
        metodoPagamento: 'CARTAO',
        chaveIdempotencia: 'IDEMP-RETRY'
      };

      const resultado = await service.processar(dados);

      expect(resultado.sucesso).toBe(true);
      expect(gatewayMock.cobrar).toHaveBeenCalledTimes(2);
    });

    test('FALLBACK: se todas as tentativas falharem, deve salvar como PENDENTE e acionar contingência', async () => {
      // Falha contínua
      gatewayMock.cobrar.mockRejectedValue(new FalhaTransitoria('Gateway fora do ar permanentemente'));

      const dados = {
        clienteId: 'CLI-3',
        valor: 500,
        metodoPagamento: 'BOLETO'
      };

      const resultado = await service.processar(dados);

      // Não quebra com crash: aciona o Fallback gracioso
      expect(resultado.sucesso).toBe(false);
      expect(resultado.fallback).toBe(true);
      expect(resultado.transacao.status).toBe('PENDENTE_RECONCILIACAO');
    });
  });

  // ==========================================================================
  // BLOCO 4: Consulta e ErroNaoEncontrado
  // ==========================================================================
  describe('Consulta de Transações', () => {
    test('deve lançar ErroNaoEncontrado para ID inexistente', async () => {
      await expect(service.consultarPorId(999))
        .rejects
        .toThrow(ErroNaoEncontrado);
    });

    test('deve retornar a transação quando o ID existir', async () => {
      const transacaoCriada = await repositorio.salvar({
        clienteId: 'CLI-1',
        valor: 100,
        status: 'CONCLUIDO'
      });

      const encontrada = await service.consultarPorId(transacaoCriada.id);
      expect(encontrada.id).toBe(transacaoCriada.id);
      expect(encontrada.valor).toBe(100);
    });
  });
});
