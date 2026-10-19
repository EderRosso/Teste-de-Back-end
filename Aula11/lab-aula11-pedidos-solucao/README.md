# Laboratório — Aula 11: Tratamento de Exceções e Resiliência (SOLUÇÃO DO PROFESSOR)

> Versão resolvida. **Não entregar aos alunos.** `npm test` → 18 testes passam (3 suítes).

API de pedidos com um **Service que não trata as falhas** e uma **resposta HTTP insegura**.
Sua missão: usar os testes para guiar a refatoração até o sistema responder com o código HTTP certo,
sem vazar detalhes internos e se recuperando de falhas passageiras.

## Preparação

```bash
npm install
npm test          # ponto de partida: 5 testes falham, 6 passam (11 no total)
npm run simular   # veja como a API responde ANTES da refatoração
```

## Estrutura

| Arquivo | Papel | Mexer? |
|---|---|---|
| `src/erros.js` | `ErroHttp(status, mensagem)` | não |
| `src/pedidoRepository.js` | Repository simulado (pedidos em memória) | não |
| `src/resiliencia.js` | `comRetry` e `comTimeout` prontos | não |
| `src/pedidoService.js` | regras de negócio — **versão ingênua** | **sim** |
| `src/respostaHttp.js` | converte erro em resposta — **versão insegura** | **sim** |
| `tests/*.test.js` | testes (alguns prontos, outros `TODO`) | **sim** |

Nos testes, o Service recebe um **repositório simulado com `jest.fn()`** (função `criarRepoMock`).
Assim, cada teste escolhe se o "banco" responde, devolve `null`, falha ou trava.

## Exercícios (siga a ordem)

1. **Validação (400).** Rode `npm test`. Faça os testes de `criarPedido` (quantidade zero, sem cliente) ficarem verdes usando `throw new ErroHttp(400, ...)`.
2. **Não encontrado (404) e duplicado (409).** Faça o teste do 404 passar. Escreva o teste do 409 (pedido repetido) e confira que `salvar` **não** é chamado.
3. **Falha técnica (503).** Escreva o teste com `mockRejectedValue`. O Service deve responder 503 **sem** repassar a mensagem `ECONNREFUSED`.
4. **Retry só na leitura.** Escreva os testes com `mockRejectedValueOnce` + `mockResolvedValueOnce` (recupera na 2ª tentativa) e com falha permanente (3 tentativas). Use `comRetry` em `buscarPedido`. Em `criarPedido`, prove com um teste que `salvar` é chamado **uma vez só**.
5. **Resposta HTTP segura.** Faça os testes de `respostaHttp` passarem: status correto, sem `stack`, sem mensagem técnica, com `idRastreio`. Escreva o teste do log.
6. **Desafio — Timeout.** Escreva o teste do banco travado (`new Promise(() => {})`). Sem timeout, o teste estoura o limite de 5 s do Jest. Use `comTimeout` e veja o 503.

No fim, rode `npm run simular` de novo e compare com o início.

## Registro

| Situação (`npm run simular`) | Antes | Depois |
|---|---|---|
| POST pedido 1 de novo | | |
| POST quantidade 0 | | |
| GET pedido 99 | | |
| GET pedido 1 (banco fora do ar) | | |
| `npm test` (passaram / total) | | |

**Pergunta final:** por que `buscarPedido` pode usar Retry e `criarPedido` não?
