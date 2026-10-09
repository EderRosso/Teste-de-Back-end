/**
 * Módulo de Demonstração e Medição de Performance
 * 
 * Compara a eficiência algorítmica de duas abordagens de busca em grande volume de dados:
 * 1. Busca Linear Repetitiva / Ineficiente (O(n))
 * 2. Busca Indexada com Map / Tabela Hash (O(1))
 */

function gerarMassaDeProdutos(total = 60000) {
  const categorias = ['Eletrônicos', 'Periféricos', 'Móveis', 'Cabos', 'Monitores', 'Áudio'];
  const lista = [];

  for (let i = 1; i <= total; i++) {
    lista.push({
      id: i,
      nome: `Produto SKU-${i}`,
      preco: Number((Math.random() * 500 + 10).toFixed(2)),
      estoque: Math.floor(Math.random() * 100),
      categoria: categorias[i % categorias.length]
    });
  }

  return lista;
}

function buscarProdutoIneficiente(lista, idBuscado) {
  for (let i = 0; i < lista.length; i++) {
    if (lista[i].id === idBuscado) {
      return lista[i];
    }
  }
  return null;
}

function buscarProdutoOtimizado(mapa, idBuscado) {
  return mapa.get(idBuscado) || null;
}

function calcularMediana(tempos) {
  const ordenados = [...tempos].sort((a, b) => a - b);
  const meio = Math.floor(ordenados.length / 2);
  
  if (ordenados.length % 2 !== 0) {
    return ordenados[meio];
  }
  return (ordenados[meio - 1] + ordenados[meio]) / 2;
}

function executarBenchmark() {
  const TOTAL_PRODUTOS = 60000;
  const REPETICOES = 10;
  const IDS_BUSCADOS = [1, 15000, 30000, 45000, 59999, 99999];

  console.log('='.repeat(70));
  console.log('📊 BENCHMARK DE PERFORMANCE — AULA 10 (SENAI CANOAS)');
  console.log(`📦 Gerando massa de teste com ${TOTAL_PRODUTOS.toLocaleString()} produtos...`);
  console.log('='.repeat(70));

  const produtosArray = gerarMassaDeProdutos(TOTAL_PRODUTOS);

  console.time('Tempo de indexação do Map (Setup)');
  const produtosMap = new Map();
  for (const p of produtosArray) {
    produtosMap.set(p.id, p);
  }
  console.timeEnd('Tempo de indexação do Map (Setup)');
  console.log('-'.repeat(70));

  const temposIneficiente = [];
  const temposOtimizado = [];

  console.log(`\n⏳ Executando ${REPETICOES} rodadas de busca (Versão Linear Ineficiente)...`);
  for (let rodada = 1; rodada <= REPETICOES; rodada++) {
    const inicio = process.hrtime.bigint();

    for (let id of IDS_BUSCADOS) {
      buscarProdutoIneficiente(produtosArray, id);
    }

    const fim = process.hrtime.bigint();
    const duracaoMs = Number(fim - inicio) / 1e6;
    temposIneficiente.push(duracaoMs);
  }

  console.log(`⚡ Executando ${REPETICOES} rodadas de busca (Versão Otimizada com Map)...`);
  for (let rodada = 1; rodada <= REPETICOES; rodada++) {
    const inicio = process.hrtime.bigint();

    for (let id of IDS_BUSCADOS) {
      buscarProdutoOtimizado(produtosMap, id);
    }

    const fim = process.hrtime.bigint();
    const duracaoMs = Number(fim - inicio) / 1e6;
    temposOtimizado.push(duracaoMs);
  }

  const mediaIneficiente = temposIneficiente.reduce((a, b) => a + b, 0) / REPETICOES;
  const medianaIneficiente = calcularMediana(temposIneficiente);

  const mediaOtimizada = temposOtimizado.reduce((a, b) => a + b, 0) / REPETICOES;
  const medianaOtimizada = calcularMediana(temposOtimizado);

  const fatorMelhoria = (mediaIneficiente / mediaOtimizada).toFixed(1);

  console.log('\n' + '='.repeat(70));
  console.log('📈 RESULTADOS FINAIS DAS MEDIÇÕES');
  console.log('='.repeat(70));
  console.table([
    {
      'Abordagem': 'Linear / Ineficiente O(N)',
      'Tempo Médio (ms)': mediaIneficiente.toFixed(4),
      'Mediana (ms)': medianaIneficiente.toFixed(4)
    },
    {
      'Abordagem': 'Indexada com Map O(1)',
      'Tempo Médio (ms)': mediaOtimizada.toFixed(4),
      'Mediana (ms)': medianaOtimizada.toFixed(4)
    }
  ]);

  console.log(`\n🚀 Conclusão: A abordagem com Map foi aproximadamente ${fatorMelhoria}x mais rápida!`);
  console.log('='.repeat(70) + '\n');
}

if (require.main === module) {
  executarBenchmark();
}

module.exports = {
  gerarMassaDeProdutos,
  buscarProdutoIneficiente,
  buscarProdutoOtimizado,
  calcularMediana,
  executarBenchmark
};
