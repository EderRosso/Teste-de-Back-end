# 📋 Relatório de Execução de Testes (TEST REPORT) — Gabarito do Professor

> **Nota do Professor:** Este relatório reflete a execução real da suíte inicial de testes no ambiente Node.js do laboratório, documentando as métricas obtidas antes da aplicação da correção do BUG-001.

---

## 1. Identificação do Projeto

| Campo | Informação |
| :--- | :--- |
| **Projeto** | API de Gerenciamento de Pedidos (Aula 12) |
| **Módulo** | Testes de Back-End — Do Bug à Evidência |
| **Instituição** | SENAI Canoas — Programador Full-Stack |
| **Data e Hora da Execução** | 14/10/2026 11:57 |
| **Responsável pela Execução** | Equipe de QA / Professor do SENAI |
| **Versão do Código / Branch** | `v1.0.0-inicial` |
| **Ambiente de Teste** | Windows 11 x64 (Ambiente Local) |
| **Versão do Node.js** | `v24.11.1` |
| **Versão do Jest** | `v29.7.0` |
| **Comando Executado** | `npm test` e `npm run test:coverage` |

---

## 2. Resumo da Execução da Suíte de Testes

| Métrica | Quantidade | Percentual (%) |
| :--- | :--- | :--- |
| **Total de Testes (Total Tests)** | 19 | 100% |
| **Testes Aprovados (Passed)** | 17 | 89.47% |
| **Testes Falhos (Failed)** | 2 | 10.53% |
| **Testes Ignorados (Skipped/Todo)** | 0 | 0.00% |
| **Tempo Total de Execução (Time)** | 1.191 s | - |

---

## 3. Cobertura de Código (Code Coverage)

> Dados reais extraídos do relatório de cobertura do Jest (`npm run test:coverage`):

| Arquivo / Componente | % Statements | % Branches | % Functions | % Lines | Linhas Não Cobertas |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `src/app.js` | 100.0% | 100.0% | 100.0% | 100.0% | - |
| `src/controllers/pedido.controller.js` | 100.0% | 100.0% | 100.0% | 100.0% | - |
| `src/middlewares/error.middleware.js` | 100.0% | 100.0% | 100.0% | 100.0% | - |
| `src/repositories/pedido.repository.js` | 86.66% | 75.00% | 71.42% | 92.30% | Linha 44 |
| `src/services/pedido.service.js` | 100.0% | 100.0% | 100.0% | 100.0% | - |
| **MÉDIA GERAL (All files)** | **97.10%** | **96.15%** | **87.50%** | **98.50%** | - |

---

## 4. Detalhamento das Falhas Encontradas

| Suíte de Teste | Nome do Teste com Falha | Erro Observado no Jest | Possível Causa |
| :--- | :--- | :--- | :--- |
| `tests/pedido.service.test.js` | `5. [BUG-001] Deve rejeitar quantidade negativa...` | `Received promise resolved instead of rejected. Resolved to: {"id": 1, "quantidade": -2, "total": -160}` | Validação em `pedido.service.js` não verifica valores negativos (`< 0`). |
| `tests/pedido.api.test.js` | `5. [BUG-001] Deve retornar HTTP 400 ao enviar...` | `Expected: 400, Received: 201` | O endpoint aceita o payload e cadastra pedido inválido com quantidade negativa. |

---

## 5. Resultado Geral e Parecer Técnico

- **Status da Suíte:** `( ) APROVADO TOTAL  (X) REPROVADO (FALHAS DETECTADAS)`
- **Parecer Técnico:**
  > A suíte de testes identificou uma grave não-conformidade funcional no cadastro de pedidos. A API falhou ao validar quantidades negativas, violando a regra de negócio central ("A quantidade deve ser um número inteiro maior que zero"). O teste de integração comprovou que pedidos são cadastrados com quantidade e total negativos no banco em memória. Recomenda-se a abertura imediata de relatório de defeito (BUG-001).

---

## 6. Referência às Evidências

- Arquivo de log da execução com falha: [`evidencias/teste-falhando.txt`](../evidencias/teste-falhando.txt)
- Relatório de cobertura antes da correção: [`evidencias/cobertura-antes.txt`](../evidencias/cobertura-antes.txt)
- Resposta HTTP da anomalia: [`evidencias/resposta-api-bug.json`](../evidencias/resposta-api-bug.json)
