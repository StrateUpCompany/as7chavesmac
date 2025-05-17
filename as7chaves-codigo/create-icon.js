// Script para criar ícone do aplicativo para macOS
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Criar diretório de build se não existir
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir);
}

// Gerar ícone usando o comando sips (disponível no macOS)
console.log('Gerando ícone para macOS...');
console.log('Nota: Este script deve ser executado em um ambiente macOS para gerar o ícone .icns');
console.log('Se estiver em outro sistema operacional, você precisará gerar o ícone manualmente');

// Instruções para geração manual de ícone
console.log('\nInstruções para geração manual de ícone:');
console.log('1. Crie uma imagem PNG de 1024x1024 pixels');
console.log('2. Use uma ferramenta online como https://cloudconvert.com/png-to-icns');
console.log('3. Salve o arquivo .icns resultante como "build/icon.icns"');

// Placeholder para o ícone
console.log('\nCriando arquivo placeholder para o ícone...');
fs.writeFileSync(path.join(buildDir, 'icon.txt'), 'Substitua este arquivo por um ícone .icns real');

console.log('\nProcesso concluído!');
