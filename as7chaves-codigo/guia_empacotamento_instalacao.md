# Guia de Empacotamento e Instalação do As 7 Chaves para MacBook

Este documento descreve o processo de empacotamento do aplicativo As 7 Chaves em um instalador DMG para MacBook e fornece instruções detalhadas para instalação e uso.

## Requisitos do Sistema

- macOS 10.14 (Mojave) ou superior
- Mínimo de 4GB de RAM
- 500MB de espaço em disco disponível
- Permissões de administrador para instalação

## Processo de Empacotamento

O aplicativo As 7 Chaves é empacotado usando Electron Builder, que cria um arquivo DMG instalável para macOS. O processo de empacotamento inclui as seguintes etapas:

1. **Preparação do Frontend**:
   - Build estático do Next.js
   - Otimização de assets
   - Configuração para uso offline

2. **Preparação do Backend**:
   - Integração com SQLite local
   - Configuração de IPC para comunicação entre processos
   - Implementação de webhooks para integração externa

3. **Empacotamento com Electron Builder**:
   - Criação do instalador DMG
   - Assinatura do aplicativo (opcional)
   - Configuração de ícones e metadados

## Instruções para Empacotamento

Para empacotar o aplicativo, execute os seguintes comandos:

```bash
# Instalar dependências
npm install

# Construir o frontend Next.js
npm run build

# Empacotar o aplicativo para macOS
npm run package:mac
```

O instalador DMG será gerado na pasta `dist/`.

## Instruções de Instalação para o Usuário Final

1. **Download do Instalador**:
   - Baixe o arquivo DMG fornecido
   - Verifique a integridade do arquivo (opcional)

2. **Instalação**:
   - Abra o arquivo DMG clicando duas vezes nele
   - Arraste o ícone do aplicativo As 7 Chaves para a pasta Aplicativos
   - Aguarde a conclusão da cópia

3. **Primeira Execução**:
   - Abra o aplicativo a partir da pasta Aplicativos
   - Na primeira execução, pode ser necessário autorizar a abertura nas configurações de segurança do macOS
   - O banco de dados será inicializado automaticamente

## Solução de Problemas Comuns

### Aplicativo não abre após instalação
- Verifique as configurações de segurança do macOS em Preferências do Sistema > Segurança e Privacidade
- Clique em "Abrir Mesmo Assim" se o macOS bloquear a execução

### Erro de banco de dados
- Verifique se o usuário tem permissões de escrita na pasta do aplicativo
- Reinicie o aplicativo para tentar novamente a inicialização do banco de dados

### Problemas de conexão com webhooks
- Verifique a conexão com a internet
- Confirme se as URLs dos webhooks estão corretas e acessíveis

## Backup e Restauração de Dados

O aplicativo inclui funcionalidades para backup e restauração de dados:

1. **Backup**:
   - Acesse a seção Configurações
   - Clique em "Fazer Backup"
   - Escolha o local para salvar o arquivo de backup

2. **Restauração**:
   - Acesse a seção Configurações
   - Clique em "Restaurar Backup"
   - Selecione o arquivo de backup
   - O aplicativo será reiniciado após a restauração

## Suporte e Contato

Para suporte técnico ou dúvidas sobre o aplicativo, entre em contato através de:
- Email: suporte@as7chaves.com
- Site: www.as7chaves.com/suporte
