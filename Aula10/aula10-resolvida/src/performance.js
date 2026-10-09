/**
 * ============================================================================
 * Módulo de Demonstração e Medição de Performance (Benchmark)
 * ============================================================================
 * 
 * Este arquivo realiza uma análise prática comparando a eficiência de duas
 * abordagens clássicas para busca de dados em memória:
 * 
 * 1. Busca Linear em Array (Complexidade O(n)):
 *    - Percorre a lista elemento por elemento até encontrar o item ou atingir o fim.
 *    - Quanto maior a base de dados (n), mais tempo demora proporcionalmente.
 * 
 * 2. Busca Indexada com Map / Hash Table (Complexidade O(1)):
 *    - Utiliza tabela de dispersão (hash) para acessar diretamente o ponteiro
 *      do item na memória através da chave primária (ID).
 *    - O tempo de busca é praticamente constante, independentemente do volume de dados.
 * ============================================================================
 */

/**
 * Gera uma lista simulada de produtos em memória para alimentar o teste.
 * 
 * @param {number} total - Quantidade de registros a serem gerados (padrão: 60.000).
 * @returns {Array<Object>} Array contendo os objetos de produtos.
 */
function gerarMassaDeProdutos(total = 60000) {
  // Categorias predefinidas para distribuição cíclica
  const categorias = ['Eletrônicos', 'Periféricos', 'Móveis', 'Cabos', 'Monitores', 'Áudio'];
  const lista = [];

  // Loop para criar cada objeto simulando um registro de banco de dados
  for (let i = 1; i <= total; i++) {
    lista.push({
      id: i,                                                  // Chave primária sequencial
      nome: `Produto SKU-${i}`,                               // Nome fictício único
      preco: Number((Math.random() * 500 + 10).toFixed(2)),   // Preço aleatório entre 10 e 510 com 2 casas decimais
      estoque: Math.floor(Math.random() * 100),               // Estoque inteiro aleatório entre 0 e 99
      categoria: categorias[i % categorias.length]            // Distribuição uniforme entre as categorias
    });
  }

  return lista;
}

/**
 * Realiza uma busca linear dentro de um Array (Algoritmo Ineficiente - O(n)).
 * 
 * No pior cenário (item no final do array ou inexistente), o loop
 * precisará percorrer todos os N elementos da lista.
 * 
 * @param {Array<Object>} lista - Array de produtos.
 * @param {number} idBuscado - ID do produto procurado.
 * @returns {Object|null} Retorna o objeto encontrado ou null caso não exista.
 */
function buscarProdutoIneficiente(lista, idBuscado) {
  // Percorre o array do índice 0 até o último elemento
  for (let i = 0; i < lista.length; i++) {
    if (lista[i].id === idBuscado) {
      return lista[i]; // Retorna imediatamente ao encontrar
    }
  }
  return null; // Não encontrou o produto após percorrer toda a lista
}

/**
 * Realiza uma busca indexada utilizando a estrutura Map (Algoritmo Otimizado - O(1)).
 * 
 * Graças à tabela de dispersão (hash), o acesso ao registro ocorre
 * em tempo constante O(1), sem necessidade de loops iterativos.
 * 
 * @param {Map<number, Object>} mapa - Instância de Map com os IDs indexados.
 * @param {number} idBuscado - ID do produto procurado.
 * @returns {Object|null} Retorna o produto ou null caso não exista no Map.
 */
function buscarProdutoOtimizado(mapa, idBuscado) {
  return mapa.get(idBuscado) || null;
}

/**
 * Calcula a mediana de uma lista de valores numéricos (tempos de execução).
 * 
 * Por que calcular a mediana em testes de performance?
 * - A média aritmética pode ser distorcida por picos atípicos (outliers) causados
 *   por pausas do Garbage Collector do Node.js ou concorrência da CPU do SO.
 * - A mediana representa o valor central exato, oferecendo uma métrica mais estável.
 * 
 * @param {Array<number>} tempos - Array com as medições de tempo em milissegundos.
 * @returns {number} Valor da mediana calculada.
 */
function calcularMediana(tempos) {
  // Ordena os tempos do menor para o maior em uma cópia do array
  const ordenados = [...tempos].sort((a, b) => a - b);
  const meio = Math.floor(ordenados.length / 2);
  
  // Se a quantidade de amostras for ímpar, pega o elemento do meio exato
  if (ordenados.length % 2 !== 0) {
    return ordenados[meio];
  }
  // Se a quantidade for par, faz a média entre os dois valores centrais
  return (ordenados[meio - 1] + ordenados[meio]) / 2;
}

