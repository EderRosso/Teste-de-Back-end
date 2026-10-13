/**
 * Testes das Classes de Exceção Customizadas (Versão Resolvida)
 */

const {
  ErroNegocio,
  ErroNaoEncontrado,
  FalhaTransitoria,
  ErroTecnico
} = require('../src/erros');

describe('Hierarquia de Exceções', () => {
  test('ErroNegocio deve herdar de Error e ter status 400 por padrão', () => {
    const erro = new ErroNegocio('Dados inválidos');
    expect(erro).toBeInstanceOf(Error);
    expect(erro.name).toBe('ErroNegocio');
    expect(erro.message).toBe('Dados inválidos');
    expect(erro.statusHttp).toBe(400);
  });

  test('ErroNegocio deve permitir sobrescrever statusHttp (ex: 409 Conflito)', () => {
    const erro = new ErroNegocio('Registro já existente', 409);
    expect(erro.statusHttp).toBe(409);
  });

  test('ErroNaoEncontrado deve herdar de Error e ter status 404', () => {
    const erro = new ErroNaoEncontrado('Recurso não localizado');
    expect(erro).toBeInstanceOf(Error);
    expect(erro.name).toBe('ErroNaoEncontrado');
    expect(erro.statusHttp).toBe(404);
  });

  test('FalhaTransitoria deve herdar de Error e ter status 503', () => {
    const erro = new FalhaTransitoria('Oscilação temporária de rede');
    expect(erro).toBeInstanceOf(Error);
    expect(erro.name).toBe('FalhaTransitoria');
    expect(erro.statusHttp).toBe(503);
  });

  test('ErroTecnico deve herdar de Error e ter status 500', () => {
    const erro = new ErroTecnico('Falha no banco de dados');
    expect(erro).toBeInstanceOf(Error);
    expect(erro.name).toBe('ErroTecnico');
    expect(erro.statusHttp).toBe(500);
  });
});
