#!/bin/bash

echo "🚀 Iniciando ngrok para Task Manager..."
echo ""

# Verificar si ngrok está configurado
if ! ~/bin/ngrok config check &>/dev/null; then
    echo "⚠️  ngrok no está configurado."
    echo ""
    echo "Pasos para configurar:"
    echo "1. Ve a: https://dashboard.ngrok.com/signup"
    echo "2. Regístrate (es gratis)"
    echo "3. Copia tu authtoken de: https://dashboard.ngrok.com/get-started/your-authtoken"
    echo "4. Ejecuta: ~/bin/ngrok config add-authtoken TU_TOKEN_AQUÍ"
    echo ""
    echo "Luego vuelve a ejecutar este script."
    exit 1
fi

# Verificar que el servidor esté corriendo
if ! curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "❌ El servidor no está corriendo en localhost:8000"
    echo ""
    echo "Inicia el servidor primero:"
    echo "  ./start-dev.sh"
    echo ""
    echo "O manualmente:"
    echo "  npm run server:python"
    exit 1
fi

echo "✅ Servidor detectado en localhost:8000"
echo ""

# Iniciar ngrok
echo "🌐 Iniciando túnel ngrok..."
echo ""
echo "⚠️  Mantén esta terminal abierta mientras uses ChatGPT"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

~/bin/ngrok http 8000 \
    --log=stdout \
    --log-level=info \
    --log-format=term

# Nota: El script se quedará corriendo hasta que presiones Ctrl+C

