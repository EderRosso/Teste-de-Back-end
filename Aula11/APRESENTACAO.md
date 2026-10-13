# 🧪 Aula 11 — Tratamento de Exceções, Resiliência e Padrões de Falha no Back-End
## Curso de Programador Full-Stack — SENAI Canoas

---

<!-- SLIDE 1 -->
# [Slide 01/15] Abertura & Boas-Vindas: Quando as Coisas Dão Errado
### Módulo: Testes de Back-End | Disciplina: Qualidade e Confiabilidade de Software

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   SENAI CANOAS — PROGRAMADOR FULL-STACK                │
│                 AULA 11: TRATAMENTO DE EXCEÇÕES E RESILIÊNCIA          │
│                                                                        │
│    Na Aula 10 medimos cobertura e performance.                         │
│    Hoje aprenderemos: o que acontece quando o banco cai, a rede oscila │
│    ou o usuário envia dados inválidos? Como evitar que o Node trave?   │
└────────────────────────────────────────────────────────────────────────┘
```

#### 🎯 Roteiro da Aula de Hoje:
1. **Classificação das Falhas:** Erros Técnicos, de Negócio e Transitórios.
2. **Fundamentos em JavaScript:** `throw`, `try/catch`, `finally` e assincronismo com `async/await`.
3. **Testando Falhas com Jest:** `.toThrow()`, `.rejects.toThrow()` e Mocks de Erro (`mockRejectedValue`).
4. **Fronteira HTTP e Segurança:** Status 400, 404, 409, 500, 503 e proteção contra vazamento de *stack traces*.
5. **Padrões de Resiliência:** Timeout, Retry (com cautela!), Circuit Breaker e Fallback.
6. **Laboratório Prático (50 min):** Sistema de Pagamentos com Repository e Service testados contra falhas.

---

<!-- SLIDE 2 -->
# [Slide 02/15] A Taxonomia das Falhas: Nem Todo Erro é Igual
### Compreendendo as 3 Categorias Essenciais de Falha no Back-End

```text
                               TIPOS DE FALHA
       ┌──────────────────────────────┼──────────────────────────────┐
       ▼                              ▼                              ▼
  ERRO DE NEGÓCIO               ERRO TÉCNICO                 FALHA TRANSITÓRIA
  ─────────────────             ────────────                 ─────────────────
• Violação de regras.         • Falha de código/infra.     • Instabilidade temporária.
• Esperado e previsível.      • Inesperado / bug grave.    • Recuperável via retry.
• Ex: Saldo insuficiente.     • Ex: TypeError, SyntaxError.• Ex: Oscilação de rede (50ms).
• Status HTTP: 400, 404, 409  • Status HTTP: 500           • Status HTTP: 503
```

#### 📊 Comparativo Detalhado para o Desenvolvedor:

| Característica | Erro de Negócio (*Domain Error*) | Erro Técnico (*Bug / Infra*) | Falha Transitória (*Transient*) |
|---|---|---|---|
| **Origem** | Dados do usuário ou regras da aplicação | Falha de sintaxe, nulo ou banco caído | Pico de tráfego, soluço de rede |
| **Ação do Sistema** | Interromper operação e avisar o usuário | Logar alerta crítico e não vazar dados | Aguardar brevemente ou acionar fallback |
| **Tentativa Automática?** | ❌ **Nunca** (dados continuam inválidos) | ❌ **Não** (o código continuará quebrando) | ✅ **Sim** (com política de tentativas limitadas) |
| **Exemplo Prático** | Cadastrar e-mail já existente | `Cannot read properties of null` | Timeout de 200ms na API de CEP |

---

<!-- SLIDE 3 -->
# [Slide 03/15] O Ciclo de Exceção em JavaScript: `throw`, `try/catch` e `finally`
### Como o JavaScript Lança, Interrompe e Limpa Recursos

```mermaid
flowchart TD
    A["Início: Executa bloco try"] --> B{"Ocorreu uma exceção?"}
    B -- Não --> C["Conclui try com sucesso"]
    B -- Sim (throw new Error) --> D["Interrompe fluxo imediatamente"]
    D --> E["Desvia execução para bloco catch(err)"]
    C --> F["Executa bloco finally SEMPRE"]
    E --> F
    F --> G["Fim do fluxo"]
