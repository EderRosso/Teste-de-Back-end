const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Obtém o nome da evidência a partir dos argumentos (ex: 01-inicial, 02-bug-001, 03-regressao)
const rawArg = process.argv.slice(2).find(arg => arg && !arg.startsWith('--')) || '01-inicial';
const nomeEvidencia = rawArg.replace(/\.txt$/, '');

const outputDir = path.join(__dirname, '..', 'evidencias');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputFile = path.join(outputDir, `${nomeEvidencia}.txt`);

console.log(`\n========================================================================`);
console.log(`📸 GERANDO EVIDÊNCIA DE TESTE: ${nomeEvidencia}`);
console.log(`========================================================================\n`);

// Executa Jest com cobertura
const jestCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const result = spawnSync(jestCmd, ['jest', '--coverage', '--runInBand'], {
  encoding: 'utf-8',
  env: { ...process.env, FORCE_COLOR: '0' }
});

const output = (result.stdout || '') + (result.stderr || '');

// Monta o cabeçalho técnico de auditoria
const cabecalho = [
  `================================================================================`,
  `📋 EVIDÊNCIA DE TESTES TÉCNICOS — QA AUDIT TRAIL`,
  `================================================================================`,
  `• Arquivo de Evidência : ${nomeEvidencia}.txt`,
  `• Data e Hora         : ${new Date().toISOString()}`,
  `• Sistema Operacional : ${os.type()} ${os.release()} (${os.arch()})`,
  `• Versão do Node.js   : ${process.version}`,
  `• Framework de Testes : Jest v29.7.0`,
  `================================================================================\n\n`
].join('\n');

const relatorioCompleto = cabecalho + output;

fs.writeFileSync(outputFile, relatorioCompleto, 'utf-8');

// Exibe também no terminal
process.stdout.write(output);
console.log(`\n✅ Evidência gravada com sucesso em: evidencias/${nomeEvidencia}.txt\n`);

if (result.status !== 0 && result.status !== null) {
  process.exitCode = result.status;
}
