# 🚀 Quick Start

Guía rápida para ejecutar el ejemplo en **menos de 5 minutos**.

## Prerrequisitos

- ✅ Node.js 18+ instalado
- ✅ Python 3.10+ instalado
- ✅ npm instalado

## Pasos

### 1. Instalar dependencias

```bash
npm install
```

### 2. Crear entorno virtual Python

```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r server_python/requirements.txt
```

### 3. Compilar componentes

```bash
npm run build
```

### 4. Iniciar todo (método automático)

**macOS/Linux:**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

**Windows (PowerShell):**
```powershell
.\start-dev.ps1
```

**Manual (ambos sistemas):**

Terminal 1:
```bash
npm run serve
```

Terminal 2:
```bash
source .venv/bin/activate  # Windows: .venv\Scripts\activate
npm run server:python
```

### 5. Verificar

Abre en tu navegador:
- Assets: http://localhost:4444
- Servidor MCP: http://localhost:8000

Deberías ver el widget en `http://localhost:4444/task-manager-[hash].html`

## 🌐 Conectar con ChatGPT

### Opción A: ngrok (Recomendado para pruebas)

1. Instala ngrok: https://ngrok.com/download

2. Expón el servidor:
```bash
ngrok http 8000
```

3. Copia la URL: `https://xxxx.ngrok-free.app`

4. En ChatGPT:
   - Settings → Connectors
   - Add Connector
   - URL: `https://xxxx.ngrok-free.app/mcp`

### Opción B: Probar localmente

Si solo quieres ver el widget funcionando:

1. Abre: http://localhost:4444/
2. Busca el archivo `task-manager-[hash].html`
3. Ábrelo en el navegador

## 💬 Probar en ChatGPT

Una vez conectado el MCP:

1. Inicia una conversación
2. Click en "More" (tres puntos)
3. Selecciona tu connector
4. Pregunta:
   - "Show me my tasks"
   - "Create a task to review the design"
   - "Mark task 1 as completed"

## 🐛 Problemas Comunes

### Error: Port 4444 already in use
```bash
lsof -ti:4444 | xargs kill -9  # macOS/Linux
```

### Error: Module not found
```bash
rm -rf node_modules
npm install
```

### Error: Python module not found
```bash
source .venv/bin/activate
pip install -r server_python/requirements.txt
```

### Widget no carga
1. Verifica que `npm run build` haya completado
2. Verifica que el servidor de assets esté corriendo
3. Revisa la consola del navegador (F12)

## 📚 Siguiente paso

Lee el [TUTORIAL.md](./TUTORIAL.md) completo para entender la arquitectura y personalizar la app.

## 🎉 ¡Listo!

Ya tienes tu primera app de ChatGPT funcionando. Ahora puedes:
- Personalizar los componentes en `src/task-manager/`
- Añadir nuevas herramientas en `server_python/main.py`
- Crear nuevos widgets

