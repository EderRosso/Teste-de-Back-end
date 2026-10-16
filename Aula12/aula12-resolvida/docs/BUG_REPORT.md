# 🐛 Relatório de Defeito de Software (BUG REPORT) — BUG-001

---

## 1. Identificação do Defeito

| Campo | Informação |
| :--- | :--- |
| **ID do Bug** | `BUG-001` |
| **Título** | API aceita indevidamente cadastro de pedidos com quantidade negativa |
| **Data de Abertura** | 14/10/2026 |
| **Responsável (Relator)** | Equipe de QA / Professor do SENAI |
| **Componente Afetado** | `src/services/pedido.service.js` |
| **Versão / Tag** | `v1.0.0-inicial` |
| **Status** | Aberto (Identificado em Testes Automatizados) |

---

## 2. Classificação de Impacto

| Campo | Valor | Justificativa |
| :--- | :--- | :--- |
| **Severidade** | **Alta** | Permite a persistência de pedidos com valores negativos no total financeiro (`total: -160`), corrompendo a integridade dos dados e gerando inconsistências contábeis e de estoque. |
| **Prioridade** | **Alta** | A rota de criação de pedidos é o núcleo comercial da API. Pedidos com quantidades incorretas impedem a integração com sistemas de logística e faturamento. |

> 💡 **Conceito Fundamental de QA — Severidade vs. Prioridade:**
> - **Severidade (Severity):** Mede a gravidade técnica do impacto no produto. Um defeito que corrompe o banco ou causa crash tem severidade Alta/Crítica.
> - **Prioridade (Priority):** Mede a urgência de atendimento para o negócio/cliente. Um defeito que paralisa o lançamento ou afeta a principal funcionalidade tem prioridade Alta/Urgente.

---

## 3. Ambiente de Execução

- **Sistema Operacional:** Windows 11 x64
- **Runtime:** Node.js v24.11.1
- **Framework Web:** Express v4.21.2
- **Ferramentas de Teste:** Jest v29.7.0 & Supertest v7.0.0

---

## 4. Pré-Condições

- Aplicação Express em execução ou acessível via Supertest.
- Repositório de pedidos operacional.

---

## 5. Passos para Reproduzir o Defeito

1. Enviar uma requisição HTTP do tipo `POST` para o endpoint `/pedidos`.
2. Adicionar o cabeçalho `Content-Type: application/json`.
3. Informar o seguinte corpo JSON contendo uma quantidade negativa:
   ```json
   {
     "produto": "Mouse sem Fio",
     "quantidade": -2,
     "valor": 80
   }
   ```
4. Submeter a requisição e avaliar o código de resposta HTTP e o corpo retornado.

---

## 6. Resultados

### Resultado Esperado (Expected Result)
A API deve recusar o pedido, respondendo com código **HTTP 400 (Bad Request)** e o corpo:
```json
{
  "error": "A quantidade deve ser um número inteiro maior que zero."
}
```

### Resultado Obtido (Actual Result)
A API processou a requisição com sucesso, respondendo com **HTTP 201 (Created)** e persistindo o pedido com total negativo:
```json
{
  "id": 1,
  "produto": "Mouse sem Fio",
  "quantidade": -2,
  "valor": 80,
  "total": -160,
  "criadoEm": "2026-10-14T14:57:43.993Z"
}
```

---

## 7. Evidências do Defeito

- **Log do Terminal (Jest):** Arquivo [`evidencias/teste-falhando.txt`](../evidencias/teste-falhando.txt)
- **Resposta JSON capturada:** Arquivo [`evidencias/resposta-api-bug.json`](../evidencias/resposta-api-bug.json)
- **Trecho do Código com o Defeito (`src/services/pedido.service.js`):**
  ```javascript
  if (!Number.isInteger(quantidade) || quantidade === 0) {
    throw new ValidationError('A quantidade deve ser um número inteiro maior que zero.');
  }
  ```
- **Explicação Técnica da Causa Raiz:**
  O operador `|| quantidade === 0` valida exclusivamente se o número é exatamente zero. Quando um valor negativo como `-2` é fornecido:
  1. `Number.isInteger(-2)` avalia para `true` $\rightarrow$ `!true` é `false`.
  2. `-2 === 0` avalia para `false`.
  3. `false || false` resulta em `false`.
  4. O bloco `if` não é executado e o valor negativo passa sem validação!