```

#### 💻 Código Executável:

```javascript
function validarTransferencia(valor, saldoDisponivel) {
  if (typeof valor !== 'number' || valor <= 0) {
    // 1. throw: Cria e arremessa a exceção, interrompendo a função
    throw new Error('Valor da transferência deve ser numérico e positivo.');
  }
  if (valor > saldoDisponivel) {
    throw new Error('Saldo insuficiente para realizar a transferência.');
  }
  return saldoDisponivel - valor;
}

// 2. try/catch/finally para proteger a execução
let conexaoAberta = true;
try {
  console.log('Iniciando processamento...');
  const novoSaldo = validarTransferencia(-50, 100);
  console.log('Sucesso! Novo saldo:', novoSaldo);
} catch (erro) {
  // 3. catch: Captura o erro, permitindo tratamento elegante
  console.error('Falha capturada:', erro.message);
} finally {
  // 4. finally: Executado SEMPRE (garante liberação de recursos)
  conexaoAberta = false;
  console.log('Conexão liberada com segurança. Estado:', conexaoAberta);
}
```

---

<!-- SLIDE 4 -->
# [Slide 04/15] O Perigo Assíncrono: Tratamento de Erros com `async/await`
### Por que Promises Não Tratadas Derrubam o Processo no Node.js

```text
CENÁRIO PERIGOSO (Callback sem await / Rejeição solta):
[ Início ] ──► consultaAssincrona() (Sem await) ──► Retorna Promise pendente
                     │
                     ▼
             [ Erro no BD ] ──► NENHUM catch escutando ──► UnhandledPromiseRejection (CRASH!)

CENÁRIO SEGURO (Com async/await e try/catch):
[ Início ] ──► await consultaAssincrona() ──► Pausa execução local até resolver
                     │
                     ▼
             [ Erro no BD ] ──► Capturado pelo catch local ──► Retorno seguro ao cliente
```

#### 💻 Comparação no Código:

```javascript
// ❌ INCORRETO: O try/catch SÍNCRONO NÃO captura erro de Promise sem await!
function buscarDadosIncorreto() {
  try {
    Promise.reject(new Error('Falha no banco externo!'));
  } catch (erro) {
    // NUNCA CHEGA AQUI! O erro escapou para o Event Loop global
    console.log('Capturado? Não!');
  }
}

