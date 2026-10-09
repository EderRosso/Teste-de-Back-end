/**
 * Módulo de Cálculo de Descontos e Cupons Promocionais
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
