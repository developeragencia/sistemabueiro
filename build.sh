#!/bin/bash

# Limpar cache e node_modules
rm -rf node_modules
rm -rf dist

# Instalar dependências
npm install --legacy-peer-deps --no-audit

# Verificar se a instalação foi bem-sucedida
if [ ! -d "node_modules" ]; then
  echo "Erro: node_modules não foi criado corretamente"
  exit 1
fi

# Limpar cache
rm -rf node_modules/.cache

# Executar build
npm run build

# Verificar se o build foi bem-sucedido
if [ ! -d "dist" ]; then
  echo "Erro: dist não foi criado corretamente"
  exit 1
fi 