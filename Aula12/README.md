# 📋 Aula 12 — Documentação de Testes: Do Bug à Evidência
## Curso de Programador Full-Stack — SENAI Canoas

<div align="center">

![Jest](https://img.shields.io/badge/Jest-Testing%20Framework-C21325?style=for-the-badge&logo=jest&logoColor=white)
![Supertest](https://img.shields.io/badge/Supertest-HTTP%20Testing-brightgreen?style=for-the-badge)
![Express](https://img.shields.io/badge/Express-API%20REST-000000?style=for-the-badge&logo=express&logoColor=white)
![QA Documentation](https://img.shields.io/badge/QA-Documentação%20%26%20Evidências-orange?style=for-the-badge)

<p align="center">
  <b>Laboratório Prático de 60 Minutos: Da Identificação da Falha à Emissão das Evidências Técnicas.</b><br>
  Aprenda a executar testes automatizados, interpretar logs do Jest, identificar causas-raiz, redigir Bug Reports e Fix Reports formais e validar regressão com evidências auditáveis.
</p>

</div>

---

## 🎯 Visão Geral da Aula

Em ambientes de engenharia de software profissionais, **um teste que falha é uma oportunidade de melhoria**, mas **uma correção sem documentação e evidências técnicas é uma vulnerabilidade de auditoria**. 

Nesta aula, os alunos vivenciam o fluxo completo de QA e desenvolvimento Back-End:

```text
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Executar Testes │ ──> │ Interpretar Log  │ ──> │ Documentar Bug  │
│  (npm test)     │     │ (Expected vs Rcv)│     │ (BUG_REPORT.md) │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                           │
┌─────────────────┐     ┌──────────────────┐               │
│ Registrar       │ <── │ Executar         │ <── Corrigir Código
│ Evidências      │     │ Regressão        │     (pedido.service.js)
│ (FIX_REPORT.md) │     │ (19/19 Verdes)   │
└─────────────────┘     └──────────────────┘
```

---

## 📂 Recursos Disponíveis nesta Aula

| Recurso | Descrição |
| :--- | :--- |
| 📁 [**aula12-inicial/**](./aula12-inicial/) | Versão inicial do projeto com o defeito intencional (**BUG-001**), testes falhando, arquivo `requisicoes.http`, script de evidências e modelos preenchíveis. |
| 📁 [**aula12-resolvida/**](./aula12-resolvida/) | Aplicação corrigida e funcionando de forma correta, 100% dos testes aprovados, relatórios preenchidos e evidências reais para conferência. |

---

## 🏛️ Cenário e Arquitetura do Projeto

Uma API REST simples e desacoplada em três camadas (Controller, Service, Repository em memória) para gerenciamento de pedidos de compra:

```text
[Cliente / Supertest]
         │
         ▼
[src/controllers/pedido.controller.js] ────> Recebe requisições HTTP (POST, GET)
         │
         ▼
[src/services/pedido.service.js]       ────> Valida regras de negócio (PRODUTO, QUANTIDADE, VALOR)
         │
         ▼
[src/repositories/pedido.repository.js]────> Persistência em memória RAM (com método limpar())
         │
         ▼
[src/middlewares/error.middleware.js]  ────> Tratamento centralizado (400, 404 e 500 sem vazar stack trace)
```

### Endpoints:
* `POST /pedidos`: Cadastra um pedido (`{ produto, quantidade, valor }`). Retorna HTTP 201 com o pedido criado ou HTTP 400 se inválido.
* `GET /pedidos/:id`: Consulta um pedido por ID. Retorna HTTP 200 com os dados ou HTTP 404 se inexistente.

---

## 🐛 O Defeito Intencional (BUG-001)

No projeto inicial dos alunos, o arquivo `src/services/pedido.service.js` contém a validação:

```javascript
// BUG-001: Valida se é inteiro e se é zero, mas permite números negativos!
if (!Number.isInteger(quantidade) || quantidade === 0) {
  throw new ValidationError('A quantidade deve ser um número inteiro maior que zero.');
}
```

* **Comportamento Incorreto Inicial:** Ao enviar `quantidade: -2`, a API aceita a requisição, calcula `total: -160` e responde com **HTTP 201 Created**.
* **Comportamento Esperado:** A API deve recusar o payload e retornar **HTTP 400 Bad Request**.
* **Correção:** Alterar a condição para `if (!Number.isInteger(quantidade) || quantidade <= 0)`.

---

## 📑 Os 3 Documentos Oficiais de QA

Durante os 60 minutos de aula, os alunos produzem três artefatos formais de documentação:

1. **`docs/TEST_REPORT.md` (Relatório de Execução):**
   - Registra as métricas reais obtidas antes de qualquer alteração: ambiente, total de testes (19), aprovados (17), reprovados (2) e tabela de cobertura (Statements, Branches, Functions, Lines).
2. **`docs/BUG_REPORT.md` (Relatório de Defeito):**
   - Formaliza o BUG-001, diferenciando **Severidade** (gravidade técnica no banco/cálculo) de **Prioridade** (urgência para o negócio).
   - Especifica pré-condições, passos de reprodução, esperado vs obtido e anexos.
3. **`docs/FIX_REPORT.md` (Relatório de Correção e Regressão):**
   - Registra a análise de causa raiz, o diff formal do código modificado, os resultados dos testes de regressão antes vs depois (19/19 aprovados) e o parecer final de liberação técnica.

---

## 📁 Evidências Técnicas Reais

Na pasta `evidencias/`, os alunos aprendem a capturar saídas autênticas do console:

```text
evidencias/
├── teste-falhando.txt         # Saída do Jest demonstrando as 2 falhas provocadas pelo bug
├── cobertura-antes.txt        # Tabela de cobertura antes da correção
├── teste-aprovado.txt         # Saída do Jest com 100% dos testes verdes após a correção
├── cobertura-depois.txt       # Tabela de cobertura após a correção
├── resposta-api-bug.json      # Payload aceito com status 201 e total negativo
├── resposta-api-corrigida.json# Resposta correta com status 400
└── README.md                  # Manual de geração de evidências
```

---

## 📊 Rubrica de Avaliação (10 Pontos)

| Critério | Peso |
| :--- | :---: |
| Execução e interpretação técnica dos testes no terminal | 2,0 pts |
| Preenchimento do `TEST_REPORT.md` com dados reais | 2,0 pts |
| Redação técnica do `BUG_REPORT.md` (Severidade vs Prioridade) | 2,0 pts |
| Correção precisa do defeito no `pedido.service.js` | 2,0 pts |
| Preenchimento do `FIX_REPORT.md` e geração das evidências | 2,0 pts |
| **Total** | **10,0 pts** |