// ✅ CORRETO: Função async com await dentro do try/catch
async function buscarDadosCorreto(repositorio, id) {
  try {
    // O await "desembrulha" a Promise e converte a rejeição em uma exceção capturável
    const usuario = await repositorio.buscarPorId(id);
    if (!usuario) {
      throw new Error(`Usuário ${id} não localizado no sistema.`);
    }
    return usuario;
  } catch (erro) {
    console.error(`[LOG DE AUDITORIA] Erro ao buscar usuário ${id}:`, erro.message);
    throw erro; // Re-lança para a camada controladora mapear o status HTTP
  }
}
```

---

<!-- SLIDE 5 -->
# [Slide 05/15] Testando Exceções com Jest: `.toThrow()` e `.rejects.toThrow()`
### Como Validar Cientificamente se Nossos Erros Estão Sendo Lançados

```text
┌────────────────────────────────────────────────────────────────────────┐
│               A PEGADINHA DO .toThrow() EM CÓDIGO SÍNCRONO             │
│                                                                        │
│ ❌ expect(funcaoQueQuebra()).toThrow(); // O teste quebra ANTES da asserção! │
│ ✅ expect(() => funcaoQueQuebra()).toThrow(); // O Jest executa sob controle │
└────────────────────────────────────────────────────────────────────────┘
```

#### 💻 Sintaxe Oficial no Jest:

```javascript
describe('Suíte de Testes de Exceção com Jest', () => {
  // 1. Cenário SÍNCRONO: Sempre envolva a chamada em uma arrow function () =>
  test('deve lançar erro se o valor for negativo (Síncrono)', () => {
    expect(() => {
      validarTransferencia(-10, 100);
    }).toThrow('Valor da transferência deve ser numérico e positivo.');
  });

  // 2. Cenário ASSÍNCRONO: Utilize await + .rejects.toThrow()
  test('deve rejeitar com erro se o ID não existir no banco (Assíncrono)', async () => {
    const repositorioVazio = { buscarPorId: jest.fn().mockResolvedValue(null) };

    // Aguarda a rejeição da Promise e valida a mensagem do erro lançado
    await expect(buscarDadosCorreto(repositorioVazio, 999))
      .rejects
      .toThrow('Usuário 999 não localizado no sistema.');
  });
});
```

---

<!-- SLIDE 6 -->
# [Slide 06/15] Erros HTTP e a Fronteira da API: Falando a Língua da Web
### Mapeando Exceções Internas para Status Codes Semânticos

```text
  CAMADA DE DOMÍNIO (Node.js / Service)         FRONTEIRA HTTP (Express / Web API)
  ──────────────────────────────────────         ──────────────────────────────────
  • "Saldo insuficiente"                 ──►   Status 400 (Bad Request)
  • "E-mail já cadastrado"               ──►   Status 409 (Conflict)
  • "Produto não encontrado"             ──►   Status 404 (Not Found)
  • "Banco de dados desconectado"        ──►   Status 500 (Internal Server Error)
  • "API externa fora do ar temporária"  ──►   Status 503 (Service Unavailable)
```

#### 📋 Tabela de Decisão Semântica de Erros HTTP:

| Código HTTP | Nome Oficial | Quando Utilizar? | Exemplo no E-commerce |
|---|---|---|---|
| **400** | Bad Request | Dados malformatados, parâmetros ausentes ou regras violadas. | Quantidade de itens menor que 1. |
| **404** | Not Found | O recurso solicitado pelo ID não existe no sistema. | `GET /pedidos/9999` inexistente. |
| **409** | Conflict | Conflito de estado atual (duplicidade ou chave única). | Cadastro com CPF já registrado. |
| **500** | Internal Server Error | Falha inesperada de código, exceção não tratada ou bug. | `TypeError` no processamento interno. |
| **503** | Service Unavailable | Servidor ou dependência temporariamente sobrecarregada. | Gateway de pagamentos indisponível. |

---

<!-- SLIDE 7 -->
# [Slide 07/15] Segurança no Back-End: O Perigo de Vazar *Stack Traces*
### Por que Detalhes Internos em Respostas HTTP Ajudam Invasores?

```text
❌ RESPOSTA VULNERÁVEL (Vazamento de Stack Trace em Produção):
HTTP/1.1 500 Internal Server Error
{
  "erro": "Connection refused to postgres://admin:senha123@192.168.1.50:5432/db",
  "stack": "Error at Client.connect (C:\\senai\\api\\node_modules\\pg\\lib\\client.js:132:15)\n
            at DatabaseRepository.consultar (C:\\senai\\api\\src\\repo.js:45:10)..."
}
▲ ATACANTE DESCOBRE: Banco utilizado (PostgreSQL), IP interno, versão de bibliotecas e caminhos!

