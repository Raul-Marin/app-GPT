# 📁 Estructura del Proyecto

```
apps-GPT/
│
├── 📄 package.json              # Dependencias Node.js y scripts
├── 📄 tsconfig.json             # Configuración TypeScript
├── 📄 vite.config.ts            # Configuración Vite (build tool)
├── 📄 postcss.config.mjs        # Configuración PostCSS
├── 📄 vite-env.d.ts             # Tipos TypeScript para Vite
│
├── 📝 README.md                 # Documentación principal
├── 📝 QUICKSTART.md             # Guía rápida de inicio
├── 📝 TUTORIAL.md               # Tutorial completo paso a paso
├── 📝 EXAMPLES.md               # Ejemplos de uso
├── 📝 PROJECT_STRUCTURE.md      # Este archivo
│
├── 🚀 start-dev.sh              # Script inicio (macOS/Linux)
├── 🚀 start-dev.ps1             # Script inicio (Windows)
│
├── 🎨 src/                      # Código fuente de widgets
│   └── task-manager/
│       ├── index.html           # HTML principal del widget
│       ├── main.tsx             # Punto de entrada React
│       ├── App.tsx              # Componente principal
│       └── main.css             # Estilos con Tailwind
│
├── 🐍 server_python/            # Servidor MCP en Python
│   ├── __init__.py
│   ├── main.py                  # Servidor FastAPI + MCP
│   └── requirements.txt         # Dependencias Python
│
├── 📦 dist/                     # Assets compilados (generado)
│   ├── task-manager-[hash].html
│   └── assets/
│       ├── task-manager-[hash].js
│       └── task-manager-[hash].css
│
├── 🔧 node_modules/             # Dependencias Node (generado)
├── 🐍 .venv/                    # Entorno virtual Python (generado)
└── 📝 .gitignore                # Archivos ignorados por Git
```

## 📦 Directorios Principales

### `src/` - Componentes UI

Contiene todos los widgets de React con Apps SDK UI.

```
src/
└── task-manager/               # Widget de gestión de tareas
    ├── index.html             # ← Punto de entrada HTML
    ├── main.tsx               # ← Inicializa React
    ├── App.tsx                # ← Lógica del componente
    └── main.css               # ← Estilos (Tailwind + SDK)
```

**Flujo de construcción:**
1. Vite lee `index.html` como entrada
2. Carga `main.tsx` que importa `App.tsx`
3. Compila todo a HTML/JS/CSS en `dist/`

### `server_python/` - Servidor MCP

Backend que expone herramientas a ChatGPT.

```
server_python/
├── __init__.py                # Marca el directorio como paquete
├── main.py                    # ← Lógica principal del servidor
└── requirements.txt           # ← Dependencias Python
```

**Responsabilidades:**
- ✅ Exponer herramientas (list_tools)
- ✅ Procesar llamadas (call_tool)
- ✅ Retornar widgets (EmbeddedResource)
- ✅ Gestionar datos (tasks_db)

### `dist/` - Assets Compilados

Generado por `npm run build`. Vite compila los componentes:

```
dist/
├── task-manager-a1b2c3d4.html    # HTML con hashes para cache-busting
└── assets/
    ├── task-manager-a1b2c3d4.js   # JavaScript compilado
    └── task-manager-a1b2c3d4.css  # CSS compilado
```

**Importante:**
- 🔄 Se regenera con cada build
- 🔗 Los hashes cambian si el código cambia
- 🌐 Servido por `npm run serve` en puerto 4444

## 🔄 Flujo de Datos

```
┌─────────────────────────────────────────────────────────┐
│                      1. Usuario                         │
│              "Show me my tasks"                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   2. ChatGPT                            │
│   - Analiza intención                                   │
│   - Selecciona herramienta: get_tasks()                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼ HTTP Request
┌─────────────────────────────────────────────────────────┐
│           3. Servidor MCP (Python)                      │
│   server_python/main.py                                 │
│   - Recibe llamada a get_tasks()                        │
│   - Consulta tasks_db                                   │
│   - Carga widget HTML                                   │
│   - Inyecta datos: window.__TASK_DATA__                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼ HTTP Response
┌─────────────────────────────────────────────────────────┐
│                  4. ChatGPT                             │
│   - Recibe TextContent + EmbeddedResource               │
│   - Renderiza texto                                     │
│   - Renderiza widget HTML en iframe                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 5. Widget (React)                       │
│   src/task-manager/App.tsx                              │
│   - Lee window.__TASK_DATA__                            │
│   - Renderiza tareas con Apps SDK UI                    │
│   - Usuario ve interfaz interactiva                     │
└─────────────────────────────────────────────────────────┘
```

## 📝 Archivos de Configuración

### `package.json`
```json
{
  "scripts": {
    "dev": "vite",                    // ← Desarrollo con hot reload
    "build": "vite build",            // ← Compilar para producción
    "serve": "vite preview --port 4444", // ← Servir assets
    "server:python": "uvicorn ..."   // ← Iniciar servidor MCP
  }
}
```

### `vite.config.ts`
```typescript
{
  build: {
    rollupOptions: {
      input: {
        'task-manager': './src/task-manager/index.html' // ← Entry point
      }
    }
  }
}
```

