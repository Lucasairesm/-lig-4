const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Diretório de origem dos arquivos TypeScript
const srcDir = path.join(__dirname, 'src', 'app');

// Diretório de destino do arquivo concatenado
const outputDir = path.join(__dirname, 'dist');
const outputFile = path.join(outputDir, 'concatenated.ts');

// Excluir arquivos e diretórios do Angular e bibliotecas externas
const excludePatterns = [
    '**/node_modules/**',
    '**/src/environments/**',
    '**/src/assets/**',
    '**/*.spec.ts',  // Excluir arquivos de teste
    '**/main.ts',
    '**/polyfills.ts',
    '**/test.ts'
];

// Encontrar todos os arquivos TypeScript no diretório src/app
const tsFiles = glob.sync(`${srcDir}/**/*.ts`, {
    ignore: excludePatterns
});

// Garantir que o diretório de saída existe
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Função para concatenar arquivos
function concatenateFiles(files, destinationFile) {
    let concatenatedContent = '';

    files.forEach((file) => {
        const content = fs.readFileSync(file, 'utf-8');
        concatenatedContent += `\n\n// File: ${file}\n${content}`;
    });

    fs.writeFileSync(destinationFile, concatenatedContent);
    console.log(`Concatenated ${files.length} files into ${destinationFile}`);
}

// Executar a concatenação
concatenateFiles(tsFiles, outputFile);
