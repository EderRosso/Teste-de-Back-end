/**
 * Testes do Mapeador de Erros HTTP e Higienização de Respostas (Versão Resolvida)
 */

const { mapearErroParaHttp } = require('../src/httpHelper');
const { ErroNegocio, ErroNaoEncontrado, FalhaTransitoria, ErroTecnico } = require('../src/erros');

describe('Mapeamento de Erros para HTTP (httpHelper)', () => {
  test('deve mapear ErroNegocio padrão para status 400 com código correspondente', () => {
    const erro = new ErroNegocio('Saldo insuficiente');
    const resposta = mapearErroParaHttp(erro, 'req-001');

    expect(resposta.status).toBe(400);
    expect(resposta.corpo).toEqual({
      sucesso: false,
      codigo: 'ERRO_NEGOCIO',
      mensagem: 'Saldo insuficiente',
      protocolo: 'req-001'
    });
  });

  test('deve mapear ErroNegocio com status 409 (Conflito)', () => {
    const erro = new ErroNegocio('CPF já cadastrado', 409);
    const resposta = mapearErroParaHttp(erro);

    expect(resposta.status).toBe(409);
    expect(resposta.corpo.codigo).toBe('CONFLITO_NEGOCIO');
    expect(resposta.corpo.mensagem).toBe('CPF já cadastrado');
  });

  test('deve mapear ErroNaoEncontrado para status 404', () => {
    const erro = new ErroNaoEncontrado('Transação inexistente');
    const resposta = mapearErroParaHttp(erro);

    expect(resposta.status).toBe(404);
    expect(resposta.corpo).toEqual({
      sucesso: false,
      codigo: 'NAO_ENCONTRADO',
      mensagem: 'Transação inexistente',
      protocolo: 'req-padrao'
    });
  });

  test('deve mapear FalhaTransitoria para status 503 com mensagem amigável', () => {
    const erro = new FalhaTransitoria('Timeout no Gateway');
    const resposta = mapearErroParaHttp(erro, 'req-999');

    expect(resposta.status).toBe(503);
    expect(resposta.corpo.codigo).toBe('SERVICO_INDISPONIVEL');
    expect(resposta.corpo.mensagem).toContain('Serviço temporariamente indisponível');
    expect(resposta.corpo.protocolo).toBe('req-999');
  });

  test('deve mapear ErroTecnico ou erro inesperado para status 500', () => {
    const erro = new ErroTecnico('Falha de IO no disco');
    const resposta = mapearErroParaHttp(erro);

    expect(resposta.status).toBe(500);
    expect(resposta.corpo.codigo).toBe('ERRO_INTERNO_SERVIDOR');
  });

  test('SEGURANÇA: nunca deve vazar a propriedade stack trace no corpo da resposta', () => {
    const erroGrave = new Error('Falha grave: pg://admin:secret@192.168.1.50:5432/financeiro');
    const resposta = mapearErroParaHttp(erroGrave);

    expect(resposta.status).toBe(500);
    // Validação de segurança OWASP: Stack trace NUNCA deve estar presente
    expect(resposta.corpo).not.toHaveProperty('stack');
    expect(resposta.corpo.mensagem).toBe('Ocorreu um erro interno no servidor. Contate o suporte com o código do protocolo.');
  });
});
