# 🧪 Testes de Back-End — Programador Full-Stack

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-Testing%20Framework-C21325?style=for-the-badge&logo=jest&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-Framework-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-In--Memory-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Supertest](https://img.shields.io/badge/Supertest-HTTP%20Testing-brightgreen?style=for-the-badge)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI%2FCD-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)

<p align="center">
  <b>Repositório prático de estudos e projetos da disciplina de Testes de Back-End.</b><br>
  Abrange desde os fundamentos de testes unitários até testes de integração, persistência, segurança, E2E, CI/CD, técnicas de caixa branca/preta e análise de performance.
</p>

</div>

---

## 📑 Sumário (Índice Geral)

- [🎯 Visão Geral](#-visão-geral)
- [🏛️ A Pirâmide de Testes](#️-a-pirâmide-de-testes)
- [📂 Navegação Rápida pelas Pastas](#-navegação-rápida-pelas-pastas)
- [📖 Detalhamento dos Módulos](#-detalhamento-dos-módulos)
  - [1. Aula 02 — Fundamentos de Testes Unitários e Depuração](#1-aula-02--fundamentos-de-testes-unitários-e-depuração)
  - [2. Aula 03 — Dublês de Teste (Mocks, Stubs e Spies)](#2-aula-03--dublês-de-teste-mocks-stubs-e-spies)
  - [3. Aula 04 — Testes de Integração com NestJS e Supertest](#3-aula-04--testes-de-integração-com-nestjs-e-supertest)
  - [4. Aula 05 — Testes de Persistência com Mongoose e Banco em Memória](#4-aula-05--testes-de-persistência-com-mongoose-e-banco-em-memória)
  - [5. Aula 06 — Testes de Middleware, Autenticação JWT e RBAC](#5-aula-06--testes-de-middleware-autenticação-jwt-e-rbac)
  - [6. Aula 07 — Testes de Sistema (E2E) e Testes de Aceitação](#6-aula-07--testes-de-sistema-e2e-e-testes-de-aceitação)
  - [7. Aula 08 — Automação de Testes, Code Coverage, CI e GitHub Actions](#7-aula-08--automação-de-testes-code-coverage-ci-e-github-actions)
  - [8. Aula 09 — Técnicas de Caixa Branca e Caixa Preta com Jest](#8-aula-09--técnicas-de-caixa-branca-e-caixa-preta-com-jest)
  - [9. Aula 10 — Análise de Cobertura, Thresholds e Performance](#9-aula-10--análise-de-cobertura-thresholds-e-performance)
- [🛠️ Tecnologias e Bibliotecas](#️-tecnologias-e-bibliotecas)
- [🚀 Como Executar o Repositório](#-como-executar-o-repositório)
- [🧬 Conceitos Fundamentais](#-conceitos-fundamentais)
  - [Erro vs. Defeito vs. Falha](#erro-vs-defeito-vs-falha)
  - [Tipos de Dublês de Teste](#tipos-de-dublês-de-teste)
- [✨ Boas Práticas Adotadas](#-boas-práticas-adotadas)

---

## 🎯 Visão Geral

Este repositório reúne o conjunto de práticas desenvolvidas durante o módulo de **Testes de Back-End** do curso **Programador Full-Stack Petrobrás2026/27 (SENAI)**. O objetivo principal é capacitar o desenvolvedor a escrever código resiliente, seguro e de alta qualidade, dominando as diferentes camadas e estratégias de testes automatizados no ecossistema Node.js / TypeScript.

---

## 🏛️ A Pirâmide de Testes

Ao longo das aulas, o repositório caminha por todas as principais camadas da pirâmide de testes de software:

```text
               / \
              /   \        E2E / Sistema & Aceitação (Aula 07: Fluxos completos e Jornadas de Usuário)
             /-----\
            /       \      Integração & Segurança (Aula 04: HTTP/DTO, Aula 05: BD/Mongoose, Aula 06: Auth/RBAC)
           /---------\
          /           \    Unitários, Cobertura & Performance (Aula 02, Aula 03, Aula 08, Aula 09, Aula 10)
         /_____________\
```

---

## 📂 Navegação Rápida pelas Pastas

Clique nos links abaixo para navegar diretamente para a pasta de cada aula no repositório:

| Pasta | Descrição | Foco Principal |
| :--- | :--- | :--- |
| 📁 [**Aula02**](./Aula02) | Fundamentos & Depuração | Sintaxe do Jest, Babel, IEEE 754, Matriz CT-NN (`aula02-inicial` e `aula02-resolvida`). |
| 📁 [**Aula03**](./Aula03) | Mocks e Dublês de Teste | Isolamento de camadas (`jest.mock`, `jest.fn`, `mockResolvedValue`). |
| 📁 [**Aula04**](./Aula04) | Testes de Integração com NestJS | Testes de rotas HTTP com Supertest, validação de DTOs e Pipes. |
| 📁 [**Aula05**](./Aula05) | Persistência com Mongoose | Validação de Schemas, Hooks (pre-save) e `mongodb-memory-server`. |
| 📁 [**Aula06**](./Aula06) | Middlewares & Autenticação | Validação de Token JWT (`401`), Perfis de Acesso RBAC (`403`) e Sanitização. |
| 📁 [**Aula07**](./Aula07) | Testes de Sistema (E2E) | Jornadas ponta a ponta com Express, autenticação e atualização de estoque. |
| 📁 [**Aula08**](./Aula08) | Automação e CI/CD | Code Coverage, relatórios e esteiras automatizadas via GitHub Actions. |
| 📁 [**Aula09**](./Aula09) | Caixa Branca e Caixa Preta | Partição de equivalência, análise de valor limite (BVA) e tabela de decisão. |
| 📁 [**Aula10**](./Aula10) | Cobertura & Performance | Análise de métricas, *thresholds* rigorosos e benchmarking de algoritmos ($O(N)$ vs $O(1)$). |

---

## 📖 Detalhamento dos Módulos

### 1. [Aula 02](./Aula02) — Fundamentos de Testes Unitários e Depuração

Introdução ao framework **Jest**, configuração de transpilador **Babel** para uso de módulos ES6 (`import`/`export`), elaboração de matriz de casos de teste (**CT-NN**), correção de defeitos de borda e tratamento de arredondamento de ponto flutuante (**IEEE 754**).

* **Organização das Versões:**
  * `aula02-inicial/`: Primeiros testes de calculadora, pedidos e usuários com sintaxe básica e asserções do Jest.
  * `aula02-resolvida/`: Casos de teste estruturados (CT-NN), correção de defeito de borda em frequências (`< 75%`), cálculo de boletim escolar e tratativa para ponto flutuante (`0.1 + 0.2`).
* **Documentação:** [Aula02/README.md](./Aula02/README.md).
* **Comandos rápidos:**
  ```bash
  # Versão inicial
  cd Aula02/aula02-inicial && npm install && npm test

  # Versão resolvida
  cd Aula02/aula02-resolvida && npm install && npm test
  ```

---

### 2. [Aula 03](./Aula03) — Dublês de Teste (Mocks, Stubs e Spies)

Ensina a testar a regra de negócio da aplicação (**Service layer**) sem depender de serviços externos reais, rede ou banco de dados MongoDB em execução.

* **Conceitos explorados:**
  * **Test Doubles:** Stub, Spy, Mock e Fake.
  * Funções utilitárias do Jest: `jest.mock()`, `jest.fn()`, `mockResolvedValue()`, `toHaveBeenCalledWith()`.
  * **O Ciclo de 4 Passos do Teste:** Mock $\rightarrow$ Stubbing $\rightarrow$ Execução $\rightarrow$ Verificação.
* **Arquivos-chave:**
  * `src/usuarios.repository.js`: Simulação da camada de persistência.
  * `src/usuarios.service.js`: Lógica de cadastro e busca com regras de negócio.
  * `src/usuarios.service.test.js`: Testes unitários isolados com mocks.
* **Documentação:** [Aula03/README.md](./Aula03/README.md).
* **Comandos rápidos:**
  ```bash
  cd Aula03
  npm install
  npm test
  npm run test:watch
  ```

---

### 3. [Aula 04](./Aula04) — Testes de Integração com NestJS e Supertest

Foco em testar como os componentes reais da aplicação conversam entre si (Controller + Service + Repository + Pipes de Validação), simulando requisições HTTP reais sem subir portas externas.

* **Conceitos explorados:**
  * Uso de `Test.createTestingModule` para compilar módulos completos em memória.
  * Requisições HTTP com **Supertest** (`POST`, `GET`).
  * Validações globais com `ValidationPipe` e `ParseIntPipe`.
  * Detecção de inconsistências de interface/contrato entre camadas.
* **Documentação:** [Aula04/README.md](./Aula04/README.md).
* **Comandos rápidos:**
  ```bash
  cd Aula04
  npm install
  npm run test:unit  # Executa testes unitários
  npm run test:int   # Executa testes de integração com Supertest
  npm test           # Executa toda a suíte
  ```

---

### 4. [Aula 05](./Aula05) — Testes de Persistência com Mongoose e Banco em Memória

Foco na validação da última linha de defesa da aplicação: o **Schema e Model do Mongoose** conectado a um banco MongoDB real em memória via `mongodb-memory-server`.

* **Regras validadas:**
  * Campos obrigatórios (`required: true`).
  * Validações numéricas mínimas (`min: 0`).
  * Restrições de domínio com listas enumeradas (`enum: [...]`).
  * Hooks/Middlewares de ciclo de vida (`pre('save')`).
  * Chaves únicas e índices (`unique: true` / erro `code: 11000`).
* **Ciclo de vida dos testes:**
  * `beforeAll()`: Sobe a instância do MongoDB em memória RAM.
  * `afterEach()`: Limpa a base (`deleteMany({})`) garantindo isolamento total entre os testes.
  * `afterAll()`: Desconecta e finaliza o servidor em memória.
* **Documentação:** [Aula05/README.md](./Aula05/README.md).
* **Comandos rápidos:**
  ```bash
  cd Aula05
  npm install
  npm test
  npm run test:watch
  ```

---

### 5. [Aula 06](./Aula06) — Testes de Middleware, Autenticação JWT e RBAC

Foco em testes de **segurança de APIs REST**, validação de middlewares no Express, autenticação via **JSON Web Token (JWT)** e autorização por perfil (**RBAC - Role-Based Access Control**).

* **Estrutura interna:**
  * `src/middlewares/auth.middleware.js`: Extração e validação do token Bearer, assinatura e expiração (`401 Unauthorized`).
  * `src/middlewares/role.middleware.js`: Controle de permissões por perfil de usuário (`403 Forbidden`).
  * `src/app.js`: Endpoints públicos (`/login`), protegidos (`/usuarios`, `/perfil`) e restritos a administradores (`DELETE /produtos/:id`).
  * `test/auth-middleware.spec.js`: Cobertura completa de fluxos sem token, token inválido, token expirado, perfil insuficiente (`USER` vs `ADMIN`) e não vazamento de senhas.
* **Documentação:** [Aula06/README.md](./Aula06/README.md).
* **Comandos rápidos:**
  ```bash
  cd Aula06
  npm install
  npm test
  npm run test:watch
  ```

---

### 6. [Aula 07](./Aula07) — Testes de Sistema (E2E) e Testes de Aceitação

Testes de ponta a ponta (**End-to-End / E2E**) simulando a jornada completa do cliente: autenticação, consulta de catálogo, aquisição de item e validação da consistência de estoque.

* **Conceitos explorados:**
  * Fluxo integrado com Express, JWT e Supertest.
  * Validação de efeitos colaterais em cascata no sistema.
  * Reset de estado e isolamento para execuções repetíveis.
* **Documentação:** [Aula07/README.md](./Aula07/README.md).
* **Comandos rápidos:**
  ```bash
  cd Aula07
  npm install
  npm test
  ```

---

### 7. [Aula 08](./Aula08) — Automação de Testes, Code Coverage, CI e GitHub Actions

Pilares da **Integração Contínua (CI)**, relatórios de cobertura de código (**Code Coverage**) e automação de pipelines via **GitHub Actions** (`testes.yml`).

* **Conceitos explorados:**
  * Geração e análise de relatórios de cobertura no Jest (`--coverage`).
  * Criação de workflows do GitHub Actions para validação a cada `push` e `pull_request`.
  * Bloqueio de código com falha antes da ida para produção.
* **Documentação:** [Aula08/README.md](./Aula08/README.md).
* **Comandos rápidos:**
  ```bash
  cd Aula08
  npm install
  npm test
  npm run test:coverage
  ```

---

### 8. [Aula 09](./Aula09) — Técnicas de Caixa Branca e Caixa Preta com Jest

Técnicas sistemáticas de seleção de casos de teste para o módulo de concessão e validação de empréstimos bancários.

* **Conceitos explorados:**
  * **Caixa Preta:** Partição de Equivalência, Análise de Valor Limite (BVA) e Tabela de Decisão.
  * **Caixa Branca:** Análise estrutural de branches/caminhos e introdução a Testes de Mutação.
* **Documentação:** [Aula09/README.md](./Aula09/README.md).
* **Comandos rápidos:**
  ```bash
  cd Aula09
  npm install
  npm test
  npm run test:coverage
  ```

---

### 9. [Aula 10](./Aula10) — Análise de Cobertura, Thresholds e Performance

Métricas de qualidade de código, aplicação de **Thresholds** mínimos e análise comparativa de desempenho (**Benchmarking**) entre busca linear $O(N)$ e indexação via `Map` $O(1)$.

* **Organização das Versões:**
  * `aula10-inicial/`: Código com suíte incompleta e busca linear $O(N)$.
  * `aula10-resolvida/`: Cobertura de 100%, thresholds validados e busca otimizada com `Map` $O(1)$ (~120x mais rápida).
* **Documentação:** [Aula10/README.md](./Aula10/README.md).
* **Comandos rápidos:**
  ```bash
  # Versão inicial
  cd Aula10/aula10-inicial && npm install && npm test

  # Versão resolvida
  cd Aula10/aula10-resolvida && npm install && npm test
  npm run benchmark
  ```

---

## 🛠️ Tecnologias e Bibliotecas

| Categoria | Tecnologias Utilizadas |
| :--- | :--- |
| **Linguagens & Runtime** | Node.js (v18+), JavaScript (ES6+ / CommonJS), TypeScript |
| **Frameworks de Teste** | Jest, Supertest |
| **CI/CD & Automação** | GitHub Actions (`.github/workflows/testes.yml`) |
| **Frameworks Web** | Express, NestJS (Common, Core, Testing, Platform-Express) |
| **Segurança & Autenticação** | JSON Web Token (`jsonwebtoken`), RBAC (Role-Based Access Control) |
| **Banco de Dados & ORM/ODM** | MongoDB, Mongoose, mongodb-memory-server |
| **Compilação & Transpilação** | Babel, TypeScript Compiler (`tsc`) |
| **Validação** | class-validator, class-transformer |
| **Performance & Métricas** | Jest Coverage (Statements, Branches, Functions, Lines), `process.hrtime.bigint()` |

---

## 🚀 Como Executar o Repositório

### 1. Clonar o repositório
```bash
git clone https://github.com/EderRosso/Teste-de-Back-end.git
cd Teste-de-Back-end
```

### 2. Executar os testes por aula
Cada pasta ou subpasta de aula é um projeto Node.js independente contendo seu próprio `package.json`:

```bash
# Aula 02 — Fundamentos de Testes Unitários
cd Aula02/aula02-inicial && npm install && npm test && cd ../..
cd Aula02/aula02-resolvida && npm install && npm test && cd ../..

# Aula 03 — Dublês de Teste (Mocks, Stubs e Spies)
cd Aula03 && npm install && npm test && cd ..

# Aula 04 — Testes de Integração com NestJS
cd Aula04 && npm install && npm test && cd ..

# Aula 05 — Testes de Persistência com Mongoose
cd Aula05 && npm install && npm test && cd ..

# Aula 06 — Middlewares, JWT e RBAC
cd Aula06 && npm install && npm test && cd ..

# Aula 07 — Testes de Sistema (E2E)
cd Aula07 && npm install && npm test && cd ..

# Aula 08 — Automação e Code Coverage
cd Aula08 && npm install && npm test && cd ..

# Aula 09 — Caixa Branca e Caixa Preta
cd Aula09 && npm install && npm test && cd ..

# Aula 10 — Cobertura, Thresholds e Performance
cd Aula10/aula10-inicial && npm install && npm test && cd ../..
cd Aula10/aula10-resolvida && npm install && npm test && cd ../..
```

---

## 🧬 Conceitos Fundamentais

### Erro vs. Defeito vs. Falha
* **Erro (Engano Humano):** Ação humana incorreta do programador (ex.: esquecer de tratar uma conversão de tipos ou inverter um operador relacional).
* **Defeito / Bug (No Código):** A anomalia estática presente no código-fonte em decorrência do erro.
* **Falha (Execução):** O comportamento incorreto manifestado dinamicamente durante a execução do software (ex.: status HTTP `404` em vez de `200` ou resultado divergente do esperado).

### Tipos de Dublês de Teste
| Dublê | Finalidade | Exemplo |
| :--- | :--- | :--- |
| **Dummy** | Objeto passado apenas para preencher parâmetros obrigatórios. | Objeto vazio `{}` |
| **Stub** | Retorna dados pré-programados estáticos para chamadas específicas. | `mockResolvedValue({ id: 1, nome: "Ana" })` |
| **Spy** | Espiona e registra chamadas, argumentos e retornos sem alterar comportamento. | `expect(repo.save).toHaveBeenCalledWith(...)` |
| **Mock** | Objeto programado com comportamento e expectativas estritas de validação. | `jest.mock('./repository')` |
| **Fake** | Implementação funcional simplificada para testes. | Banco de dados ou array em memória |

---

## ✨ Boas Práticas Adotadas

1. **Testes Independentes e Determinísticos:** Nenhum teste depende da execução ou do estado deixado por outro teste.
2. **Padrão AAA (Arrange, Act, Assert):**
   * **Arrange (Preparação):** Configuração de dados, mocks e estado inicial.
   * **Act (Ação):** Execução do método ou requisição sob teste.
   * **Assert (Verificação):** Validação dos resultados e das asserções de saída.
3. **Limpeza Adequada de Recursos:** Uso rigoroso de `afterEach` e `afterAll` (`app.close()`, `mongoose.disconnect()`) para evitar vazamentos de memória e conexões abertas no Jest.
4. **Isolamento de Camadas:** Testes unitários para regras puras e testes de integração/persistência para validação de fluxos reais e contratos.
5. **Thresholds & Automação:** Configuração de métricas mínimas de cobertura e validação contínua em CI para evitar regressões.

---

<div align="center">

Desenvolvido para fins de estudo no curso **Programador Full-Stack Petrobrás2026/27 (SENAI)**.  
*Qualidade de software começa com testes bem planejados!*

</div>