✅ RESPOSTA SEGURA E PROFISSIONAL:
HTTP/1.1 500 Internal Server Error
{
  "sucesso": false,
  "codigo": "ERRO_INTERNO_SERVIDOR",
  "mensagem": "Ocorreu uma instabilidade interna. Por favor, tente novamente mais tarde.",
  "protocolo": "req-9842f1a"
}
▲ DETALHES COMPLETOS GRAVADOS APENAS NO ARQUIVO DE LOG / MONITORAMENTO INTERNO!
```

#### 🛡️ Princípio da Informação Mínima Necessária:
1. **Ambiente de Desenvolvimento (`NODE_ENV === 'development'`):** Stack trace é útil no terminal local do programador.
2. **Ambiente de Produção (`NODE_ENV === 'production'`):** Resposta ao cliente higienizada; rastreabilidade feita via ID de protocolo (*correlation ID* / *requestId*).

---

<!-- SLIDE 8 -->
# [Slide 08/15] Simulando Falhas no Jest: `mockRejectedValue` e Recuperações
### Como Testar se Nossa Aplicação Sobrevive Sem Precisar Derrubar a Infraestrutura

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   DUBLÊS DE TESTE PARA CENÁRIOS DE ERRO                │
│                                                                        │
│ • jest.fn().mockRejectedValue(erro)                                    │
│   Simula uma Promise que SEMPRE falha (ex: banco offline).             │
│                                                                        │
│ • jest.fn().mockRejectedValueOnce(erro).mockResolvedValueOnce(sucesso) │
│   Simula uma FALHA TRANSITÓRIA seguida de RECUPERAÇÃO com sucesso!     │
└────────────────────────────────────────────────────────────────────────┘
```

#### 💻 Exemplo Prático e Executável de Simulação:

```javascript
describe('Testando Resiliência com Mocks de Falha', () => {
  test('deve recuperar com sucesso após 1 falha transitória', async () => {
    // Criação do mock simulando queda inicial e recuperação posterior
    const gatewayMock = {
      cobrar: jest.fn()
        .mockRejectedValueOnce(new Error('Falha de conexão temporária 503'))
        .mockResolvedValueOnce({ idTransacao: 'TX-12345', status: 'PAGO' })
    };

    // Chamada 1: Lança erro de falha transitória
    await expect(gatewayMock.cobrar({ valor: 100 }))
      .rejects
      .toThrow('Falha de conexão temporária 503');

    // Chamada 2: Executa com sucesso após a reconexão
    const resultado = await gatewayMock.cobrar({ valor: 100 });
    expect(resultado.status).toBe('PAGO');
    expect(gatewayMock.cobrar).toHaveBeenCalledTimes(2);
  });
});
```

---

<!-- SLIDE 9 -->
# [Slide 09/15] Resiliência 1 — Timeout: O Perigo de Esperar para Sempre
### Por que Requisições Travadas Esgotam Recursos e Derrubam o Node.js?

```text
SEM TIMEOUT (Risco de Esgotamento de Recursos):
Cliente ──► Requisição ──► Node.js ──► API Externa Travada (Sem responder...)
                                        ▲ Conexão aberta ocupando memória e socket!
                                        ▲ 100 clientes esperando = Servidor trava por esgotamento!

COM TIMEOUT DEFINIDO (Proteção Rápida):
Cliente ──► Requisição ──► Node.js ──► API Externa (Tempo limite: 2000ms atingido!)
                                │
                                ▼ Dispara Abort / TimeoutError em 2000ms
Cliente ◄── Status 504 / Fallback ── Libera socket imediatamente!
```

#### 💻 Implementação Didática de Timeout em JavaScript:

```javascript
/**
 * Executa uma Promise com um tempo limite máximo de segurança.
 */
function executarComTimeout(promessa, tempoLimiteMs = 2000) {
  let timerId;

  const promessaTimeout = new Promise((_, reject) => {
    timerId = setTimeout(() => {
      reject(new Error(`Operação abortada: tempo limite de ${tempoLimiteMs}ms excedido.`));
    }, tempoLimiteMs);
  });

  // Promise.race: Quem resolver ou rejeitar primeiro ganha a disputa
  return Promise.race([promessa, promessaTimeout])
    .finally(() => clearTimeout(timerId)); // Limpa o timer para não segurar o Event Loop
}
```

---

<!-- SLIDE 10 -->
# [Slide 10/15] Resiliência 2 — Retry (Tentativas) e a Cautela com Idempotência
### Quando Insistir e Quando Parar Imediatamente?

