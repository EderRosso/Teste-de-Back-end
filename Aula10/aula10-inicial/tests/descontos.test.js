/**
 * Testes Unitários de Descontos (Versão Inicial - Incompleta)
 * 
 * Propositalmente testa apenas um cenário básico.
 */

const { calcularDesconto } = require('../src/descontos');

describe('Módulo de Descontos (Testes Iniciais - Cobertura Incompleta)', () => {

  test('Deve aplicar 10% de desconto quando o cupom for DESC10', () => {
    const desconto = calcularDesconto(200.00, 'DESC10');
    expect(desconto).toBe(20.00);
  });

});
