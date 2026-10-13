/**
 * Hierarquia de Classes de Exceção Customizadas
 * 
 * Permite categorizar os tipos de erro da aplicação para
 * tratamento semântico e assertivo.
 */

class ErroNegocio extends Error {
  constructor(mensagem, statusHttp = 400) {
    super(mensagem);
    this.name = 'ErroNegocio';
    this.statusHttp = statusHttp;
  }
}

class ErroNaoEncontrado extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'ErroNaoEncontrado';
    this.statusHttp = 404;
  }
}

class FalhaTransitoria extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'FalhaTransitoria';
    this.statusHttp = 503;
  }
}

class ErroTecnico extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'ErroTecnico';
    this.statusHttp = 500;
  }
}

module.exports = {
  ErroNegocio,
  ErroNaoEncontrado,
  FalhaTransitoria,
  ErroTecnico
};
