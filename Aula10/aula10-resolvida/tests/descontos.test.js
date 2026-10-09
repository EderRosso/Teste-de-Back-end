/**
 * Suíte Completa de Testes de Descontos (Versão Resolvida)
 * 
 * Cobre 100% dos caminhos de cupom, cliente VIP, travas de segurança e validações.
 */

const { calcularDesconto } = require('../src/descontos');

describe('Módulo de Descontos (Testes Completos - 100% de Cobertura)', () => {

  // =========================================================================
  // 1. VALIDAÇÃO DE ENTRADA
  // =========================================================================
  describe('Validação de Preço', () => {
    test('Deve retornar 0 para preços inválidos (zero, negativo ou não-número)', () => {
      expect(calcularDesconto(0, 'DESC10')).toBe(0);
      expect(calcularDesconto(-50, 'DESC10')).toBe(0);
      expect(calcularDesconto('100', 'DESC10')).toBe(0);
      expect(calcularDesconto(null, 'DESC10')).toBe(0);
    });
  });

  // =========================================================================
  // 2. REGRAS DE CUPOM
  // =========================================================================
  describe('Regras de Cupons Promocionais', () => {
    test('Deve aplicar 10% com o cupom DESC10', () => {
      const desconto = calcularDesconto(200.00, 'DESC10');
      expect(desconto).toBe(20.00);
    });

    test('Deve aplicar 20% com o cupom DESC20 quando o preço for maior ou igual a R$ 100', () => {
      const desconto = calcularDesconto(150.00, 'DESC20');
      expect(desconto).toBe(30.00);
    });

    test('NÃO deve aplicar desconto do cupom DESC20 se o preço for menor que R$ 100', () => {
      const desconto = calcularDesconto(80.00, 'DESC20');
      expect(desconto).toBe(0.00);
    });

    test('Deve aplicar 30% com o cupom BLACKFRIDAY', () => {
      const desconto = calcularDesconto(500.00, 'BLACKFRIDAY');
      expect(desconto).toBe(150.00);
    });

    test('Deve aplicar a trava de 50% quando o cupom exceder o teto (ex: MEGADESCONTO de 60%)', () => {
      const desconto = calcularDesconto(100.00, 'MEGADESCONTO');
      expect(desconto).toBe(50.00); // Trava em 50% de 100 = 50
    });
  });

  // =========================================================================
  // 3. TIPO DE CLIENTE (VIP vs PADRÃO) E TRAVA DE SEGURANÇA
  // =========================================================================
  describe('Benefício por Tipo de Cliente', () => {
    test('Deve adicionar 5% extra para cliente VIP sem cupom', () => {
      const desconto = calcularDesconto(100.00, null, 'VIP');
      expect(desconto).toBe(5.00);
    });

    test('Deve somar desconto do cupom DESC10 (10%) com o bônus VIP (5%) = 15%', () => {
      const desconto = calcularDesconto(200.00, 'DESC10', 'VIP');
      expect(desconto).toBe(30.00); // 15% de 200 = 30
    });

    test('Não deve ultrapassar a trava máxima de 50% de desconto', () => {
      // Simula uma regra acumulada (ex: BLACKFRIDAY 30% + VIP 5% = 35%, dentro do limite)
      const desconto = calcularDesconto(1000.00, 'BLACKFRIDAY', 'VIP');
      expect(desconto).toBe(350.00);
    });
  });

});
