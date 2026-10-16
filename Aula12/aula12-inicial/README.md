# 🧪 Laboratório Prático da Aula 12 — Do Bug à Evidência: Documentação de Testes no Back-End
## Curso de Programador Full-Stack — SENAI Canoas

Seja bem-vindo ao laboratório da **Aula 12**! Neste projeto prático, você vivenciará o fluxo profissional completo de um Engenheiro de Qualidade de Software (QA) e Desenvolvedor Back-End:

$$\text{Executar Testes} \longrightarrow \text{Identificar Falha} \longrightarrow \text{Documentar Bug} \longrightarrow \text{Corrigir Código} \longrightarrow \text{Executar Regressão} \longrightarrow \text{Registrar Evidências}$$

---

## 🎯 O Cenário: API REST de Pedidos

Você está recebendo uma API REST desenvolvida em Node.js e Express para gerenciamento de pedidos de vendas. O sistema possui persistência em memória (in-memory repository) e expõe dois endpoints principais:

* `POST /pedidos` — Cadastra um novo pedido de compra.
* `GET /pedidos/:id` — Consulta os dados de um pedido existente pelo ID.

### Exemplo de Payload de Entrada (`POST /pedidos`):
```json
{
  "produto": "Notebook Dell G7",
  "quantidade": 2,
  "valor": 2500
}
```

### Regras de Negócio Estabelecidas:
1. **Produto:** Deve ser uma string válida e não vazia.
2. **Quantidade:** Deve ser um número inteiro estritamente maior que zero ($> 0$).
3. **Valor:** Deve ser um número maior que zero ($> 0$).
4. **Cadastro:** Um pedido válido deve retornar status **HTTP 201 (Created)** com os dados cadastrados.
5. **Consulta Inexistente:** Um pedido não encontrado deve retornar status **HTTP 404 (Not Found)**.
6. **Dados Inválidos:** Qualquer violação de validação deve retornar status **HTTP 400 (Bad Request)** com mensagem amigável.
7. **Erros Inesperados:** Falhas internas do servidor devem retornar **HTTP 500 (Internal Server Error)** sem vazar stack trace ou detalhes técnicos ao cliente.

---

## 📂 Estrutura do Projeto Explicada

```text
aula12-inicial/
├── src/
│   ├── app.js                          # Configuração da aplicação Express e registro de rotas
│   ├── server.js                       # Ponto de entrada do servidor (escuta na porta 3000)
│   ├── controllers/
│   │   └── pedido.controller.js        # Recebe requisições HTTP e invoca o service
│   ├── services/
│   │   └── pedido.service.js           # Camada de regras de negócio e validações (CONTÉM O BUG-001)
│   ├── repositories/
│   │   └── pedido.repository.js        # Armazenamento em memória dos pedidos (com método limpar())
│   └── middlewares/
│       └── error.middleware.js         # Interceptador global de exceções (retornos 400, 404 e 500)
├── tests/
│   ├── pedido.service.test.js          # Testes unitários do Service com Jest
│   └── pedido.api.test.js              # Testes de integração de rotas com Supertest
├── docs/
│   ├── TEST_REPORT.md                  # Modelo do relatório de execução da suíte
│   ├── BUG_REPORT.md                   # Modelo do relatório de defeito do BUG-001
│   └── FIX_REPORT.md                   # Modelo do relatório de correção e regressão
├── evidencias/
│   └── README.md                       # Orientações sobre captura e armazenamento de evidências
├── scripts/
│   └── evidencia.js                    # Script para gravação automatizada de evidências com cabeçalho QA
├── requisicoes.http                    # Arquivo de testes exploratórios (CT-01 a CT-06) para REST Client
├── package.json                        # Gerenciador de dependências e scripts de execução
├── jest.config.js                      # Configuração do ambiente de testes e métricas de cobertura
├── .gitignore                          # Arquivos e diretórios ignorados pelo Git
└── README.md                           # Guia passo a passo do laboratório
```

---

## 🚀 Instalação e Comandos Disponíveis

Abra o terminal integrado do VS Code nesta pasta e execute:

```bash
# 1. Instalar dependências do projeto
npm install
```

### Scripts configurados no `package.json`:

* `npm test`: Executa a suíte de testes do Jest de forma sequencial (`--runInBand`) para evitar concorrência.
* `npm run test:watch`: Executa os testes em modo contínuo, monitorando alterações no código em tempo real.
* `npm run test:coverage`: Executa todos os testes e exibe a tabela detalhada de cobertura de código no terminal, além de gerar o relatório HTML na pasta `coverage/`.
* `npm start`: Inicia o servidor Express na porta 3000.
* `npm run dev`: Inicia o servidor em modo watch (recarrega a cada alteração em versões modernas do Node.js).

---

## ⚠️ AVISO IMPORTANTE: O Defeito Intencional (BUG-001)