```text
        QUANDO USAR RETRY?                            QUANDO NUNCA USAR RETRY?
   (Operações Seguras e Idempotentes)             (Operações Não Idempotentes / Efeito Colateral)
   ─────────────────────────────────             ──────────────────────────────────────────────
• Consultas GET (CEP, Produtos, Clientes).    • Transação financeira / Débito em cartão de crédito.
• Leituras de status de pedidos.              • Criação de pedido sem ID de idempotência.
• Falhas transitórias (HTTP 503, Timeout).    • Erros de validação (HTTP 400, 404, 409).
```

#### 💳 A Analogia da Máquina de Cartão:
Imagine que você passou seu cartão na maquininha da padaria e a conexão oscilou na hora de imprimir o comprovante.
- Se a maquininha passar seu cartão **mais 3 vezes automaticamente sem verificar**, você será cobrado **4 vezes**!
- Uma operação é **idempotente** quando executá-la uma vez ou dez vezes produz o **mesmo resultado final** sem duplicar efeitos.

```javascript
// Algoritmo didático de Retry com limite de tentativas
async function executarComRetry(operacao, maxTentativas = 3, atrasoMs = 500) {
  let ultimaFalha;
  for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
    try {
      return await operacao(); // Sucesso: retorna o resultado imediatamente
    } catch (erro) {
      ultimaFalha = erro;
      console.warn(`[RETRY] Tentativa ${tentativa}/${maxTentativas} falhou: ${erro.message}`);
      if (tentativa < maxTentativas) {
        await new Promise(resolve => setTimeout(resolve, atrasoMs)); // Espera antes de tentar de novo
      }
    }
  }
  throw new Error(`Falha definitiva após ${maxTentativas} tentativas. Causa: ${ultimaFalha.message}`);
}
```

---

<!-- SLIDE 11 -->
# [Slide 11/15] Resiliência 3 — Circuit Breaker e Fallback
### Protegendo o Sistema Contra o Efeito Dominó de Quedas

```mermaid
stateDiagram-v2
    [*] --> Fechado
    Fechado --> Aberto : Muitas falhas consecutivas (ex: 3 falhas)
    note right of Fechado : Fluxo Normal. Requisições passam direto.
    Aberto --> MeioAberto : Após tempo de repouso (ex: 5 segundos)
    note right of Aberto : Circuito Desarmado! Bloqueia chamadas e aciona Fallback imediatamente.
    MeioAberto --> Fechado : Chamada de teste tem sucesso!
    MeioAberto --> Aberto : Chamada de teste falha novamente!
    note right of MeioAberto : Deixa passar 1 requisição de teste para sondar o serviço.
```

#### 🏠 A Analogia do Disjuntor Residencial:
- Quando ocorre um curto-circuito na fiação da sua casa, o disjuntor **desarma** para proteger os eletrodomésticos contra incêndio.
- No software, o **Circuit Breaker** desarma para impedir que centenas de chamadas continuem batendo em um serviço que já está caído.
- **Fallback (Plano de Contingência):** O que entregar ao usuário enquanto o serviço principal está fora do ar?
  - Exemplo: Se o motor de recomendação por IA falhar, o fallback entrega a lista dos 10 produtos mais vendidos gravados em cache.

---

<!-- SLIDE 12 -->
# [Slide 12/15] Refatoração Guiada por Testes: De Código Frágil a Código Resiliente
### Acompanhando a Evolução de um Processador de Pagamentos no VS Code

```text
VERSÃO 1 (Frágil / Inicial):
❌ Não valida argumentos de entrada (aceita valor negativo).
❌ Chamada assíncrona sem try/catch e sem timeout.
❌ Devolve erro 500 com stack trace aberto quando o gateway cai.

                 EVOLUÇÃO GUIADA POR TESTES (TDD / REFACTOR)
                                     │
                                     ▼
VERSÃO 2 (Resiliente / Resolvida):
✅ Validação de negócio lança ErroNegocio (mapeado para HTTP 400).
✅ Proteção com Timeout de 2000ms e Fallback configurado.
✅ Tratamento centralizado: HTTP semântico e logs de erro higienizados.
```

