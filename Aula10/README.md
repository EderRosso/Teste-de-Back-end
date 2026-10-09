# Testes de Back-End — Aula 10: Análise de Cobertura e Performance

Projeto didático, completo e executável desenvolvido para a disciplina de **Testes de Back-End** no SENAI.

O objetivo principal desta aula é ensinar os alunos a **medir e aprimorar a qualidade de código** por meio de **métricas de cobertura (Code Coverage)** e **análise comparativa de desempenho (Performance & Benchmarking)** em Node.js com Jest.

O projeto é disponibilizado em duas versões:
- **`aula10-inicial/`**: Código com suíte de testes incompleta (baixa cobertura), violação de *thresholds* e algoritmo de busca ineficiente $O(N)$.
- **`aula10-resolvida/`**: Código com suíte de testes completa (**100% de cobertura**), aprovação de *thresholds* e algoritmo de busca otimizado com Map $O(1)$ (**~120x mais rápido**).

---

## Sumário

1. [Visão Geral e Objetivos](#1-visão-geral-e-objetivos)
2. [Estrutura do Projeto](#2-estrutura-do-projeto)
3. [Tecnologias Utilizadas](#3-tecnologias-utilizadas)
4. [Parte 1 — Configuração do Ambiente](#4-parte-1--configuração-do-ambiente)
5. [Parte 2 — Arquitetura do Sistema](#5-parte-2--arquitetura-do-sistema)
6. [Parte 3 — Cobertura de Código com Jest (Métricas e Relatório HTML)](#6-parte-3--cobertura-de-código-com-jest-métricas-e-relatório-html)
7. [Parte 4 — Melhorando a Cobertura (Antes vs Depois)](#7-parte-4--melhorando-a-cobertura-antes-vs-depois)
8. [Parte 5 — Configuração de Thresholds (Limiares Mínimos de Cobertura)](#8-parte-5--configuração-de-thresholds-limiares-mínimos-de-cobertura)
9. [Parte 6 — Análise de Performance: Busca Linear vs Busca com Map](#9-parte-6--análise-de-performance-busca-linear-vs-busca-com-map)
10. [Parte 7 — Exercícios Práticos para os Alunos](#10-parte-7--exercícios-práticos-para-os-alunos)
11. [Solução de Dúvidas e Erros Comuns](#11-solução-de-dúvidas-e-erros-comuns)

---

## 1. Visão Geral e Objetivos

Nesta aula prática, os estudantes consolidam os conhecimentos prévios de testes unitários e aprendem:
- Como interpretar as 4 métricas de cobertura do Jest (**Statements, Branches, Functions e Lines**).
- Como inspecionar visualmente linhas não testadas com o relatório HTML (`coverage/lcov-report/index.html`).
- Como configurar e aplicar **Thresholds** para travar a esteira caso a cobertura fique abaixo de **80%**.
- Por que **100% de cobertura não significa ausência de bugs** (testes que passam com regras incorretas).
- Como realizar **medições de tempo de execução e benchmarking** com `console.time()` / `process.hrtime.bigint()`.
- Por que a escolha de estruturas de dados (**Array vs Map / Hash Table**) impacta a latência em produção.

---

## 2. Estrutura do Projeto

```text
Aula10/
├── aula10-inicial/                    # Versão para o aluno iniciar os desafios
│   ├── src/
│   │   ├── produtos.js                # Gestão de produtos em memória
│   │   ├── descontos.js               # Cálculo de cupons e descontos
│   │   └── performance.js             # Script de benchmark comparativo
│   ├── tests/
│   │   ├── produtos.test.js           # Testes incompletos (baixa cobertura)
│   │   └── descontos.test.js          # Testes incompletos (apenas 1 cenário)
│   ├── package.json                   # Dependências e scripts npm
│   ├── jest.config.js                 # Thresholds configurados em 80% (falhará)
│   └── .gitignore
│
├── aula10-resolvida/                  # Versão final de referência (gabarito)
│   ├── src/
│   │   ├── produtos.js
│   │   ├── descontos.js
│   │   └── performance.js
│   ├── tests/
│   │   ├── produtos.test.js           # 100% de cobertura (todos os branches)
│   │   └── descontos.test.js          # 100% de cobertura (todos os cupons)
│   ├── package.json
│   ├── jest.config.js                 # Thresholds configurados em 80% (aprovado)
│   └── .gitignore
│
└── README.md                          # Guia pedagógico completo da aula
```

---

## 3. Tecnologias Utilizadas

- **Node.js** (Ambiente de execução JavaScript no Back-End).
- **Jest** (Framework de testes unitários, asserções e gerador de relatórios de cobertura).
- **CommonJS** (`require` e `module.exports`) para compatibilidade nativa sem transpilação.
- **process.hrtime.bigint() / console.time()** para medição de alta precisão em nanossegundos.
- **Relatório HTML (lcov)** para visualização interativa no navegador.

---

## 4. Parte 1 — Configuração do Ambiente

### Passo a passo no Terminal do VS Code (PowerShell / Windows):

1. Acesse a pasta da versão inicial:
   ```bash
   cd Aula10/aula10-inicial
   ```

2. Instale as dependências (Jest):
   ```bash
   npm install
   ```

3. Scripts disponíveis no `package.json`:
   ```json
   {
     "scripts": {
       "test": "jest",
       "test:watch": "jest --watch",
       "test:coverage": "jest --coverage",
       "performance": "node src/performance.js"
     }
   }
   ```

---

## 5. Parte 2 — Arquitetura do Sistema

### 1. `src/produtos.js`
Gerencia produtos armazenados em memória:
- `listarProdutos()`: Retorna o array de produtos cadastrados.
- `buscarProdutoPorId(id)`: Valida se o ID é positivo e numérico; busca no banco em memória.
- `verificarEstoque(id, quantidadeDesejada)`: Valida estoque disponível contra a quantidade solicitada.
- `validarProduto(produto)`: Valida os campos obrigatórios (`nome`, `preco`, `estoque`, `categoria`) e retorna lista de erros.

### 2. `src/descontos.js`
Calcula descontos com regras combinadas:
- Cupons: `'DESC10'` (10%), `'DESC20'` (20% se preço $\ge$ R$ 100), `'BLACKFRIDAY'` (30%), `'MEGADESCONTO'` (60%).
- Bônus por perfil: Cliente `'VIP'` ganha +5% de desconto adicional.
- **Trava de Segurança:** O desconto total não pode ultrapassar **50% do valor do produto**.

### 3. `src/performance.js`
Gera uma massa com **60.000 produtos** e compara:
- **Busca Linear $O(N)$**: Percorre o array elemento por elemento.
- **Busca Indexada com Map $O(1)$**: Recuperação instantânea por chave hash.

---

## 6. Parte 3 — Cobertura de Código com Jest

Ao rodar `npm run test:coverage` na versão **`aula10-inicial`**, obtemos o seguinte resultado real do Jest:

```text
> jest --coverage

PASS tests/descontos.test.js
PASS tests/produtos.test.js
--------------|---------|----------|---------|---------|-------------------
File          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
--------------|---------|----------|---------|---------|-------------------
All files     |   35.41 |    22.22 |   66.66 |   34.04 |                   
 descontos.js |      50 |    41.17 |     100 |      50 | 25,33-41,46,51    
 produtos.js  |   26.66 |    13.51 |      60 |   24.13 | 34,40,53-98       
--------------|---------|----------|---------|---------|-------------------
Jest: "global" coverage threshold for statements (80%) not met: 35.41%
Jest: "global" coverage threshold for branches (80%) not met: 22.22%
Jest: "global" coverage threshold for lines (80%) not met: 34.04%
Jest: "global" coverage threshold for functions (80%) not met: 66.66%

Test Suites: 2 passed, 2 total
Tests:       3 passed, 3 total
```

### O que significa cada métrica?

| Métrica | Significado | Exemplo no Código |
|---|---|---|
| **% Stmts** (Statements) | Percentual de comandos executados. | `const x = 10;`, `return true;` |
| **% Branch** (Ramificações) | Percentual de bifurcações lógicas testadas em ambos os sentidos (*true* e *false*). | `if (preco >= 100)` testado tanto com 150 quanto com 80. |
| **% Funcs** (Funções) | Percentual de funções declaradas que foram invocadas ao menos uma vez. | `validarProduto()` foi chamada pelo menos uma vez? |
| **% Lines** (Linhas) | Percentual de linhas de código executadas. | Linhas não executadas aparecem na coluna *Uncovered Line #s*. |

### Como abrir o Relatório Visual HTML:
O Jest gera automaticamente um relatório em `coverage/lcov-report/index.html`.
Para visualizar no navegador:
1. No VS Code, clique com o botão direito sobre `coverage/lcov-report/index.html`.
2. Selecione **"Open with Live Server"** ou **"Reveal in File Explorer"** e abra no Chrome/Edge.
- 🔴 **Vermelho:** Linhas ou funções que nunca foram executadas por nenhum teste.
- 🟡 **Amarelo:** Branches condicionais onde apenas um dos lados (`if` ou `else`) foi percorrido.
- 🟢 **Verde:** Código totalmente coberto e executado.

---

## 7. Parte 4 — Melhorando a Cobertura (Antes vs Depois)

### O Problema do Código Inicial:
Na versão inicial, tínhamos apenas **3 testes**:
1. `listarProdutos()`
2. `buscarProdutoPorId(1)`
3. `calcularDesconto(200, 'DESC10')`

Funções como `verificarEstoque()` e `validarProduto()`, além de cupons como `DESC20`, `BLACKFRIDAY` e clientes `VIP`, estavam com **0% de cobertura**!

### A Solução na Versão Resolvida:
Criamos testes sistemáticos para:
- ID inválido (string, nulo, zero, negativo) e ID inexistente (`999`).
- Estoque suficiente, estoque insuficiente, produto sem estoque e quantidade inválida.
- Validação de produto: dados nulos, nome curto, preço negativo, estoque decimal e categoria ausente.
- Cupons `DESC20` com preço $\ge 100$ e $< 100$, `BLACKFRIDAY`, `MEGADESCONTO` (trava de 50%) e cliente `VIP`.

### Resultado da Versão Resolvida (`aula10-resolvida`):

```text
> jest --coverage

PASS tests/produtos.test.js
PASS tests/descontos.test.js
--------------|---------|----------|---------|---------|-------------------
File          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
--------------|---------|----------|---------|---------|-------------------
All files     |     100 |      100 |     100 |     100 |                   
 descontos.js |     100 |      100 |     100 |     100 |                   
 produtos.js  |     100 |      100 |     100 |     100 |                   
--------------|---------|----------|---------|---------|-------------------
Test Suites: 2 passed, 2 total
Tests:       23 passed, 23 total
```

> [!WARNING]
> ### 🚨 Reflexão Crítica: 100% de Cobertura NÃO Garante Ausência de Bugs!
> Suponha que o programador cometa um erro na regra do cupom:
> ```javascript
> if (cupom === 'DESC10') {
>   porcentagemDesconto += 0.50; // Deveria ser 0.10!
> }
> ```
> Se o teste for escrito de forma relaxada:
> ```javascript
> test('deve dar desconto', () => {
>   const desc = calcularDesconto(100, 'DESC10');
>   expect(desc).toBeGreaterThan(0); // Passa com 100% de cobertura, mas o bug existe!
> });
> ```
> O teste passa, o coverage fica em 100%, mas a aplicação dará 50% de desconto em vez de 10%. **A cobertura mede quais linhas foram executadas, não se a asserção valida o requisito de negócio correto.**

---

## 8. Parte 5 — Configuração de Thresholds (Limiares Mínimos)

No arquivo [`jest.config.js`](file:///c:/Users/Dell%20G7/Documents/SenaiCanoas/PROGRAMADOR%20FULL-STACK/Testes%20de%20Back-end/TestesP/Teste-de-Back-end/Aula10/aula10-inicial/jest.config.js), definimos que o projeto exige no mínimo **80% de cobertura**:

```javascript
module.exports = {
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### Comportamento:
- **Na versão inicial (35% de cobertura):** O Jest finaliza com **erro e código de saída 1**, bloqueando a esteira de CI/CD.
- **Na versão resolvida (100% de cobertura):** O Jest finaliza com **sucesso e código de saída 0**.

---

## 9. Parte 6 — Análise de Performance: Busca Linear vs Busca com Map

Para executar o benchmark de desempenho:
```bash
npm run performance
```

### Resultados Reais Medidos no Terminal:

```text
======================================================================
📊 BENCHMARK DE PERFORMANCE — AULA 10 (SENAI CANOAS)
📦 Gerando massa de teste com 60.000 produtos...
======================================================================
Tempo de indexação do Map (Setup): 6.122ms
----------------------------------------------------------------------

⏳ Executando 10 rodadas de busca (Versão Linear Ineficiente)...
⚡ Executando 10 rodadas de busca (Versão Otimizada com Map)...

======================================================================
📈 RESULTADOS FINAIS DAS MEDIÇÕES
======================================================================
┌─────────┬─────────────────────────────┬──────────────────┬──────────────┐
│ (index) │ Abordagem                   │ Tempo Médio (ms) │ Mediana (ms) │
├─────────┼─────────────────────────────┼──────────────────┼──────────────┤
│ 0       │ 'Linear / Ineficiente O(N)' │ '0.8413'         │ '0.6771'     │
│ 1       │ 'Indexada com Map O(1)'     │ '0.0069'         │ '0.0006'     │
└─────────┴─────────────────────────────┴──────────────────┴──────────────┘

🚀 Conclusão: A abordagem com Map foi aproximadamente 122.6x mais rápida!
======================================================================
```

### Conceitos Teóricos Explicados:
- **Tempo de Execução:** O intervalo em milissegundos que a CPU leva para processar a instrução.
- **Latência:** O tempo total que uma requisição demora para ir e voltar ao cliente.
- **Gargalo de Processamento (*Bottleneck*):** Um trecho de código lento que estrangula o throughput de todo o servidor.
- **Por que a busca linear demora mais?** Percorrer 60.000 posições exige até 60.000 comparações na memória ($O(N)$). O `Map` usa uma função hash que localiza o endereço de memória diretamente em 1 única operação ($O(1)$).
- **Por que calcular média e mediana?** Uma única medição pode sofrer variações causadas pelo sistema operacional (*Garbage Collector*, concorrência de CPU). A média e a mediana em múltiplas rodadas eliminam distorções estatísticas.

> [!NOTE]
> Esta medição avalia o desempenho de funções e algoritmos em memória RAM. Ela complementa (e não substitui) testes de carga de API com ferramentas como **k6** ou **Artillery**.

---

## 10. Parte 7 — Exercícios Práticos para os Alunos

Os alunos devem utilizar a pasta `aula10-inicial` para realizar os seguintes exercícios progressivos:

### Exercício 1: Identificar Linha sem Cobertura
- **Objetivo:** Executar `npm run test:coverage` na pasta `aula10-inicial` e consultar o relatório HTML em `coverage/lcov-report/index.html`.
- **Tarefa:** Identificar quais linhas da função `buscarProdutoPorId()` em `src/produtos.js` estão destacadas em vermelho (sem cobertura).

### Exercício 2: Criar Teste para o Caminho `else` do Cupom DESC20
- **Objetivo:** Cobrir o branch condicional do cupom `DESC20` quando o valor da compra for inferior a R$ 100,00.
- **Tarefa:** Em `tests/descontos.test.js`, escrever um teste que passe um preço de R$ 80,00 com o cupom `DESC20` e garanta que o desconto seja `0`.

### Exercício 3: Testar Entradas Inválidas na Validação de Produto
- **Objetivo:** Garantir que dados corrompidos sejam rejeitados pela função `validarProduto()`.
- **Tarefa:** Escrever um teste que passe um produto com `nome: "AB"` (menos de 3 caracteres) e `preco: -10` (negativo), validando que `valido` seja `false` e que o array `erros` contenha as mensagens esperadas.

### Exercício 4: Atingir o Threshold de 80%
- **Objetivo:** Adicionar testes suficientes em `tests/produtos.test.js` e `tests/descontos.test.js` para que todas as métricas superem 80% e o comando `npm run test:coverage` passe com sucesso (código 0).

### Exercício 5: Executar e Analisar o Benchmark de Performance
- **Objetivo:** Executar `npm run performance` e responder:
  1. Qual foi o tempo médio da busca linear e da busca com Map?
  2. Quantas vezes a busca com Map foi mais rápida no seu computador?

---

## 11. Solução de Dúvidas e Erros Comuns

### 1. `Jest: "global" coverage threshold not met`
- **Causa:** A cobertura de testes do projeto está abaixo dos valores configurados em `jest.config.js`.
- **Solução:** Escreva testes para as linhas e ramos indicados na coluna *Uncovered Line #s*.

### 2. O arquivo HTML do relatório de cobertura não abre
- **Causa:** O comando `npm run test:coverage` ainda não foi executado.
- **Solução:** Execute `npm run test:coverage` para que a pasta `coverage/lcov-report/` seja criada.

### 3. Variação excessiva nos tempos de performance
- **Causa:** Outros programas pesados consumindo CPU em segundo plano ou coleta de lixo do Node (*Garbage Collector*).
- **Solução:** Por isso o script executa 10 rodadas e calcula a mediana dos tempos.