Define:
- 📍 Entry points de cada widget
- 🔨 Cómo se construyen los bundles
- 🎯 Output con hashes para cache

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "jsx": "react-jsx",              // ← Soporte JSX de React
    "module": "ESNext",              // ← Módulos modernos
    "strict": true                   // ← Type checking estricto
  }
}
```

### `postcss.config.mjs`
```javascript
{
  plugins: {
    tailwindcss: {},                 // ← Procesar Tailwind
    autoprefixer: {}                 // ← Prefijos CSS automáticos
  }
}
```

### `server_python/requirements.txt`
```
fastapi>=0.115.0                    # Web framework
uvicorn[standard]>=0.32.0           # ASGI server
mcp>=1.0.0                          # Model Context Protocol
pydantic>=2.9.0                     # Validación de datos
```

## 🔑 Archivos Clave

### 1. `src/task-manager/App.tsx`
**Propósito:** Componente React principal del widget

**Responsabilidades:**
- ✅ Leer datos de `window.__TASK_DATA__`
- ✅ Renderizar lista de tareas
- ✅ Mostrar badges de prioridad
- ✅ Separar completadas/pendientes

**Dependencias:**
- `@openai/apps-sdk-ui` - Componentes UI
- React - Framework

### 2. `server_python/main.py`
**Propósito:** Servidor MCP que expone herramientas

**Funciones principales:**
```python
@mcp_server.list_tools()          # Lista herramientas disponibles
@mcp_server.call_tool()           # Ejecuta herramientas
load_widget_html()                # Carga HTML compilado
create_widget_html()              # Inyecta datos en HTML
```

**Endpoints:**
- `GET /` - Info del servidor
- `GET /health` - Health check
- `POST /mcp` - Endpoint MCP (usado por ChatGPT)

### 3. `src/task-manager/main.css`
**Propósito:** Configuración de estilos

```css
@import "tailwindcss";                    # ← Tailwind 4
@import "@openai/apps-sdk-ui/css";        # ← Design tokens SDK
@source "../node_modules/@openai/apps-sdk-ui"; # ← Referencia componentes
```

## 🎯 Puntos de Extensión

### Añadir nuevo widget

1. Crear directorio:
```
src/
└── mi-nuevo-widget/
    ├── index.html
    ├── main.tsx
    ├── App.tsx
    └── main.css
```

2. Actualizar `vite.config.ts`:
```typescript
input: {
  'task-manager': './src/task-manager/index.html',
  'mi-nuevo-widget': './src/mi-nuevo-widget/index.html', // ← Añadir
}
```

3. Compilar: `npm run build`

### Añadir nueva herramienta MCP

En `server_python/main.py`:

```python
@mcp_server.list_tools()
async def list_tools():
    return [
        # ... herramientas existentes
        Tool(
            name="mi_herramienta",
            description="Descripción de la herramienta",
            inputSchema={...}
        )
    ]

@mcp_server.call_tool()
async def call_tool(name: str, arguments: dict):
    # ... handlers existentes
    elif name == "mi_herramienta":
        # Tu lógica aquí
        return [...]
```

## 📊 Tamaños Aproximados

```
Desarrollo:
├── node_modules/     ~200 MB
├── .venv/            ~50 MB
├── src/              ~20 KB
└── server_python/    ~5 KB

Producción:
└── dist/             ~500 KB
    ├── HTML          ~2 KB
    ├── JS            ~300 KB
    └── CSS           ~50 KB
```

## 🔒 Archivos Ignorados (.gitignore)

```
node_modules/        # Dependencias Node
.venv/               # Entorno virtual Python
dist/                # Assets compilados
*.log                # Logs
.DS_Store            # macOS
__pycache__/         # Python cache
```

## 📚 Dependencias Importantes

### Node.js

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `@openai/apps-sdk-ui` | ^0.2.0 | Componentes y tokens de diseño |
| `react` | ^18.3.1 | Framework UI |
| `vite` | ^6.0.1 | Build tool y dev server |
| `tailwindcss` | ^4.0.0 | Framework CSS |
| `typescript` | ^5.6.3 | Tipado estático |

### Python

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `fastapi` | >=0.115.0 | Web framework |
| `uvicorn` | >=0.32.0 | ASGI server |
| `mcp` | >=1.0.0 | Model Context Protocol |
| `pydantic` | >=2.9.0 | Validación de datos |

## 🚀 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm install` | Instalar dependencias Node |
| `npm run dev` | Modo desarrollo con hot reload |
| `npm run build` | Compilar para producción |
| `npm run serve` | Servir assets en puerto 4444 |
| `npm run server:python` | Iniciar servidor MCP |
| `./start-dev.sh` | Iniciar todo (macOS/Linux) |
| `.\start-dev.ps1` | Iniciar todo (Windows) |

## 🌐 Puertos Usados

| Puerto | Servicio | URL |
|--------|----------|-----|
| 4444 | Assets estáticos | http://localhost:4444 |
| 8000 | Servidor MCP | http://localhost:8000 |
| 5173 | Vite dev server | http://localhost:5173 (solo en dev) |

## ✅ Checklist de Setup

- [ ] Node.js 18+ instalado
- [ ] Python 3.10+ instalado
- [ ] `npm install` ejecutado
- [ ] `python -m venv .venv` ejecutado
- [ ] `pip install -r server_python/requirements.txt` ejecutado
- [ ] `npm run build` ejecutado con éxito
- [ ] `dist/` contiene archivos compilados
- [ ] `npm run serve` funciona (puerto 4444)
- [ ] `npm run server:python` funciona (puerto 8000)
- [ ] Navegador muestra widget en localhost:4444

## 🎓 Próximos Pasos

1. **Leer:** [QUICKSTART.md](./QUICKSTART.md) para ejecutar
2. **Estudiar:** [TUTORIAL.md](./TUTORIAL.md) para entender
3. **Probar:** [EXAMPLES.md](./EXAMPLES.md) para casos de uso
4. **Personalizar:** Modificar `App.tsx` y `main.py`
5. **Deployar:** Subir a tu plataforma favorita

¡Feliz coding! 🚀

