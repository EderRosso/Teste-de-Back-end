# 🛠️ Relatório de Correção e Regressão (FIX REPORT)

> **Instruções para o Aluno:** Após identificar a causa raiz do BUG-001 e implementar a correção no arquivo `src/services/pedido.service.js`, execute novamente a suíte completa de testes (`npm test`) e preencha este relatório para registrar a validação da correção.

---

## 1. Identificação da Correção

| Campo | Informação |
| :--- | :--- |
| **ID do Defeito Corrigido** | `BUG-001` |
| **Título da Correção** | `[Preencher: Ex: Ajuste na validação de quantidade mínima no PedidoService]` |
| **Desenvolvedor Responsável** | `[Preencher: Seu Nome Completo]` |
| **Data da Correção** | `[Preencher: DD/MM/AAAA]` |
| **Status Final do Defeito** | `[Resolvido / Fechado / Validado]` |
| **Referência do Commit / Branch** | `[Preencher: ex: fix/BUG-001-quantidade-negativa]` |

---

## 2. Análise da Causa Raiz (Root Cause Analysis)

> **Pergunta:** Por que o defeito acontecia no código?
> 
> `[Preencher: Descreva detalhadamente a lógica incorreta que permitia a passagem de números negativos]`

---

## 3. Detalhes da Alteração Realizada

- **Arquivo Alterado:** `src/services/pedido.service.js`
- **Função / Método Alterado:** `cadastrarPedido({ produto, quantidade, valor })`
- **Linhas Modificadas:** `[Preencher número das linhas]`

### Comparativo de Código (Diff)

```diff
// Trecho no src/services/pedido.service.js
- [Código antes da correção]
+ [Código após a correção]
```

---

## 4. Testes de Regressão Executados

> **O que é um Teste de Regressão?** É a reexecução de testes automatizados para garantir que a correção de um defeito específico não quebrou nenhuma funcionalidade pré-existente no sistema.

| Caso de Teste | Arquivo de Teste | Status Antes | Status Depois |
| :--- | :--- | :--- | :--- |
| `5. [BUG-001] Deve rejeitar quantidade negativa...` | `tests/pedido.service.test.js` | `FALHOU` | `[Preencher: PASSOU]` |
| `5. [BUG-001] Deve retornar HTTP 400 ao enviar...` | `tests/pedido.api.test.js` | `FALHOU` | `[Preencher: PASSOU]` |
| Demais testes da suíte (Happy Path, 404, 500) | Ambas as suítes | `PASSOU` | `[Preencher: PASSOU]` |

---

## 5. Resumo da Execução Pós-Correção

| Métrica | Antes da Correção | Depois da Correção |
| :--- | :--- | :--- |
| **Total de Testes** | `[Preencher]` | `[Preencher]` |
| **Testes Aprovados** | `[Preencher]` | `[Preencher]` |
| **Testes Falhos** | `[Preencher: 2]` | `0 (Zero falhas!)` |
| **Cobertura Geral de Linhas (%)** | `[Preencher %]` | `[Preencher %]` |

---

## 6. Evidências Pós-Correção

- Arquivo com todos os testes passando: `evidencias/teste-aprovado.txt`
- Arquivo com cobertura pós-correção: `evidencias/cobertura-depois.txt`
- Resposta HTTP com status 400 confirmada via Supertest.

---

## 7. Parecer Final e Liberação

- **Aprovação de QA:** `[X] Liberado para Produção / Merge`
- **Observações:** A alteração pontual na cláusula de validação solucionou a não-conformidade sem gerar efeitos colaterais nos demais endpoints da API.
