# Instruções para Empacotamento e Instalação do As 7 Chaves no MacBook

Este documento fornece instruções detalhadas para empacotar o aplicativo As 7 Chaves em um instalador DMG para MacBook e como instalá-lo no seu sistema.

## Requisitos para Empacotamento

- Node.js 16 ou superior
- npm ou yarn
- macOS para geração do instalador DMG (recomendado)

## Passos para Empacotamento

1. **Preparar o ambiente de desenvolvimento**:
   ```bash
   # Instalar todas as dependências
   npm install
   
   # Instalar dependências do frontend
   cd renderer
   npm install
   cd ..
   ```

2. **Gerar o build estático do frontend Next.js**:
   ```bash
   # Construir o frontend
   npm run build
   ```

3. **Criar o ícone do aplicativo** (necessário macOS):
   ```bash
   # Executar script para criar ícone
   node create-icon.js
   
   # Substitua o arquivo placeholder por um ícone .icns real
   # Coloque o arquivo icon.icns na pasta build/
   ```

4. **Empacotar o aplicativo para macOS**:
   ```bash
   # Gerar o instalador DMG
   npm run package:mac
   ```

5. **Localizar o instalador gerado**:
   O instalador DMG será gerado na pasta `dist/` com o nome `As 7 Chaves-1.0.0.dmg`

## Instruções de Instalação no MacBook

1. **Copie o arquivo DMG** para o seu MacBook

2. **Abra o arquivo DMG** clicando duas vezes nele

3. **Instale o aplicativo** arrastando o ícone do As 7 Chaves para a pasta Aplicativos

4. **Primeira execução**:
   - Localize o aplicativo na pasta Aplicativos
   - Clique com o botão direito e selecione "Abrir"
   - Confirme que deseja abrir o aplicativo
   - O banco de dados será inicializado automaticamente na primeira execução

## Possíveis Problemas e Soluções

### Aplicativo bloqueado pelo Gatekeeper do macOS
Se o macOS bloquear a execução do aplicativo por não ser de um "desenvolvedor identificado":
1. Vá para Preferências do Sistema > Segurança e Privacidade
2. Na aba "Geral", clique em "Abrir Mesmo Assim"

### Erro ao inicializar banco de dados
Se ocorrer erro na inicialização do banco de dados:
1. Feche o aplicativo completamente
2. Abra novamente
3. Se o problema persistir, verifique as permissões da pasta do aplicativo

## Funcionalidades Principais

Após a instalação, você terá acesso a todas as funcionalidades do sistema As 7 Chaves:

- Criação e gerenciamento de funis de vendas
- Editor visual de páginas
- Captura e gerenciamento de leads
- Integração com sistemas externos via webhooks
- Backup e restauração de dados

## Suporte

Para qualquer problema durante a instalação ou uso do aplicativo, entre em contato através do email suporte@as7chaves.com
