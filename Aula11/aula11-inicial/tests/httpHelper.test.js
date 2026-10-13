/**
 * Testes do Mapeador de Erros HTTP e Higienização de Respostas
 */

const { mapearErroParaHttp } = require('../src/httpHelper');
const { ErroNegocio, ErroNaoEncontrado, FalhaTransitoria } = require('../src/erros');

describe('Mapeamento de Erros para HTTP (httpHelper)', () => {
  test('deve mapear ErroNegocio para status 400 com código correspondente', () => {
    const erro = new ErroNegocio('Saldo insuficiente');
    const resposta = mapearErroParaHttp(erro);

    expect(resposta.status).toBe(400);
    expect(resposta.corpo).toEqual({
      sucesso: false,
      codigo: 'ERRO_NEGOCIO',
      mensagem: 'Saldo insuficiente'
    });
  });

  test('deve mapear ErroNaoEncontrado para status 404', () => {
    const erro = new ErroNaoEncontrado('Transação inexistente');
    const resposta = mapearErroParaHttp(erro);

    expect(resposta.status).toBe(404);
    expect(resposta.corpo).toEqual({
      sucesso: false,
      codigo: 'NAO_ENCONTRADO',
      mensagem: 'Transação inexistente'
    });
  });

  test('deve mapear FalhaTransitoria para status 503 (Desafio do Aluno)', () => {
    const erro = new FalhaTransitoria('Gateway fora do ar');
    const resposta = mapearErroParaHttp(erro);

    expect(resposta.status).toBe(503);
    expect(resposta.corpo.codigo).toBe('SERVICO_INDISPONIVEL');
  });

  test('SEGURANÇA: nunca deve vazar a propriedade stack trace no corpo da resposta', () => {
    const erroGrave = new Error('Falha catastrófica: banco pg://admin:secret@10.0.0.1');
    const resposta = mapearErroParaHttp(erroGrave);

    expect(resposta.status).toBe(500);
    // Validação de segurança fundamental (OWASP)
    expect(resposta.corpo).not.toHaveProperty('stack');
    expect(resposta.corpo.mensagem).toBe('Ocorreu um erro interno no servidor.');
  });
});
