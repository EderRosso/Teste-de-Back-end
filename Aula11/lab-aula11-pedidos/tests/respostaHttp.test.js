const { paraRespostaHttp } = require('../src/respostaHttp');
const { ErroHttp } = require('../src/erros');

// EXERCÍCIO 5 — os dois testes abaixo já estão prontos e começam VERMELHOS
describe('paraRespostaHttp', () => {
  beforeEach(() => {
    // o log interno é esperado; escondemos para não poluir a saída do teste
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => jest.restoreAllMocks());

  test('erro de negócio mantém status e mensagem', () => {
    const resposta = paraRespostaHttp(new ErroHttp(404, 'Pedido não encontrado'));

    expect(resposta).toEqual({ status: 404, body: { erro: 'Pedido não encontrado' } });
  });

  test('erro inesperado → 500 sem stack e sem detalhes internos', () => {
    const erro = new Error('connect ECONNREFUSED 10.0.0.5:27017');
    const resposta = paraRespostaHttp(erro);

    expect(resposta.status).toBe(500);
    expect(resposta.body).not.toHaveProperty('stack');
    expect(JSON.stringify(resposta.body)).not.toContain('ECONNREFUSED');
    expect(resposta.body.idRastreio).toHaveLength(8);
  });

  // TODO: o erro completo deve ir para o LOG do servidor
  //   expect(console.error).toHaveBeenCalledWith(expect.any(String), erro)
});
