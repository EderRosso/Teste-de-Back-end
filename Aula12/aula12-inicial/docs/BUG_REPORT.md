# 🐛 Relatório de Defeito de Software (BUG REPORT)

> **Instruções para o Aluno:** Utilize este documento para formalizar o defeito identificado durante a execução dos testes automatizados (BUG-001). Preencha cada seção com clareza e precisão técnica.

---

## 1. Identificação do Defeito

| Campo | Informação |
| :--- | :--- |
| **ID do Bug** | `BUG-001` |
| **Título** | `[Preencher: Título conciso, ex: API aceita indevidamente quantidade negativa no cadastro de pedidos]` |
| **Data de Abertura** | `[Preencher: DD/MM/AAAA]` |
| **Responsável (Relator)** | `[Preencher: Seu Nome Completo]` |
| **Componente Afetado** | `src/services/pedido.service.js` |
| **Versão / Tag** | `v1.0.0-inicial` |
| **Status** | `[Aberto / Em Análise / Em Correção / Fechado]` |

---

## 2. Classificação de Impacto

| Campo | Valor | Justificativa |
| :--- | :--- | :--- |
| **Severidade** | `[Alta / Média / Baixa / Crítica]` | `[Justifique o impacto técnico e no negócio]` |
| **Prioridade** | `[Alta / Média / Baixa / Urgente]` | `[Justifique a urgência de resolução]` |

> 💡 **Conceito Fundamental de QA — Severidade vs. Prioridade:**
> - **Severidade (Severity):** Mede o grau de impacto técnico e destrutivo que o defeito causa no sistema ou nos dados. (Ex: quebra de regra de negócio, corrupção de estoque, travamento do servidor). Definida pela equipe técnica/QA.
> - **Prioridade (Priority):** Mede a urgência de atendimento sob o ponto de vista do negócio ou cronograma de lançamento. (Ex: um erro de ortografia na logo do cliente tem baixa severidade técnica, mas altíssima prioridade comercial). Definida pelo Product Owner (PO) ou gerência.

---

## 3. Ambiente de Execução

- **Sistema Operacional:** `[Windows 11 / Linux Ubuntu / macOS]`
- **Runtime:** `Node.js vX.X.X`
- **Framework Web:** `Express v4.x`
- **Ferramenta de Testes:** `Jest & Supertest`

---

## 4. Pré-Condições

- Servidor ou aplicação carregada em memória.
- Repositório de pedidos limpo e operacional.

---

## 5. Passos para Reproduzir o Defeito

1. Enviar uma requisição HTTP do tipo `POST` para o endpoint `/pedidos`.
2. Definir o cabeçalho `Content-Type: application/json`.
3. Enviar o seguinte payload contendo quantidade negativa:
   ```json
   {
     "produto": "Mouse Gamer",
     "quantidade": -2,
     "valor": 80
   }
   ```
4. Observar o código de status HTTP e o corpo retornado pelo servidor.

---

## 6. Resultados

### Resultado Esperado (Expected Result)
> A API deve rejeitar o pedido, retornando status **HTTP 400 (Bad Request)** com a mensagem de erro:
> ```json
> {
>   "error": "A quantidade deve ser um número inteiro maior que zero."
> }
> ```

### Resultado Obtido (Actual Result)
> `[Preencher: O que a API retornou no seu teste antes da correção? (Status HTTP e payload recebido)]`

---

## 7. Evidências do Defeito

- Arquivo de saída dos testes: `evidencias/teste-falhando.txt`
- Trecho do código com o defeito:
  ```javascript
  // src/services/pedido.service.js
  if (!Number.isInteger(quantidade) || quantidade === 0) {
    throw new ValidationError('A quantidade deve ser um número inteiro maior que zero.');
  }
  ```
- Explicação do comportamento anômalo:
  > Quando `quantidade` é um número negativo (ex: `-2`), `Number.isInteger(-2)` retorna `true` (logo `!true` é `false`) e `-2 === 0` é `false`. Assim, a condição do `if` avalia para `false` e o código NÃO lança a exceção, aceitando o valor negativo!
