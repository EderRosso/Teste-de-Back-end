# 🛠️ Relatório de Correção e Regressão (FIX REPORT) — BUG-001

---

## 1. Identificação da Correção

| Campo | Informação |
| :--- | :--- |
| **ID do Defeito Corrigido** | `BUG-001` |
| **Título da Correção** | Ajuste na validação de limite mínimo para quantidade de itens no pedido |
| **Desenvolvedor / QA Responsável** | Equipe de Engenharia de Software / Professor SENAI |
| **Data da Correção** | 14/10/2026 |
| **Status Final do Defeito** | **Resolvido e Validado (Fechado)** |
| **Referência do Commit / Branch** | `fix/BUG-001-validacao-quantidade-negativa` |

---

## 2. Análise da Causa Raiz (Root Cause Analysis)

A validação em `src/services/pedido.service.js` utilizava a seguinte expressão:
```javascript
if (!Number.isInteger(quantidade) || quantidade === 0)
```
Essa lógica verificava apenas a igualdade estrita com zero (`quantidade === 0`). Para qualquer número inteiro negativo ($x < 0$), `Number.isInteger(x)` retorna `true` e `x === 0` retorna `false`. Portanto, a negação `!Number.isInteger(x)` resultava em `false` e a expressão inteira avaliava como `false`, permitindo que quantidades negativas contornassem a validação.

---

## 3. Detalhes da Alteração Realizada

- **Arquivo Alterado:** `src/services/pedido.service.js`
- **Método Alterado:** `cadastrarPedido({ produto, quantidade, valor })`
- **Linha:** ~48

### Comparativo de Código (Diff)

```diff
  // src/services/pedido.service.js
- if (!Number.isInteger(quantidade) || quantidade === 0) {
+ if (!Number.isInteger(quantidade) || quantidade <= 0) {
    throw new ValidationError('A quantidade deve ser um número inteiro maior que zero.');
  }
```

Ao substituir `quantidade === 0` por `quantidade <= 0`, qualquer valor menor ou igual a zero é imediatamente capturado e lança `ValidationError` com status HTTP 400.

---

## 4. Testes de Regressão Executados

Foram executados os testes automatizados com o comando `npm test`:

| Caso de Teste | Arquivo de Teste | Status Antes | Status Depois |
| :--- | :--- | :--- | :--- |
| `5. [BUG-001] Deve rejeitar quantidade negativa lançando ValidationError` | `tests/pedido.service.test.js` | ❌ FALHOU | ✅ **PASSOU** (1 ms) |
| `5. [BUG-001] Deve retornar HTTP 400 ao enviar quantidade negativa` | `tests/pedido.api.test.js` | ❌ FALHOU | ✅ **PASSOU** (5 ms) |
| `1. Deve cadastrar um pedido válido com status HTTP 201` | `tests/pedido.api.test.js` | ✅ PASSOU | ✅ **PASSOU** |
| `2. Deve consultar um pedido existente com HTTP 200` | `tests/pedido.api.test.js` | ✅ PASSOU | ✅ **PASSOU** |
| `3. Deve retornar HTTP 404 para pedido inexistente` | `tests/pedido.api.test.js` | ✅ PASSOU | ✅ **PASSOU** |
| `4. Deve retornar HTTP 400 para produto vazio` | `tests/pedido.api.test.js` | ✅ PASSOU | ✅ **PASSOU** |
| `6. Deve retornar HTTP 400 para quantidade zero` | `tests/pedido.api.test.js` | ✅ PASSOU | ✅ **PASSOU** |
| `7. Deve retornar HTTP 400 para valor negativo` | `tests/pedido.api.test.js` | ✅ PASSOU | ✅ **PASSOU** |
| `8. Deve retornar HTTP 400 para valor zero` | `tests/pedido.api.test.js` | ✅ PASSOU | ✅ **PASSOU** |
| `9. Deve retornar HTTP 500 para erro inesperado` | `tests/pedido.api.test.js` | ✅ PASSOU | ✅ **PASSOU** |
| `10. Deve garantir que o estado do repositório é isolado` | `tests/pedido.api.test.js` | ✅ PASSOU | ✅ **PASSOU** |

---

## 5. Resumo da Execução Pós-Correção

| Métrica | Antes da Correção | Depois da Correção |
| :--- | :--- | :--- |
| **Total de Testes** | 19 | 19 |
| **Testes Aprovados** | 17 (89.47%) | **19 (100.0%)** |
| **Testes Falhos** | 2 (10.53%) | **0 (0.0%)** |
| **Suítes Falhas** | 2 de 2 | **0 de 2 (Todas Aprovadas)** |
| **Cobertura de Linhas (%)** | 98.50% | 98.50% |

---

## 6. Evidências Pós-Correção

- **Saída do Terminal (Todos os Testes Verdes):** [`evidencias/teste-aprovado.txt`](../evidencias/teste-aprovado.txt)
- **Tabela de Cobertura Pós-Correção:** [`evidencias/cobertura-depois.txt`](../evidencias/cobertura-depois.txt)
- **Resposta HTTP Corrigida:** [`evidencias/resposta-api-corrigida.json`](../evidencias/resposta-api-corrigida.json)

---

## 7. Parecer Final e Liberação Técnica

- **Aprovação de QA:** `[X] Liberado com Sucesso`
- **Parecer:** A correção do operador relacional eliminou o BUG-001 sem gerar regressão em nenhuma das rotas existentes. Os testes de integração comprovaram que a API agora retorna consistentemente o código HTTP 400 diante de payloads com quantidade inválida.
