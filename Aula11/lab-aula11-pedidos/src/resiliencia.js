// Ferramentas de resiliência (PRONTAS — use no Service, não precisa alterar).

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Retry: executa a operação; se falhar, tenta de novo (até "tentativas" vezes).
async function comRetry(operacao, tentativas = 3, esperaMs = 200) {
  for (let i = 1; i <= tentativas; i++) {
    try {
      return await operacao();
    } catch (erro) {
      if (i === tentativas) throw erro; // acabaram as tentativas
      await esperar(esperaMs);
    }
  }
}

// Timeout: se a promessa não terminar em "ms" milissegundos, rejeita.
function comTimeout(promessa, ms) {
  let timer;
  const limite = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Timeout de ${ms} ms`)), ms);
  });
  return Promise.race([promessa, limite]).finally(() => clearTimeout(timer));
}

module.exports = { comRetry, comTimeout };
