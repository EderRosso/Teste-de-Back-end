// Testes PRONTOS das ferramentas de resiliência (use como modelo).
const { comRetry, comTimeout } = require('../src/resiliencia');

describe('comRetry', () => {
  test('falha 2 vezes e recupera na 3ª tentativa', async () => {
    const operacao = jest.fn()
      .mockRejectedValueOnce(new Error('Timeout'))
      .mockRejectedValueOnce(new Error('Timeout'))
      .mockResolvedValueOnce('ok');

    await expect(comRetry(operacao, 3, 0)).resolves.toBe('ok');
    expect(operacao).toHaveBeenCalledTimes(3);
  });

  test('desiste depois de 3 falhas', async () => {
    const operacao = jest.fn().mockRejectedValue(new Error('Banco fora'));

    await expect(comRetry(operacao, 3, 0)).rejects.toThrow('Banco fora');
    expect(operacao).toHaveBeenCalledTimes(3);
  });
});

describe('comTimeout', () => {
  test('rejeita quando passa do limite', async () => {
    const travada = new Promise(() => {}); // nunca responde
    await expect(comTimeout(travada, 50)).rejects.toThrow('Timeout de 50 ms');
  });

  test('resolve quando responde a tempo', async () => {
    await expect(comTimeout(Promise.resolve('ok'), 50)).resolves.toBe('ok');
  });
});