> **LEIA COM ATENÇÃO:** Quando você executar `npm test` pela primeira vez, **dois testes irão FALHAR intencionalmente!**
> 
> Isso **NÃO É UM ERRO DE CONFIGURAÇÃO OU AMBIENTE**. É o defeito real inserido no código para este laboratório (denominado **BUG-001**).
> 
> Seu objetivo como estudante de QA e Back-End é investigar essa falha, documentá-la no relatório, corrigir o código e comprovar a solução!

---

## ⏱️ Roteiro do Laboratório Orientado (60 Minutos)

Siga rigorosamente as 6 etapas abaixo com duração estimada de 10 minutos cada:

### 🔹 Etapa 1 — Executar os Testes e Gerar Evidências Iniciais (10 min)
1. Instale as dependências: `npm install`.
2. Execute a suíte de testes e salve o resultado no arquivo de evidências:
   ```powershell
   npm test > evidencias/teste-falhando.txt
   ```
3. Execute a cobertura de código e salve o resultado:
   ```powershell
   npm run test:coverage > evidencias/cobertura-antes.txt
   ```
4. Verifique no terminal quantos testes passaram e quantos falharam.

### 🔹 Etapa 2 — Preencher o `docs/TEST_REPORT.md` (10 min)
1. Abra o arquivo `docs/TEST_REPORT.md` no VS Code.
2. Preencha todos os campos com os dados **reais** obtidos no seu terminal na Etapa 1:
   - Data, horário, versão do Node (`node -v`), versão do Jest (`npx jest -v`).
   - Quantidade de testes aprovados e reprovados.
   - Tabela de cobertura (Statements, Branches, Functions, Lines).
   - Identificação dos 2 testes que falharam.

### 🔹 Etapa 3 — Investigar a Falha e Identificar a Causa Raiz (10 min)
1. Abra os arquivos de teste:
   - `tests/pedido.service.test.js` (linha do teste 5)
   - `tests/pedido.api.test.js` (linha do teste 5)
2. Analise a mensagem de erro do Jest:
   - Esperava-se status `400` com mensagem de erro, mas a API respondeu com `201` e cadastrou o pedido com quantidade negativa!
3. Abra o arquivo `src/services/pedido.service.js` e localize o comentário `TODO: BUG-001`.
4. Observe a expressão condicional:
   ```javascript
   if (!Number.isInteger(quantidade) || quantidade === 0) { ... }
   ```
   *Pense:* O que acontece quando passamos `-2`? `-2` é inteiro? Sim! `-2` é igual a zero? Não! Logo, a validação deixa passar!

### 🔹 Etapa 4 — Documentar o Defeito no `docs/BUG_REPORT.md` (10 min)
1. Abra o arquivo `docs/BUG_REPORT.md`.
2. Preencha o relatório formal de defeito com rigor técnico:
   - Severidade: Alta (permite dados corrompidos no sistema).
   - Prioridade: Alta (afeta regra central de cobrança e estoque).
   - Passos detalhados para reprodução.
   - Resultado esperado vs. Resultado obtido.

### 🔹 Etapa 5 — Corrigir o Código e Executar a Regressão (10 min)
1. Em `src/services/pedido.service.js`, ajuste a validação para que qualquer quantidade menor ou igual a zero seja rejeitada:
   ```javascript
   if (!Number.isInteger(quantidade) || quantidade <= 0) {
     throw new ValidationError('A quantidade deve ser um número inteiro maior que zero.');
   }
   ```
2. Salve o arquivo.
3. Execute novamente os testes automatizados para verificar se a falha sumiu:
   ```powershell
   npm test > evidencias/teste-aprovado.txt
   ```
4. Execute novamente a cobertura:
   ```powershell
   npm run test:coverage > evidencias/cobertura-depois.txt
   ```
5. Comprove no console: **100% dos testes agora devem estar aprovados (verde)!**

### 🔹 Etapa 6 — Finalizar o `docs/FIX_REPORT.md` e Submeter (10 min)
1. Abra o arquivo `docs/FIX_REPORT.md`.
2. Preencha a análise da causa raiz, o diff do código corrigido e a comparação dos testes antes vs. depois.
3. Revise se os 4 arquivos de evidência estão presentes na pasta `evidencias/`.
4. Parabéns! Você concluiu o ciclo profissional de QA!

---

## 📝 Exercícios Adicionais para Fixação (Desafios Opcionais)

1. **Desafio 1 (BVA — Boundary Value Analysis):**
   Adicione um caso de teste em `tests/pedido.service.test.js` testando a quantidade `1` (menor valor válido permitido) e `0` (maior valor inválido não positivo).
2. **Desafio 2 (Sanitização de Dados):**
   Verifique se o cadastro remove espaços em branco antes e depois do nome do produto (ex: `"  Mouse  "` $\rightarrow$ `"Mouse"`). Escreva um teste que confirme esse comportamento.
3. **Desafio 3 (Validação de Tipos):**
   Envie `valor: "mil reais"` (string) para o endpoint `POST /pedidos` e garanta que a API retorne HTTP 400.
