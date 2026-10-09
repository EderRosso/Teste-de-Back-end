/**
 * Testes Unitários de Produtos (Versão Inicial - Incompleta)
 * 
 * ATENÇÃO: Esta suíte de testes foi propositalmente deixada incompleta para fins didáticos.
 * Vários caminhos condicionais e funções completas não possuem cobertura de testes nesta fase.
 */

const { listarProdutos, buscarProdutoPorId } = require('../src/produtos');

describe('Módulo de Produtos (Testes Iniciais - Cobertura Incompleta)', () => {

  test('Deve listar todos os produtos cadastrados no banco em memória', () => {
    const lista = listarProdutos();
    expect(Array.isArray(lista)).toBe(true);
    expect(lista.length).toBeGreaterThan(0);
  });

  test('Deve buscar um produto existente com sucesso pelo ID', () => {
    const produto = buscarProdutoPorId(1);
    expect(produto).not.toBeNull();
    expect(produto.id).toBe(1);
    expect(produto.nome).toBe('Teclado Mecânico RGB');
  });

});
