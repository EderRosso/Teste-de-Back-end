const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor de Pedidos rodando em http://localhost:${PORT}`);
  console.log('📖 Rotas disponíveis:');
  console.log(`   POST http://localhost:${PORT}/pedidos`);
  console.log(`   GET  http://localhost:${PORT}/pedidos/:id`);
});
