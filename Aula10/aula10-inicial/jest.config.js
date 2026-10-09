/**
 * Configuração do Jest para a Aula 10 - Cobertura e Performance
 */
module.exports = {
  // Ambiente de teste Node.js
  testEnvironment: 'node',

  // Diretório onde o Jest salvará o relatório de cobertura
  coverageDirectory: 'coverage',

  // Coletores de cobertura: indica quais arquivos devem ser analisados
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/performance.js' // Ignora o script de benchmark da métrica de cobertura
  ],

  // Formatos dos relatórios de cobertura gerados (terminal em texto, lcov e html navegável)
  coverageReporters: ['text', 'lcov', 'html'],

  // Limiares (Thresholds) de cobertura mínima exigida pelo projeto (80%)
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
