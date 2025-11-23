#!/bin/bash

echo "🚀 Iniciando Task Manager App..."
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar si node_modules existe
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules no encontrado. Instalando dependencias...${NC}"
    npm install
fi

# Verificar si .venv existe
if [ ! -d ".venv" ]; then
    echo -e "${YELLOW}⚠️  .venv no encontrado. Creando entorno virtual...${NC}"
    python -m venv .venv
    source .venv/bin/activate
    pip install -r server_python/requirements.txt
else
    source .venv/bin/activate
fi

# Verificar si dist existe
if [ ! -d "dist" ]; then
    echo -e "${YELLOW}⚠️  dist/ no encontrado. Compilando componentes...${NC}"
    npm run build
fi

echo ""
echo -e "${GREEN}✓${NC} Dependencias verificadas"
echo ""
echo -e "${BLUE}Iniciando servicios...${NC}"
echo ""
echo -e "${GREEN}1.${NC} Servidor de assets: ${BLUE}http://localhost:4444${NC}"
echo -e "${GREEN}2.${NC} Servidor MCP: ${BLUE}http://localhost:8000${NC}"
echo ""
echo -e "${YELLOW}Presiona Ctrl+C para detener todos los servicios${NC}"
echo ""

# Iniciar ambos servicios en paralelo
npm run serve &
PID1=$!

sleep 2

npm run server:python &
PID2=$!

# Función para matar procesos al salir
cleanup() {
    echo ""
    echo -e "${YELLOW}Deteniendo servicios...${NC}"
    kill $PID1 2>/dev/null
    kill $PID2 2>/dev/null
    exit 0
}

trap cleanup INT TERM

# Esperar a que los procesos terminen
wait

