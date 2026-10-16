# 📁 Diretório de Evidências de Teste (Test Evidences)

Em Engenharia de Qualidade de Software (QA) e Auditoria de Sistemas, **uma afirmação sem evidência técnica não tem validade**. As evidências comprovam que um defeito realmente existia, mostram o comportamento exato do sistema no momento da falha e garantem que a correção foi efetiva sem regressão.

---

## 📌 Padrão de Nomenclatura dos Arquivos de Evidência

Neste laboratório, você deve salvar suas evidências reais neste diretório utilizando a seguinte convenção:

| Arquivo de Evidência | Etapa | Descrição / Conteúdo |
| :--- | :--- | :--- |
| `teste-falhando.txt` | Etapa 1 | Saída completa do comando `npm test` antes de corrigir o código, mostrando o teste falhando no Jest. |
| `cobertura-antes.txt` | Etapa 1 | Tabela de cobertura gerada por `npm run test:coverage` antes da correção. |
| `teste-aprovado.txt` | Etapa 5 | Saída completa de `npm test` após a correção, mostrando todos os testes passando em verde. |
| `cobertura-depois.txt` | Etapa 5 | Tabela de cobertura gerada por `npm run test:coverage` após a correção do defeito. |

---

## 💻 Como Gerar os Arquivos de Evidência pelo Terminal

### Opção A: Redirecionando a saída diretamente no terminal (PowerShell ou Bash)

No terminal do VS Code, dentro da pasta do projeto, execute:

```powershell
# 1. Salvar evidência da execução com falha (antes de corrigir):
npm test > evidencias/teste-falhando.txt

# 2. Salvar evidência da cobertura inicial:
npm run test:coverage > evidencias/cobertura-antes.txt

# 3. Após aplicar a correção no código, salvar a execução aprovada:
npm test > evidencias/teste-aprovado.txt

# 4. Salvar evidência da cobertura final:
npm run test:coverage > evidencias/cobertura-depois.txt
```

### Opção B: Copiar e colar a saída do terminal

1. Execute o comando no terminal do VS Code (`npm test` ou `npm run test:coverage`).
2. Selecione o texto impresso no console com o mouse.
3. Copie (`Ctrl + C`).
4. Crie o arquivo correspondente dentro desta pasta `evidencias/` e cole o conteúdo (`Ctrl + V`).

---

## 🔍 O Que Constitui Uma Boa Evidência de QA?

1. **Reprodutibilidade:** Contém os comandos exatos e parâmetros utilizados.
2. **Carimbo de Data/Hora e Ambiente:** Informa em qual versão e sistema ocorreu.
3. **Traceabilidade:** Permite correlacionar o log de erro diretamente com a linha de código afetada.
4. **Imparcialidade:** Não é um texto inventado, mas sim a saída real gerada pelo interpretador/ferramenta.
