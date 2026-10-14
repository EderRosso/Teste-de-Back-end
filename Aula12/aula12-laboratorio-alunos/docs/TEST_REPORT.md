# 📋 Relatório de Execução de Testes (TEST REPORT)

> **Instruções para o Aluno:** Execute os comandos `npm test` e `npm run test:coverage` no terminal. Preencha os campos abaixo com os dados REAIS obtidos na sua execução. Não insira valores fictícios.

---

## 1. Identificação do Projeto

| Campo | Informação |
| :--- | :--- |
| **Projeto** | API de Gerenciamento de Pedidos (Aula 12) |
| **Módulo** | Testes de Back-End — Do Bug à Evidência |
| **Instituição** | SENAI Canoas — Programador Full-Stack |
| **Data e Hora da Execução** | `[Preencher: DD/MM/AAAA HH:mm]` |
| **Responsável pela Execução** | `[Preencher: Seu Nome Completo]` |
| **Versão do Código / Branch** | `v1.0.0-inicial` |
| **Ambiente de Teste** | `[Preencher: Windows 11 / Linux / macOS]` |
| **Versão do Node.js** | `[Preencher: Execute node -v]` |
| **Versão do Jest** | `[Preencher: Execute npx jest -v]` |
| **Comando Executado** | `npm test` e `npm run test:coverage` |

---

## 2. Resumo da Execução da Suíte de Testes

| Métrica | Quantidade | Percentual (%) |
| :--- | :--- | :--- |
| **Total de Testes (Total Tests)** | `[Preencher]` | 100% |
| **Testes Aprovados (Passed)** | `[Preencher]` | `[Preencher %]` |
| **Testes Falhos (Failed)** | `[Preencher]` | `[Preencher %]` |
| **Testes Ignorados (Skipped/Todo)** | `[Preencher]` | `[Preencher %]` |
| **Tempo Total de Execução (Time)** | `[Preencher: ex: 1.45 s]` | - |

---

## 3. Cobertura de Código (Code Coverage)

> Registre os dados da tabela gerada pelo comando `npm run test:coverage`:

| Arquivo / Componente | % Statements | % Branches | % Functions | % Lines | Linhas Não Cobertas |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `src/app.js` | `[Preencher]` | `[Preencher]` | `[Preencher]` | `[Preencher]` | `[Preencher]` |
| `src/controllers/pedido.controller.js` | `[Preencher]` | `[Preencher]` | `[Preencher]` | `[Preencher]` | `[Preencher]` |
| `src/middlewares/error.middleware.js` | `[Preencher]` | `[Preencher]` | `[Preencher]` | `[Preencher]` | `[Preencher]` |
| `src/repositories/pedido.repository.js` | `[Preencher]` | `[Preencher]` | `[Preencher]` | `[Preencher]` | `[Preencher]` |
| `src/services/pedido.service.js` | `[Preencher]` | `[Preencher]` | `[Preencher]` | `[Preencher]` | `[Preencher]` |
| **MÉDIA GERAL (All files)** | `[Preencher]` | `[Preencher]` | `[Preencher]` | `[Preencher]` | - |

---

## 4. Detalhamento das Falhas Encontradas

| Suíte de Teste | Nome do Teste com Falha | Erro Observado no Jest | Possível Causa |
| :--- | :--- | :--- | :--- |
| `tests/pedido.service.test.js` | `5. [BUG-001] Deve rejeitar quantidade negativa...` | `[Preencher mensagem do terminal]` | `[Descrever brevemente]` |
| `tests/pedido.api.test.js` | `5. [BUG-001] Deve retornar HTTP 400...` | `[Preencher mensagem do terminal]` | `[Descrever brevemente]` |

---

## 5. Resultado Geral e Parecer Técnico

- **Status da Suíte:** `( ) APROVADO TOTAL  (X) REPROVADO (FALHAS DETECTADAS)`
- **Parecer:**
  > `[Escreva aqui um breve resumo do que a execução comprovou. Exemplo: A suíte detectou uma não-conformidade na regra de validação de quantidade negativa, gerando falhas em testes unitários e de integração.]`

---

## 6. Referência às Evidências

- Arquivo de log da execução com falha: `evidencias/teste-falhando.txt`
- Relatório de cobertura antes da correção: `evidencias/cobertura-antes.txt`
