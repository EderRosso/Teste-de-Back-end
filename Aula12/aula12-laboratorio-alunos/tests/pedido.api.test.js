const request = require('supertest');
const app = require('../src/app');
const pedidoRepository = require('../src/repositories/pedido.repository');

describe('Integration Tests: API de Pedidos (Express + Supertest)', () => {
  // Limpa o repositório em memória antes de cada teste garantindo independência e repetibilidade
  beforeEach(() => {
    pedidoRepository.limpar();
    jest.restoreAllMocks();
  });

  describe('POST /pedidos - Cadastro de Pedidos', () => {
    test('1. Deve cadastrar um pedido válido com status HTTP 201', async () => {
      const response = await request(app)
        .post('/pedidos')
        .send({
          produto: 'Notebook',
          quantidade: 2,
          valor: 2500
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.produto).toBe('Notebook');
      expect(response.body.quantidade).toBe(2);
      expect(response.body.valor).toBe(2500);
      expect(response.body.total).toBe(5000);
    });

    test('4. Deve retornar HTTP 400 ao tentar cadastrar produto com nome vazio', async () => {
      const response = await request(app)
        .post('/pedidos')
        .send({
          produto: '',
          quantidade: 1,
          valor: 150
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'O produto deve ter um nome válido.'
      });
    });

    test('6. Deve retornar HTTP 400 ao tentar cadastrar com quantidade zero', async () => {
      const response = await request(app)
        .post('/pedidos')
        .send({
          produto: 'Teclado',
          quantidade: 0,
          valor: 100
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'A quantidade deve ser um número inteiro maior que zero.'
      });
    });

    /**
     * ⚠️ ATENÇÃO: TESTE DE REGRESSÃO DE API DO BUG-001
     * -----------------------------------------------------------------------
     * Este teste REVELA O DEFEITO no projeto inicial dos alunos.
     * Na versão inicial, este teste VAI FALHAR intencionalmente, pois a API
     * aceita quantidade negativa (-2) e retorna HTTP 201 ao invés de HTTP 400.
     */
    test('5. [BUG-001] Deve retornar HTTP 400 ao enviar quantidade negativa', async () => {
      const response = await request(app)
        .post('/pedidos')
        .send({
          produto: 'Mouse',
          quantidade: -2,
          valor: 80
        });

      // No projeto inicial dos alunos, isso retorna 201 (FALHA no teste!).
      // Após a correção, deve retornar 400 (SUCESSO no teste!).
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'A quantidade deve ser um número inteiro maior que zero.'
      });
    });

    test('7. Deve retornar HTTP 400 ao enviar valor negativo', async () => {
      const response = await request(app)
        .post('/pedidos')
        .send({
          produto: 'Webcam 1080p',
          quantidade: 1,
          valor: -120
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'O valor deve ser um número maior que zero.'
      });
    });

    test('8. Deve retornar HTTP 400 ao enviar valor zero', async () => {
      const response = await request(app)
        .post('/pedidos')
        .send({
          produto: 'Mousepad Extra Grande',
          quantidade: 1,
          valor: 0
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'O valor deve ser um número maior que zero.'
      });
    });

    test('9. Deve retornar HTTP 500 sem expor detalhes técnicos em caso de erro inesperado', async () => {
      // Força um erro inesperado na camada de persistência para testar a resiliência
      jest.spyOn(pedidoRepository, 'criar').mockImplementationOnce(() => {
        throw new Error('Falha catastrófica de I/O em disco');
      });

      const response = await request(app)
        .post('/pedidos')
        .send({
          produto: 'Roteador Wi-Fi',
          quantidade: 1,
          valor: 300
        });

      expect(response.status).toBe(500);
      // Garante que o stack trace e a mensagem técnica não vazam para o cliente
      expect(response.body).toEqual({
        error: 'Erro interno do servidor'
      });
      expect(response.body.stack).toBeUndefined();
    });
  });

  describe('GET /pedidos/:id - Consulta de Pedidos', () => {
    test('2. Deve consultar um pedido existente com HTTP 200', async () => {
      // Cria primeiro um pedido válido
      const postResponse = await request(app)
        .post('/pedidos')
        .send({
          produto: 'Monitor 27 Polegadas',
          quantidade: 1,
          valor: 1200
        });

      const pedidoId = postResponse.body.id;

      // Consulta o pedido criado
      const getResponse = await request(app).get(`/pedidos/${pedidoId}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.id).toBe(pedidoId);
      expect(getResponse.body.produto).toBe('Monitor 27 Polegadas');
      expect(getResponse.body.quantidade).toBe(1);
      expect(getResponse.body.valor).toBe(1200);
      expect(getResponse.body.total).toBe(1200);
    });

    test('3. Deve retornar HTTP 404 para pedido inexistente', async () => {
      const response = await request(app).get('/pedidos/99999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: 'Pedido não encontrado.'
      });
    });

    test('10. Deve garantir que o estado do repositório é isolado entre requisições', async () => {
      // Valida que ao iniciar o teste a lista está limpa
      const response = await request(app).get('/pedidos/1');
      expect(response.status).toBe(404);
    });
  });
});
