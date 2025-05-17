# Checklist de Testes do Aplicativo As 7 Chaves

Este documento contém uma lista abrangente de testes para validar o funcionamento do aplicativo As 7 Chaves antes da entrega final ao usuário.

## Testes de Instalação

- [ ] Verificar se o instalador DMG é gerado corretamente
- [ ] Testar instalação em macOS Catalina (10.15)
- [ ] Testar instalação em macOS Big Sur (11)
- [ ] Testar instalação em macOS Monterey (12)
- [ ] Testar instalação em macOS Ventura (13)
- [ ] Verificar comportamento do Gatekeeper na primeira execução
- [ ] Confirmar que o ícone do aplicativo aparece corretamente no Dock e Finder

## Testes de Inicialização

- [ ] Verificar inicialização na primeira execução (criação do banco de dados)
- [ ] Verificar inicialização em execuções subsequentes
- [ ] Testar inicialização offline
- [ ] Verificar tempo de carregamento do aplicativo
- [ ] Testar comportamento quando múltiplas instâncias são abertas

## Testes de Funcionalidades Principais

### Gerenciamento de Funis
- [ ] Criar novo funil
- [ ] Editar funil existente
- [ ] Excluir funil
- [ ] Listar todos os funis
- [ ] Filtrar funis por status

### Gerenciamento de Páginas
- [ ] Criar nova página em um funil
- [ ] Editar página existente
- [ ] Excluir página
- [ ] Reordenar páginas dentro de um funil
- [ ] Visualizar página no editor

### Captura de Leads
- [ ] Adicionar lead manualmente
- [ ] Importar leads de arquivo CSV
- [ ] Visualizar lista de leads
- [ ] Filtrar leads por data ou fonte
- [ ] Exportar leads para CSV

### Webhooks
- [ ] Configurar novo webhook
- [ ] Testar webhook configurado
- [ ] Excluir webhook
- [ ] Verificar disparo automático de webhook ao capturar lead

## Testes de Persistência de Dados

- [ ] Verificar se dados são salvos corretamente no banco SQLite
- [ ] Testar backup do banco de dados
- [ ] Testar restauração do banco de dados
- [ ] Verificar comportamento após restauração de backup
- [ ] Testar exportação de dados
- [ ] Testar importação de dados

## Testes de Interface

- [ ] Verificar responsividade em diferentes tamanhos de janela
- [ ] Testar navegação entre telas
- [ ] Verificar formulários e validações
- [ ] Testar feedback visual para operações (loading, sucesso, erro)
- [ ] Verificar acessibilidade (contraste, navegação por teclado)

## Testes de Performance

- [ ] Medir tempo de resposta para operações comuns
- [ ] Testar comportamento com grande volume de dados
- [ ] Verificar uso de memória durante operações intensivas
- [ ] Testar comportamento após uso prolongado

## Testes de Integração

- [ ] Verificar comunicação entre frontend e backend via IPC
- [ ] Testar integração com webhooks externos
- [ ] Verificar comportamento quando webhooks estão indisponíveis
- [ ] Testar integração com sistema de arquivos local

## Testes de Segurança

- [ ] Verificar isolamento de processos
- [ ] Testar proteção do banco de dados
- [ ] Verificar permissões de acesso a arquivos
- [ ] Testar validação de entrada em todos os formulários

## Testes de Recuperação

- [ ] Verificar comportamento após crash do aplicativo
- [ ] Testar recuperação após falha de energia
- [ ] Verificar integridade do banco de dados após recuperação
- [ ] Testar comportamento com banco de dados corrompido

## Notas de Teste

Utilize este espaço para documentar problemas encontrados, soluções aplicadas e observações importantes durante os testes:

1. 
2. 
3. 

## Aprovação Final

- [ ] Todos os testes críticos foram executados com sucesso
- [ ] Bugs encontrados foram corrigidos e retestados
- [ ] Documentação está atualizada e completa
- [ ] Aplicativo está pronto para entrega ao usuário

Data de aprovação: ___/___/______

Responsável pelos testes: ______________________