#### 🛠️ O Antes e Depois no Código:

```javascript
// ❌ ANTES (Frágil): Qualquer falha trava a requisição
async function processarPagamentoFragil(dados) {
  const resposta = await gatewayExterno.cobrar(dados.valor);
  return { status: 'OK', id: resposta.id };
}

// ✅ DEPOIS (Resiliente):
async function processarPagamentoResiliente(dados, gateway, repo) {
  // 1. Validação de Negócio
  if (!dados || dados.valor <= 0) {
    throw new ErroValidacaoNegocio('O valor do pagamento deve ser maior que zero.');
  }
  // 2. Execução protegida com Fallback
  try {
    const resposta = await executarComTimeout(gateway.cobrar(dados.valor), 2000);
    await repo.salvarTransacao({ valor: dados.valor, status: 'CONCLUIDO', id: resposta.id });
    return { sucesso: true, codigo: 200, transacaoId: resposta.id };
  } catch (erro) {
    // 3. Fallback: salva transação pendente para reconciliação assíncrona
    await repo.salvarTransacao({ valor: dados.valor, status: 'PENDENTE_RECONCILIACAO' });
    return { sucesso: false, codigo: 503, aviso: 'Pagamento em análise de contingência.' };
  }
}
```

---

<!-- SLIDE 13 -->
# [Slide 13/15] Laboratório Prático: Arquitetura do Sistema de Pagamentos
### Visão Geral do Repositório Simulado, Service e Suíte de Testes

```text
Aula11/
├── aula11-inicial/                     # 🎯 PROJETO DE PRÁTICA DO ALUNO
│   ├── src/
│   │   ├── erros.js                    # Classes de Erro personalizadas
│   │   ├── httpHelper.js               # Conversor de Erros para respostas HTTP limpas
│   │   ├── pagamentoRepository.js      # Banco de dados de pagamentos simulado
│   │   └── pagamentoService.js         # Serviço com regras de negócio e resiliência (a refatorar)
│   ├── tests/
│   │   ├── erros.test.js               # Testes das classes e hierarquia de erro
│   │   ├── httpHelper.test.js          # Validação de status HTTP e ausência de stack trace
│   │   └── pagamentoService.test.js    # Testes unitários de fluxos de falha e recuperação
│   ├── package.json
│   └── jest.config.js
│
├── aula11-resolvida/                   # 🏆 GABARITO DE REFERÊNCIA DO PROFESSOR
│   └── ... (Implementação 100% resiliente com todos os testes passando)
└── README.md                           # 📖 Guia Completo da Aula e Roteiro de Resolução
```

#### 📦 Componentes do Laboratório:
1. **`erros.js`:** Classes `ErroNegocio`, `ErroTecnico`, `FalhaTransitoria` herdando de `Error`.
2. **`pagamentoRepository.js`:** Repositório com métodos `salvar()`, `buscarPorId()`, `limpar()`.
3. **`pagamentoService.js`:** Regras de cobrança com gateway mockável, timeout e fallback.
4. **`httpHelper.js`:** Higienização de mensagens e mapeamento para códigos 400, 404, 409, 500 e 503.

---

