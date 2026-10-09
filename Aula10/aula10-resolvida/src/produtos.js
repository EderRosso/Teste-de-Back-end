/**
 * Módulo de Gestão de Produtos em Memória
 * 
 * Funções implementadas:
 * 1. listarProdutos: Retorna a lista de produtos cadastrados.
 * 2. buscarProdutoPorId: Localiza um produto pelo seu identificador único.
 * 3. verificarEstoque: Checa se a quantidade em estoque atende à demanda.
 * 4. validarProduto: Valida os campos obrigatórios e tipos para cadastro de um produto.
 */

const bancoProdutos = [
  { id: 1, nome: 'Teclado Mecânico RGB', preco: 250.00, estoque: 15, categoria: 'Periféricos' },
  { id: 2, nome: 'Mouse Gamer 16000 DPI', preco: 120.00, estoque: 0, categoria: 'Periféricos' },
  { id: 3, nome: 'Monitor UltraWide 29"', preco: 1200.00, estoque: 8, categoria: 'Monitores' },
  { id: 4, nome: 'Headset Gamer 7.1', preco: 350.00, estoque: 5, categoria: 'Áudio' }
];

function listarProdutos() {
  return bancoProdutos;
}

function buscarProdutoPorId(id) {
  if (!id || typeof id !== 'number' || id <= 0) {
    return null;
  }

  const produto = bancoProdutos.find(p => p.id === id);
  
  if (!produto) {
    return null;
  }

  return produto;
}

function verificarEstoque(id, quantidadeDesejada) {
  if (typeof quantidadeDesejada !== 'number' || quantidadeDesejada <= 0) {
    return false;
  }

  const produto = buscarProdutoPorId(id);

  if (!produto) {
    return false;
  }

  if (produto.estoque < quantidadeDesejada) {
    return false;
  }

  return true;
}

function validarProduto(produto) {
  const erros = [];

  if (!produto || typeof produto !== 'object') {
    return { valido: false, erros: ['Dados do produto inválidos ou ausentes.'] };
  }

  if (!produto.nome || typeof produto.nome !== 'string' || produto.nome.trim().length < 3) {
    erros.push('O nome deve ser um texto com pelo menos 3 caracteres.');
  }

  if (typeof produto.preco !== 'number' || produto.preco <= 0) {
    erros.push('O preço deve ser um número maior que zero.');
  }

  if (typeof produto.estoque !== 'number' || produto.estoque < 0 || !Number.isInteger(produto.estoque)) {
    erros.push('O estoque deve ser um número inteiro maior ou igual a zero.');
  }

  if (!produto.categoria || typeof produto.categoria !== 'string') {
    erros.push('A categoria é obrigatória.');
  }

  return {
    valido: erros.length === 0,
    erros
  };
}

module.exports = {
  bancoProdutos,
  listarProdutos,
  buscarProdutoPorId,
  verificarEstoque,
  validarProduto
};
