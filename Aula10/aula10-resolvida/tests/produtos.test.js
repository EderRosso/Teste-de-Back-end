/**
 * Suíte Completa de Testes de Produtos (Versão Resolvida)
 * 
 * Cobre 100% de instruções, ramificações (branches), funções e linhas.
 */

const {
  listarProdutos,
  buscarProdutoPorId,
  verificarEstoque,
  validarProduto
} = require('../src/produtos');

describe('Módulo de Produtos (Testes Completos - 100% de Cobertura)', () => {

  // =========================================================================
  // 1. LISTAR PRODUTOS
  // =========================================================================
  describe('listarProdutos', () => {
    test('Deve retornar a lista completa com todos os produtos', () => {
      const produtos = listarProdutos();
      expect(Array.isArray(produtos)).toBe(true);
      expect(produtos.length).toBe(4);
      expect(produtos[0]).toHaveProperty('id', 1);
    });
  });

  // =========================================================================
  // 2. BUSCAR PRODUTO POR ID
  // =========================================================================
  describe('buscarProdutoPorId', () => {
    test('Deve retornar o produto correto quando o ID existir', () => {
      const produto = buscarProdutoPorId(1);
      expect(produto).not.toBeNull();
      expect(produto.id).toBe(1);
      expect(produto.nome).toBe('Teclado Mecânico RGB');
    });

    test('Deve retornar null quando o ID não for encontrado no banco', () => {
      const produto = buscarProdutoPorId(999);
      expect(produto).toBeNull();
    });

    test('Deve retornar null para IDs inválidos (nulo, não-número, zero ou negativo)', () => {
      expect(buscarProdutoPorId(null)).toBeNull();
      expect(buscarProdutoPorId(undefined)).toBeNull();
      expect(buscarProdutoPorId('1')).toBeNull();
      expect(buscarProdutoPorId(0)).toBeNull();
      expect(buscarProdutoPorId(-5)).toBeNull();
    });
  });

  // =========================================================================
  // 3. VERIFICAR ESTOQUE
  // =========================================================================
  describe('verificarEstoque', () => {
    test('Deve retornar true quando houver estoque suficiente', () => {
      // Produto 1 tem estoque = 15
      const temEstoque = verificarEstoque(1, 5);
      expect(temEstoque).toBe(true);
    });

    test('Deve retornar true quando a quantidade solicitada for exatamente igual ao estoque', () => {
      // Produto 1 tem estoque = 15
      const temEstoque = verificarEstoque(1, 15);
      expect(temEstoque).toBe(true);
    });

    test('Deve retornar false quando a quantidade solicitada for maior que o estoque', () => {
      // Produto 1 tem estoque = 15
      const temEstoque = verificarEstoque(1, 20);
      expect(temEstoque).toBe(false);
    });

    test('Deve retornar false quando o produto não existir', () => {
      const temEstoque = verificarEstoque(999, 1);
      expect(temEstoque).toBe(false);
    });

    test('Deve retornar false para quantidades inválidas (zero, negativa ou não-número)', () => {
      expect(verificarEstoque(1, 0)).toBe(false);
      expect(verificarEstoque(1, -2)).toBe(false);
      expect(verificarEstoque(1, '5')).toBe(false);
    });
  });

  // =========================================================================
  // 4. VALIDAR PRODUTO
  // =========================================================================
  describe('validarProduto', () => {
    test('Deve aprovar um produto com todos os campos válidos', () => {
      const novoProduto = {
        nome: 'Mousepad Gamer XL',
        preco: 89.90,
        estoque: 20,
        categoria: 'Acessórios'
      };

      const resultado = validarProduto(novoProduto);
      expect(resultado.valido).toBe(true);
      expect(resultado.erros).toHaveLength(0);
    });

    test('Deve rejeitar quando o objeto produto for nulo ou inválido', () => {
      const resNull = validarProduto(null);
      expect(resNull.valido).toBe(false);
      expect(resNull.erros).toContain('Dados do produto inválidos ou ausentes.');

      const resString = validarProduto('texto-invalido');
      expect(resString.valido).toBe(false);
    });

    test('Deve acumular erros quando múltiplos campos forem inválidos', () => {
      const produtoInvalido = {
        nome: 'AB',          // Nome curto (< 3 chars)
        preco: -10,          // Preço negativo
        estoque: 2.5,        // Estoque não-inteiro
        categoria: 123       // Categoria não-string
      };

      const resultado = validarProduto(produtoInvalido);
      expect(resultado.valido).toBe(false);
      expect(resultado.erros).toContain('O nome deve ser um texto com pelo menos 3 caracteres.');
      expect(resultado.erros).toContain('O preço deve ser um número maior que zero.');
      expect(resultado.erros).toContain('O estoque deve ser um número inteiro maior ou igual a zero.');
      expect(resultado.erros).toContain('A categoria é obrigatória.');
    });

    test('Deve rejeitar nome vazio, em branco ou ausente', () => {
      const res = validarProduto({ nome: '   ', preco: 50, estoque: 5, categoria: 'Geral' });
      expect(res.valido).toBe(false);
    });

    test('Deve rejeitar estoque negativo', () => {
      const res = validarProduto({ nome: 'Cabo HDMI', preco: 30, estoque: -1, categoria: 'Cabos' });
      expect(res.valido).toBe(false);
    });
  });

});
