# GPT App Demo

Demo de ejemplo usando el Apps SDK de OpenAI con componentes UI y servidor MCP.

## Características

- ✨ Componentes UI con `@openai/apps-sdk-ui`
- 🎨 Tailwind 4 integrado
- 🔧 Servidor MCP en Python
- 📦 Task Manager widget de ejemplo

## Requisitos

- Node.js 18+
- Python 3.10+
- npm o pnpm

## Instalación

1. Instalar dependencias de Node:

```bash
npm install
```

2. Crear entorno virtual de Python e instalar dependencias:

```bash
python -m venv .venv
source .venv/bin/activate  # En Windows: .venv\Scripts\activate
pip install -r server_python/requirements.txt
```

## Desarrollo

### 1. Build de componentes

Construir los componentes UI:

```bash
npm run build
```

### 2. Servir assets estáticos

En una terminal, ejecuta:

```bash
npm run serve
```

Esto servirá los assets en `http://localhost:4444`

### 3. Ejecutar el servidor MCP

En otra terminal:

```bash
source .venv/bin/activate
npm run server:python
```

El servidor MCP estará disponible en `http://localhost:8000`

## Uso en ChatGPT

1. Usa ngrok para exponer tu servidor local:

```bash
ngrok http 8000
```

2. En ChatGPT:
   - Ve a Settings > Connectors
   - Añade tu URL de ngrok: `https://your-url.ngrok-free.app/mcp`

3. Pregunta algo como: "Show me my tasks" o "Create a new task for tomorrow"

## Estructura del proyecto

```
.
├── src/
│   └── task-manager/      # Widget de gestión de tareas
│       ├── index.html
│       ├── main.tsx
│       ├── App.tsx
│       └── main.css
├── server_python/         # Servidor MCP en Python
│   ├── main.py
│   └── requirements.txt
└── dist/                  # Assets compilados
```

## Licencia

MIT