/**
 * Função principal que coordena e executa o benchmark comparativo.
 */
function executarBenchmark() {
  // Configurações do teste de performance
  const TOTAL_PRODUTOS = 60000; // Quantidade de registros na massa
  const REPETICOES = 10;        // Número de rodadas para estabilizar a média/mediana
  // IDs distribuídos ao longo da massa (início, meio, fim e um inexistente)
  const IDS_BUSCADOS = [1, 15000, 30000, 45000, 59999, 99999];

  console.log('='.repeat(70));
  console.log('📊 BENCHMARK DE PERFORMANCE — AULA 10 (SENAI CANOAS)');
  console.log(`📦 Gerando massa de teste com ${TOTAL_PRODUTOS.toLocaleString()} produtos...`);
  console.log('='.repeat(70));

  // 1. Gera o array com os 60.000 produtos
  const produtosArray = gerarMassaDeProdutos(TOTAL_PRODUTOS);

  // 2. Mede o tempo de preparação (Setup) para indexar todos os itens em um Map
  console.time('Tempo de indexação do Map (Setup)');
  const produtosMap = new Map();
  for (const p of produtosArray) {
    produtosMap.set(p.id, p); // Define o ID como chave e o objeto como valor
  }
  console.timeEnd('Tempo de indexação do Map (Setup)');
  console.log('-'.repeat(70));

  // Armazenamento dos tempos de cada rodada
  const temposIneficiente = [];
  const temposOtimizado = [];

  // ==========================================================================
  // ETAPA 1: Medição da Busca Linear O(n)
  // ==========================================================================
  console.log(`\n⏳ Executando ${REPETICOES} rodadas de busca (Versão Linear Ineficiente)...`);
  for (let rodada = 1; rodada <= REPETICOES; rodada++) {
    // Captura o tempo inicial em nanossegundos com alta precisão
    const inicio = process.hrtime.bigint();

    // Executa a busca linear para cada um dos IDs selecionados
    for (let id of IDS_BUSCADOS) {
      buscarProdutoIneficiente(produtosArray, id);
    }

    // Captura o tempo final e converte nanossegundos (1e9) para milissegundos (1e6)
    const fim = process.hrtime.bigint();
    const duracaoMs = Number(fim - inicio) / 1e6;
    temposIneficiente.push(duracaoMs);
  }

  // ==========================================================================
  // ETAPA 2: Medição da Busca Indexada O(1) com Map
  // ==========================================================================
  console.log(`⚡ Executando ${REPETICOES} rodadas de busca (Versão Otimizada com Map)...`);
  for (let rodada = 1; rodada <= REPETICOES; rodada++) {
    // Captura o tempo inicial em nanossegundos
    const inicio = process.hrtime.bigint();

    // Executa a busca otimizada via Map.get() para cada um dos IDs
    for (let id of IDS_BUSCADOS) {
      buscarProdutoOtimizado(produtosMap, id);
    }

    // Converte a diferença de nanossegundos para milissegundos
    const fim = process.hrtime.bigint();
    const duracaoMs = Number(fim - inicio) / 1e6;
    temposOtimizado.push(duracaoMs);
  }

  // ==========================================================================
  // ETAPA 3: Processamento Estatístico dos Resultados
  // ==========================================================================
  // Calcula média aritmética e mediana para a busca linear
  const mediaIneficiente = temposIneficiente.reduce((a, b) => a + b, 0) / REPETICOES;
  const medianaIneficiente = calcularMediana(temposIneficiente);

  // Calcula média aritmética e mediana para a busca com Map
  const mediaOtimizada = temposOtimizado.reduce((a, b) => a + b, 0) / REPETICOES;
  const medianaOtimizada = calcularMediana(temposOtimizado);

  // Calcula quantas vezes a abordagem com Map foi mais rápida
  const fatorMelhoria = (mediaIneficiente / mediaOtimizada).toFixed(1);

  // ==========================================================================
  // ETAPA 4: Exibição dos Resultados Formatados em Tabela
  // ==========================================================================
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

// Se o arquivo for executado diretamente no terminal (node performance.js), roda o benchmark
if (require.main === module) {
  executarBenchmark();
}

// Exporta as funções para possibilitar testes unitários automatizados
module.exports = {
  gerarMassaDeProdutos,
  buscarProdutoIneficiente,
  buscarProdutoOtimizado,
  calcularMediana,
  executarBenchmark
};
