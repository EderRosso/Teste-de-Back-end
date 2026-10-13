/**
 * Suíte Completa de Testes de Unidade e Resiliência (Versão Resolvida - 100% de Cobertura)
 */

const PagamentoService = require('../src/pagamentoService');
const PagamentoRepository = require('../src/pagamentoRepository');
const { ErroNegocio, ErroNaoEncontrado, FalhaTransitoria } = require('../src/erros');

describe('PagamentoService — Resiliência e Cobertura Total', () => {
  let repositorio;
  let gatewayMock;
  let service;

  beforeEach(async () => {
    repositorio = new PagamentoRepository();
    await repositorio.limpar();

    gatewayMock = {
      cobrar: jest.fn().mockResolvedValue({ idTransacao: 'GW-9901', status: 'APROVADO' })
    };

    service = new PagamentoService(repositorio, gatewayMock);
  });

  // ==========================================================================
  // BLOCO 1: Validações de Regra de Negócio (Camada Defensiva)
  // ==========================================================================
  describe('Validações de Regra de Negócio (ErroNegocio)', () => {
    test('deve lançar ErroNegocio se o payload for nulo ou não for objeto', async () => {
      await expect(service.processar(null))
        .rejects
        .toThrow('Dados do pagamento são obrigatórios.');

      await expect(service.processar('string-invalida'))
        .rejects
        .toThrow('Dados do pagamento são obrigatórios.');
    });

    test('deve lançar ErroNegocio se clienteId for ausente ou não for string', async () => {
      await expect(service.processar({ valor: 100, metodoPagamento: 'PIX' }))
        .rejects
        .toThrow('Identificador do cliente é obrigatório.');

      await expect(service.processar({ clienteId: 123, valor: 100, metodoPagamento: 'PIX' }))
        .rejects
        .toThrow('Identificador do cliente é obrigatório.');
    });

    test('deve lançar ErroNegocio se valor for menor ou igual a zero ou não numérico', async () => {
      await expect(service.processar({ clienteId: 'CLI-1', valor: -10, metodoPagamento: 'PIX' }))
        .rejects
        .toThrow('O valor do pagamento deve ser um número positivo.');

      await expect(service.processar({ clienteId: 'CLI-1', valor: 0, metodoPagamento: 'PIX' }))
        .rejects
        .toThrow('O valor do pagamento deve ser um número positivo.');

      await expect(service.processar({ clienteId: 'CLI-1', valor: 'cem', metodoPagamento: 'PIX' }))
        .rejects
        .toThrow('O valor do pagamento deve ser um número positivo.');
    });

    test('deve lançar ErroNegocio para métodos de pagamento não suportados', async () => {
      await expect(service.processar({ clienteId: 'CLI-1', valor: 50, metodoPagamento: 'CRIPTOMOEDA' }))
        .rejects
        .toThrow('Método de pagamento inválido.');
    });
  });

  // ==========================================================================
  // BLOCO 2: Caminho Feliz e Idempotência
  // ==========================================================================
  describe('Processamento com Sucesso e Proteção de Idempotência', () => {
    test('deve processar pagamento válido com PIX e persistir no repositório', async () => {
      const dados = {
        clienteId: 'CLI-A',
        valor: 150.00,
        metodoPagamento: 'PIX',
        chaveIdempotencia: 'IDEMP-TESTE-1'
      };

      const resultado = await service.processar(dados);

      expect(resultado.sucesso).toBe(true);
      expect(resultado.transacao.status).toBe('CONCLUIDO');
      expect(resultado.transacao.transacaoId).toBe('GW-9901');
      expect(gatewayMock.cobrar).toHaveBeenCalledTimes(1);
    });

    test('IDEMPOTÊNCIA: chamada repetida com mesma chave não deve cobrar no gateway', async () => {
      const dados = {
        clienteId: 'CLI-B',
        valor: 250.00,
        metodoPagamento: 'CARTAO',
        chaveIdempotencia: 'CHAVE-UNICA-999'
      };

      // Primeira execução
      const primeiraExecucao = await service.processar(dados);
      expect(primeiraExecucao.sucesso).toBe(true);
      expect(gatewayMock.cobrar).toHaveBeenCalledTimes(1);

      // Segunda execução repetida (ex: duplo clique do usuário)
      const segundaExecucao = await service.processar(dados);
      expect(segundaExecucao.sucesso).toBe(true);
      expect(segundaExecucao.repetido).toBe(true);
      expect(segundaExecucao.transacao.id).toBe(primeiraExecucao.transacao.id);

      // Gateway NÃO deve ter sido chamado novamente (evita duplicidade financeira)
      expect(gatewayMock.cobrar).toHaveBeenCalledTimes(1);
    });
  });

  // ==========================================================================
  // BLOCO 3: Padrões de Resiliência (Retry, Timeout e Fallback)
  // ==========================================================================
  describe('Resiliência: Retry, Timeout e Fallback', () => {
    test('RETRY: deve se recuperar com sucesso após 1 falha transitória', async () => {
      gatewayMock.cobrar
        .mockRejectedValueOnce(new FalhaTransitoria('Oscilação 503 na rede'))
        .mockResolvedValueOnce({ idTransacao: 'GW-RECUPERADO', status: 'APROVADO' });

      const dados = {
        clienteId: 'CLI-C',
        valor: 80.00,
        metodoPagamento: 'BOLETO'
      };

      const resultado = await service.processar(dados);

      expect(resultado.sucesso).toBe(true);
      expect(resultado.transacao.status).toBe('CONCLUIDO');
      expect(gatewayMock.cobrar).toHaveBeenCalledTimes(2);
    });

    test('FALLBACK: se todas as tentativas falharem, aciona degradação graciosa', async () => {
      gatewayMock.cobrar.mockRejectedValue(new FalhaTransitoria('Falha persistente'));

      const dados = {
        clienteId: 'CLI-D',
        valor: 300.00,
        metodoPagamento: 'PIX'
      };

      const resultado = await service.processar(dados);

      expect(resultado.sucesso).toBe(false);
      expect(resultado.fallback).toBe(true);
      expect(resultado.transacao.status).toBe('PENDENTE_RECONCILIACAO');
      expect(resultado.motivo).toContain('Falha persistente');
    });

    test('TIMEOUT / ERRO INESPERADO: deve cair em Fallback sem travar a aplicação', async () => {
      // Simula uma falha inesperada no gateway
      gatewayMock.cobrar.mockRejectedValue(new Error('Conexão abortada'));

      const dados = {
        clienteId: 'CLI-E',
        valor: 450.00,
        metodoPagamento: 'CARTAO'
      };

      const resultado = await service.processar(dados);

      expect(resultado.sucesso).toBe(false);
      expect(resultado.fallback).toBe(true);
      expect(resultado.transacao.status).toBe('PENDENTE_RECONCILIACAO');
    });
  });

  // ==========================================================================
  // BLOCO 4: Consulta por ID
  // ==========================================================================
  describe('Consulta de Transações por ID', () => {
    test('deve lançar ErroNegocio se ID for nulo ou inválido', async () => {
      await expect(service.consultarPorId(null))
        .rejects
        .toThrow(ErroNegocio);

      await expect(service.consultarPorId('id-em-string'))
        .rejects
        .toThrow('ID de consulta inválido.');
    });

    test('deve lançar ErroNaoEncontrado quando ID não existir no banco', async () => {
      await expect(service.consultarPorId(9999))
        .rejects
        .toThrow(ErroNaoEncontrado);
    });

    test('deve retornar a transação com sucesso quando ID existir', async () => {
      const transacao = await repositorio.salvar({
        clienteId: 'CLI-F',
        valor: 50.00,
        metodoPagamento: 'PIX',
        status: 'CONCLUIDO'
      });

      const resultado = await service.consultarPorId(transacao.id);
      expect(resultado.id).toBe(transacao.id);
      expect(resultado.valor).toBe(50.00);
    });
  });
});
