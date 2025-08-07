#!/bin/bash

ARQUIVO_SAIDA="diagnostico_plataforma.txt"
echo "🔍 Gerando diagnóstico completo da plataforma..." > $ARQUIVO_SAIDA

echo -e "\n### 📦 package.json ###\n" >> $ARQUIVO_SAIDA
cat package.json >> $ARQUIVO_SAIDA

echo -e "\n### ⚙️ next.config.js ###\n" >> $ARQUIVO_SAIDA
cat next.config.js >> $ARQUIVO_SAIDA

echo -e "\n### 🌐 tsconfig.json ###\n" >> $ARQUIVO_SAIDA
cat tsconfig.json >> $ARQUIVO_SAIDA

echo -e "\n### 🎨 tailwind.config.ts ###\n" >> $ARQUIVO_SAIDA
cat tailwind.config.ts >> $ARQUIVO_SAIDA

echo -e "\n### 🧩 postcss.config.js ###\n" >> $ARQUIVO_SAIDA
cat postcss.config.js >> $ARQUIVO_SAIDA

echo -e "\n### 📏 eslint.config.mjs ###\n" >> $ARQUIVO_SAIDA
cat eslint.config.mjs >> $ARQUIVO_SAIDA

echo -e "\n### 📡 test-mqtt.js ###\n" >> $ARQUIVO_SAIDA
cat test-mqtt.js >> $ARQUIVO_SAIDA

if [ -f ".env" ]; then
  echo -e "\n### 🔐 .env (ATENÇÃO: DADOS SENSÍVEIS) ###\n" >> $ARQUIVO_SAIDA
  cat .env >> $ARQUIVO_SAIDA
fi

echo -e "\n### 📂 Conteúdo da pasta prisma/ ###\n" >> $ARQUIVO_SAIDA
find prisma -type f | while read file; do
  echo -e "\n--- Arquivo: $file ---\n" >> $ARQUIVO_SAIDA
  cat "$file" >> $ARQUIVO_SAIDA
done

echo -e "\n### 📂 Conteúdo da pasta src/ ###\n" >> $ARQUIVO_SAIDA
find src -type f \( -iname "*.ts" -o -iname "*.tsx" -o -iname "*.js" \) | while read file; do
  echo -e "\n--- Arquivo: $file ---\n" >> $ARQUIVO_SAIDA
  cat "$file" >> $ARQUIVO_SAIDA
done

echo -e "\n✅ Diagnóstico salvo em: $ARQUIVO_SAIDA"
