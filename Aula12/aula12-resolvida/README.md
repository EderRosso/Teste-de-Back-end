# 🧪 Laboratório Prático da Aula 12 — Aplicação Resolvida (Referência Completa)
## Curso de Programador Full-Stack — SENAI Canoas

Este diretório contém a **versão resolvida** do laboratório prático da Aula 12 (**Do Bug à Evidência: Documentação de Testes no Back-End**), permitindo que os alunos confiram a aplicação funcionando de forma correta, comparem os relatórios de QA e respondam aos exercícios propostos para a entrega.

---

## 🎯 O que esta Solução Contém

1. **Código-fonte totalmente corrigido:**
   - Em `src/services/pedido.service.js`, a validação de quantidade foi ajustada de `quantidade === 0` para `quantidade <= 0`.
2. **Suíte de Testes 100% Aprovada:**
   - 19 testes executados (Jest unitário + Supertest de integração).
   - 0 falhas, 0 testes pendentes.
3. **Documentação de Testes Completa:**
   - `docs/TEST_REPORT.md`: Relatório de execução preenchido com dados reais da suíte inicial.
   - `docs/BUG_REPORT.md`: Formalização profissional do defeito BUG-001 com diferenciação entre severidade e prioridade.
   - `docs/FIX_REPORT.md`: Análise de causa raiz, diff da alteração e validação de regressão.
4. **Evidências Reais de Execução:**
   - `evidencias/teste-falhando.txt`: Log do Jest com as 2 falhas provocadas pelo bug.
   - `evidencias/cobertura-antes.txt`: Cobertura pré-correção.
   - `evidencias/teste-aprovado.txt`: Log do Jest com 100% dos testes verdes.
   - `evidencias/cobertura-depois.txt`: Cobertura pós-correção (98.5% de linhas).
   - `evidencias/resposta-api-bug.json`: Payload anômalo aceito com total negativo.
   - `evidencias/resposta-api-corrigida.json`: Resposta correta com HTTP 400.

---

## 🚀 Como Executar a Solução

```bash
# Instalar dependências
npm install

# Executar todos os testes (todos devem passar)
npm test

# Executar cobertura de código
npm run test:coverage

# Subir a API no servidor local
npm start
```

---

## 🔍 Análise Didática da Causa Raiz e da Correção

### O Código com Defeito (Versão Inicial dos Alunos):
```javascript
// src/services/pedido.service.js
if (!Number.isInteger(quantidade) || quantidade === 0) {
  throw new ValidationError('A quantidade deve ser um número inteiro maior que zero.');
}
```

* **Problema:** O operador relacional verifica estritamente a igualdade com zero. Quando o valor testado é `-2`:
  - `Number.isInteger(-2)` é `true` $\rightarrow$ `!true` é `false`.
  - `-2 === 0` é `false`.
  - `false || false` resulta em `false`.
  - O fluxo prossegue e o pedido com quantidade negativa é aceito e faturado!

### A Correção Aplicada:
```javascript
// src/services/pedido.service.js
if (!Number.isInteger(quantidade) || quantidade <= 0) {
  throw new ValidationError('A quantidade deve ser um número inteiro maior que zero.');
}
```

* **Por que funciona?** O operador `<= 0` abrange tanto o zero quanto todos os inteiros negativos no conjunto dos números reais ($\le 0$), garantindo que somente números estritamente positivos ($> 0$) sejam aceitos.

---

## 💡 Gabarito dos Exercícios Adicionais

### Desafio 1: Análise de Valor Limite (BVA)
```javascript
// tests/pedido.service.test.js
test('BVA: Deve aceitar quantidade = 1 (limite inferior válido)', async () => {
  const pedido = await pedidoService.cadastrarPedido({
    produto: 'Item Teste',
    quantidade: 1,
    valor: 10
  });
  expect(pedido.quantidade).toBe(1);
});

test('BVA: Deve rejeitar quantidade = 0 (limite superior inválido)', async () => {
  await expect(
    pedidoService.cadastrarPedido({
      produto: 'Item Teste',
      quantidade: 0,
      valor: 10
    })
  ).rejects.toThrow('A quantidade deve ser um número inteiro maior que zero.');
});
```

### Desafio 2: Sanitização de Nome de Produto
```javascript
// tests/pedido.service.test.js
test('Sanitização: Deve remover espaços em branco nas extremidades do produto', async () => {
  const pedido = await pedidoService.cadastrarPedido({
    produto: '   Mouse Gamer Sem Fio   ',
    quantidade: 1,
    valor: 100
  });
  expect(pedido.produto).toBe('Mouse Gamer Sem Fio');
});
```

### Desafio 3: Validação de Tipo de Dados (Strings no Valor)
```javascript
// tests/pedido.api.test.js
test('Validação de Tipo: Deve rejeitar valor enviado como texto', async () => {
  const response = await request(app)
    .post('/pedidos')
    .send({
      produto: 'Monitor',
      quantidade: 1,
      valor: 'mil reais'
    });
  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    error: 'O valor deve ser um número maior que zero.'
  });
});
```
