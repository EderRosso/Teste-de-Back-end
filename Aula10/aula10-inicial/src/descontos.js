/**
 * Módulo de Cálculo de Descontos e Cupons Promocionais
 * 
 * Regras:
 * - Preço deve ser maior que zero.
 * - Cupons suportados:
 *   - 'DESC10': 10% de desconto
 *   - 'DESC20': 20% de desconto (somente para compras a partir de R$ 100,00)
 *   - 'BLACKFRIDAY': 30% de desconto fixo
 * - Benefício por tipo de cliente:
 *   - 'VIP': +5% de desconto adicional
 *   - 'PADRAO': sem adicional
 * - Desconto máximo permitido no sistema: 50% do valor do produto.
 */

/**
 * Calcula o valor absoluto do desconto a ser aplicado sobre um produto.
 * @param {number} preco - Preço original do produto
 * @param {string} [cupom] - Código do cupom promocional
 * @param {string} [tipoCliente='PADRAO'] - Categoria do cliente ('PADRAO', 'VIP')
 * @returns {number} Valor em reais do desconto concedido
 */
function calcularDesconto(preco, cupom, tipoCliente = 'PADRAO') {
  if (typeof preco !== 'number' || preco <= 0) {
    return 0;
  }

  let porcentagemDesconto = 0;

  // Avaliação do Cupom
  if (cupom === 'DESC10') {
    porcentagemDesconto += 0.10;
  } else if (cupom === 'DESC20') {
    if (preco >= 100) {
      porcentagemDesconto += 0.20;
    } else {
      // Cupom não aplicado se a compra for menor que R$ 100
      porcentagemDesconto += 0;
    }
  } else if (cupom === 'BLACKFRIDAY') {
    porcentagemDesconto += 0.30;
  } else if (cupom === 'MEGADESCONTO') {
    porcentagemDesconto += 0.60;
  }

  // Bônus para Cliente VIP
  if (tipoCliente === 'VIP') {
    porcentagemDesconto += 0.05;
  }

  // Regra de Trava de Segurança: Desconto não pode passar de 50%
  if (porcentagemDesconto > 0.50) {
    porcentagemDesconto = 0.50;
  }

  const valorDesconto = preco * porcentagemDesconto;
  return Number(valorDesconto.toFixed(2));
}

module.exports = {
  calcularDesconto
};
