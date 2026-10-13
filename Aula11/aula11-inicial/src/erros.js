/**
 * Hierarquia de Classes de Exceção Customizadas
 * 
 * Permite tipar as falhas da aplicação e mapeá-las de forma
 * padronizada e semântica na camada HTTP.
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
