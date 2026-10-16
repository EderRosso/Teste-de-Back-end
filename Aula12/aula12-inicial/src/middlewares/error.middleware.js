/**
 * Middleware centralizado de tratamento de erros do Express.
 * Garante respostas HTTP padronizadas e protege contra vazamento de detalhes técnicos internos.
 */
function errorMiddleware(err, req, res, next) {
  // Erros operacionais/de negócio conhecidos (400, 404, etc.)
  if (err.status && typeof err.status === 'number') {
    return res.status(err.status).json({
      error: err.message
    });
  }

  // Erros inesperados de infraestrutura ou bugs não tratados (HTTP 500)
  // REGRA DE SEGURANÇA: Não expor stack traces ou detalhes do banco/servidor ao cliente
  return res.status(500).json({
    error: 'Erro interno do servidor'
  });
}

module.exports = errorMiddleware;
