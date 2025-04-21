#!/bin/bash

# Instalar dependências
npm install --legacy-peer-deps --no-audit

# Limpar cache
rm -rf node_modules/.cache

# Executar build
npm run build 