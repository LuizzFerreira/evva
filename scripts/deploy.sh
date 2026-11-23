#!/bin/bash

# Script de Deploy - EVVA Painel Web
# Deploy para Vercel (ou outra plataforma)

echo "========================================"
echo "  EVVA Painel - Deploy"
echo "========================================"
echo ""

# Verificar Node.js
echo "[1/5] Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "  ERRO: Node.js não instalado"
    exit 1
fi
echo "  Node.js $(node --version) encontrado"

# Verificar .env
echo "[2/5] Verificando variáveis de ambiente..."
if [ ! -f ".env" ]; then
    echo "  AVISO: Arquivo .env não encontrado"
    echo "  IMPORTANTE: Configure variáveis de ambiente na plataforma de deploy"
fi

# Instalar dependências
echo "[3/5] Instalando dependências..."
npm install
if [ $? -ne 0 ]; then
    echo "  ERRO ao instalar dependências"
    exit 1
fi

# TypeScript check
echo "[4/5] Verificando TypeScript..."
npx tsc --noEmit
if [ $? -ne 0 ]; then
    echo "  ERRO: Erros de TypeScript encontrados"
    exit 1
fi

# Build
echo "[5/5] Compilando para produção..."
npm run build
if [ $? -ne 0 ]; then
    echo "  ERRO na compilação"
    exit 1
fi

echo ""
echo "========================================"
echo "  Build concluído com sucesso!"
echo "========================================"
echo ""
echo "Pasta dist/ pronta para deploy"
echo ""
echo "Deploy na Vercel:"
echo "  vercel --prod"
echo ""
echo "Deploy na Netlify:"
echo "  npx netlify deploy --prod --dir=dist"
echo ""