<!-- SLIDE 14 -->
# [Slide 14/15] Missão Prática dos Alunos: Desafios Progressivos (50 min)
### Colocando a Teoria em Prática com Metas Claras e Resultados Esperados

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   ROTEIRO DAS TAREFAS DOS ESTUDANTES                   │
│                                                                        │
│ 🎯 Desafio 1: Validação de Negócio e Teste com .toThrow()              │
│ 🎯 Desafio 2: Simulação de Queda de Gateway com mockRejectedValueOnce  │
│ 🎯 Desafio 3: Implementação de Timeout e Fallback Gracioso             │
│ 🎯 Desafio 4: Proteção HTTP e Higienização de Stack Trace              │
└────────────────────────────────────────────────────────────────────────┘
```

#### 📋 Especificação dos Desafios:

1. **Desafio 1 (10 min):** Em `src/pagamentoService.js`, validar se `valor <= 0` ou `clienteId` é inválido e lançar `ErroNegocio`. Cobrir em `tests/pagamentoService.test.js` usando `.rejects.toThrow()`.
2. **Desafio 2 (15 min):** Criar um teste no Jest simulando uma instabilidade transitória no gateway de pagamento com `mockRejectedValueOnce()`, validando que a lógica de Retry executa uma segunda tentativa com sucesso.
3. **Desafio 3 (15 min):** Implementar o mecanismo de contingência: se todas as tentativas falharem ou o tempo estourar (Timeout), o service deve salvar a transação no repositório como `PENDENTE` e retornar status `503`.
4. **Desafio 4 (10 min):** Garantir que `formatarRespostaHttp()` nunca inclua a propriedade `.stack` na resposta quando a aplicação estiver rodando em ambiente padrão.

#### 🏁 Resultado Esperado ao Final da Atividade:
```text
PASS tests/erros.test.js
PASS tests/httpHelper.test.js
PASS tests/pagamentoService.test.js
Test Suites: 3 passed, 3 total
Tests:       15 passed, 15 total
Snapshots:   0 total
Time:        1.42 s
```

---

<!-- SLIDE 15 -->
# [Slide 15/15] Revisão Geral, Perguntas de Fixação e Conexão com a Aula 12
### O que Aprendemos Hoje e o que Nos Espera na Próxima Aula?

```text
                               CHECKLIST DA AULA 11
  ─────────────────────────────────────────────────────────────────────────────
  ✔ Diferenciamos Erro de Negócio (400/409), Erro Técnico (500) e Transitório (503).
  ✔ Dominamos throw, try/catch, finally e o perigo do async sem await.
  ✔ Testamos exceções síncronas com .toThrow() e assíncronas com .rejects.toThrow().
  ✔ Simulamos falhas transitórias e recuperações com jest.fn() e mocks.
  ✔ Blindamos a API contra vazamento de stack traces e implementamos Timeout & Fallback.
  ✔ Compreendemos quando NUNCA usar Retry (operações financeiras não idempotentes).
```

#### ❓ Perguntas de Revisão Rápida para a Turma:
1. *Por que nunca devemos aplicar retry em uma operação de cobrança sem chave de idempotência?*
   **Resposta:** Porque a falha pode ter sido apenas no recebimento da resposta, e re-executar causará cobrança duplicada na conta do cliente.
2. *Qual status HTTP deve ser retornado quando o cliente tenta cadastrar um produto com preço negativo?*
   **Resposta:** Status 400 (Bad Request), pois trata-se de um erro de negócio e de validação da requisição.
3. *Por que o bloco `finally` é indispensável ao lidar com arquivos e bancos de dados?*
   **Resposta:** Porque ele garante a liberação de conexões e memória independentemente de ter ocorrido sucesso ou erro no bloco `try`.

---

### 🚀 Conexão com a Próxima Aula:
```text
┌────────────────────────────────────────────────────────────────────────┐
│              PRÓXIMO PASSO: AULA 12 — DOCUMENTAÇÃO DE TESTES           │
│                                                                        │
│ Na Aula 11 aprendemos a blindar e testar sistemas contra falhas.       │
│ Na Aula 12 aprenderemos a DOCUMENTAR formalmente nossa suíte:          │
│ • Elaboração de Matrizes e Planos de Casos de Teste Corporativos.      │
│ • Documentação de APIs com Swagger/OpenAPI integrando schemas de erro. │
│ • Geração de Badges de Cobertura e relatórios executivos para a equipe!│
└────────────────────────────────────────────────────────────────────────┘
```
