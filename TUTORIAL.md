# Tutorial: Task Manager App con Apps SDK

Este tutorial te guiará paso a paso para crear y ejecutar tu primera app de ChatGPT usando el Apps SDK.

## 📋 Tabla de Contenidos

1. [Arquitectura](#arquitectura)
2. [Componentes](#componentes)
3. [Servidor MCP](#servidor-mcp)
4. [Desarrollo Local](#desarrollo-local)
5. [Integración con ChatGPT](#integración-con-chatgpt)
6. [Personalización](#personalización)

## 🏗️ Arquitectura

La app consta de tres partes principales:

```
┌─────────────────┐
│   ChatGPT       │
│   (Cliente)     │
└────────┬────────┘
         │
         │ MCP Protocol
         │
┌────────▼────────┐
│  Servidor MCP   │ ← Expone herramientas
│  (Python)       │   y retorna widgets
└────────┬────────┘
         │
         │ Sirve HTML
         │
┌────────▼────────┐
│  Widget UI      │ ← Componentes React
│  (React + SDK)  │   con Tailwind
└─────────────────┘
```

### Flujo de Funcionamiento

1. **Usuario pregunta en ChatGPT**: "Show me my tasks"
2. **ChatGPT llama a la herramienta MCP**: `get_tasks()`
3. **Servidor MCP procesa** y retorna:
   - Texto descriptivo
   - Widget HTML embebido
4. **ChatGPT renderiza** el widget en la conversación

## 🎨 Componentes

### Estructura del Widget

```
src/task-manager/
├── index.html      # Punto de entrada HTML
├── main.tsx        # Inicialización de React
├── App.tsx         # Componente principal
└── main.css        # Estilos con Tailwind
```

### App.tsx - Componente Principal

El componente usa `@openai/apps-sdk-ui` que proporciona:

- **Badge**: Para prioridades (Alta, Media, Baja)
- **Button**: Botones con estilos consistentes
- **Icon**: Iconos del sistema de diseño
- **Layout utilities**: Clases de Tailwind optimizadas

```tsx
import { Badge } from "@openai/apps-sdk-ui/components/Badge";
import { Button } from "@openai/apps-sdk-ui/components/Button";

// Badge con colores semánticos
<Badge color="error">Alta</Badge>
<Badge color="warning">Media</Badge>
<Badge color="success">Baja</Badge>

// Botones con variantes
<Button color="primary">Nueva Tarea</Button>
<Button variant="soft" color="secondary">Cancelar</Button>
```

### Design Tokens

Apps SDK UI incluye tokens de diseño que funcionan automáticamente con modo oscuro:

```css
/* Colores de texto */
text-primary    → Color de texto principal
text-secondary  → Color de texto secundario
text-tertiary   → Color de texto terciario

/* Fondos */
bg-surface      → Fondo de superficie (cards)
bg-default      → Fondo por defecto

/* Bordes */
border-default  → Borde por defecto
border-subtle   → Borde sutil

/* Sombras */
shadow-lg       → Sombra grande (optimizada para ChatGPT)
```

## 🔧 Servidor MCP

### Estructura

```python
server_python/
├── __init__.py
├── main.py          # Servidor FastAPI + MCP
└── requirements.txt # Dependencias
```

### Herramientas Expuestas

El servidor expone 3 herramientas:

#### 1. `get_tasks`

```python
{
    "name": "get_tasks",
    "description": "Obtiene todas las tareas del usuario",
    "inputSchema": {"type": "object", "properties": {}}
}
```

**Uso**: "Show me my tasks" o "What tasks do I have?"

#### 2. `create_task`

```python
{
    "name": "create_task",
    "description": "Crea una nueva tarea",
    "inputSchema": {
        "type": "object",
        "properties": {
            "title": {"type": "string"},
            "description": {"type": "string"},
            "due_date": {"type": "string"},
            "priority": {"enum": ["low", "medium", "high"]}
        },
        "required": ["title"]
    }
}
```

**Uso**: "Create a task to review the design by tomorrow"

#### 3. `update_task_status`

```python
{
    "name": "update_task_status",
    "description": "Actualiza el estado de una tarea",
    "inputSchema": {
        "type": "object",
        "properties": {
            "task_id": {"type": "string"},
            "completed": {"type": "boolean"}
        },
        "required": ["task_id", "completed"]
    }
}
```

**Uso**: "Mark task 1 as completed"

### Retorno de Widgets

Cada herramienta retorna:

```python
[
    TextContent(
        type="text",
        text="Descripción textual del resultado"
    ),
    EmbeddedResource(
        type="resource",
        resource={
            "uri": "http://localhost:4444/task-manager-widget",
            "mimeType": "text/html",
            "text": "<html>...</html>"  # Widget HTML completo
        }
    )
]
```

### Inyección de Datos

El servidor inyecta los datos en el widget:

```python
def create_widget_html(tasks: list[dict]) -> str:
    html_template = load_widget_html("task-manager")
    tasks_json = json.dumps(tasks)
    
    injection = f"""
    <script>
        window.__TASK_DATA__ = {tasks_json};
    </script>
    """
    
    return html_template.replace("</body>", injection)
```

El componente React los consume:

```tsx
const tasks: Task[] = (window as any).__TASK_DATA__ || [];
```

## 🚀 Desarrollo Local

### 1. Instalar Dependencias

```bash
# Node.js
npm install

# Python
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r server_python/requirements.txt
```

### 2. Build de Componentes

```bash
npm run build
```

Esto genera en `dist/`:

```
dist/
├── task-manager-[hash].html
└── assets/
    ├── task-manager-[hash].js
    └── task-manager-[hash].css
```

### 3. Servir Assets Estáticos

En una terminal:

```bash
npm run serve
```

Esto inicia un servidor en `http://localhost:4444` con CORS habilitado.

### 4. Ejecutar Servidor MCP

En otra terminal:

```bash
source .venv/bin/activate
npm run server:python
```

El servidor MCP estará en `http://localhost:8000`

### 5. Verificar Funcionamiento

Abre: `http://localhost:8000/` para ver la info del servidor

Endpoints disponibles:
- `/` - Información del servidor
- `/health` - Health check
- `/mcp` - Endpoint MCP (usado por ChatGPT)

## 🌐 Integración con ChatGPT

### Con ngrok (Desarrollo)

1. Instala ngrok: https://ngrok.com/download

2. Expón tu servidor:

```bash
ngrok http 8000
```

3. Copia la URL pública: `https://xxxx.ngrok-free.app`

4. En ChatGPT:
   - Ve a **Settings** → **Connectors**
   - Click **"Add Connector"**
   - Pega: `https://xxxx.ngrok-free.app/mcp`
   - Guarda

5. En una conversación:
   - Click en **"More"** (tres puntos)
   - Selecciona tu connector
   - Pregunta: "Show me my tasks"

### Con Deploy en Producción

Para producción, puedes deployar en:

- **Render**: https://render.com
- **Railway**: https://railway.app
- **Fly.io**: https://fly.io
- **Heroku**: https://heroku.com

**Importante**: Configura la variable de entorno:

```bash
BASE_URL=https://tu-dominio.com
```

## 🎨 Personalización

### Añadir Nuevos Campos a las Tareas

1. Actualiza el tipo en `App.tsx`:

```tsx
interface Task {
  id: string;
  title: string;
  tags?: string[];  // ← Nuevo campo
  // ...
}
```

2. Actualiza el componente `TaskCard`:

```tsx
{task.tags && (
  <div className="flex gap-1">
    {task.tags.map(tag => (
      <Badge key={tag} size="sm">{tag}</Badge>
    ))}
  </div>
)}
```

3. Actualiza el servidor Python:

```python
new_task = {
    "id": str(len(tasks_db) + 1),
    "title": arguments["title"],
    "tags": arguments.get("tags", []),  # ← Nuevo campo
    # ...
}
```

### Crear Nuevas Herramientas

1. Añade la herramienta en `list_tools()`:

```python
Tool(
    name="delete_task",
    description="Elimina una tarea",
    inputSchema={
        "type": "object",
        "properties": {
            "task_id": {"type": "string"}
        },
        "required": ["task_id"]
    }
)
```

2. Maneja la llamada en `call_tool()`:

```python
elif name == "delete_task":
    task_id = arguments["task_id"]
    tasks_db[:] = [t for t in tasks_db if t["id"] != task_id]
    
    return [
        TextContent(
            type="text",
            text=f"✓ Tarea eliminada"
        ),
        EmbeddedResource(...)
    ]
```

### Personalizar Estilos

Usa las clases de Tailwind y los tokens de Apps SDK UI:

```tsx
// Colores personalizados
<div className="bg-gradient-to-r from-blue-500 to-purple-600">

// Espaciado
<div className="p-6 gap-4">

// Tipografía
<h1 className="heading-xl">  // Token del SDK
<p className="text-sm">      // Tailwind estándar
```

### Añadir Persistencia Real

Reemplaza `tasks_db` con una base de datos:

```python
# SQLite
import sqlite3

# PostgreSQL
from databases import Database
database = Database("postgresql://...")

# MongoDB
from motor.motor_asyncio import AsyncIOMotorClient
client = AsyncIOMotorClient("mongodb://...")
```

## 🐛 Troubleshooting

### El widget no se renderiza

1. Verifica que el servidor de assets esté corriendo:
   ```bash
   curl http://localhost:4444/
   ```

2. Verifica que los archivos se hayan compilado:
   ```bash
   ls -la dist/assets/
   ```

3. Revisa la consola del navegador (F12) para errores

### ChatGPT no encuentra las herramientas

1. Verifica el endpoint MCP:
   ```bash
   curl http://localhost:8000/mcp
   ```

2. Asegúrate de haber añadido el connector correctamente

3. Verifica que ngrok esté activo

### Errores de CORS

El servidor debe tener CORS habilitado:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📚 Recursos

- **Apps SDK UI Docs**: https://openai.github.io/apps-sdk-ui/
- **MCP Protocol**: https://github.com/modelcontextprotocol
- **Tailwind CSS**: https://tailwindcss.com/docs
- **FastAPI**: https://fastapi.tiangolo.com/

## 🎯 Próximos Pasos

1. **Añade autenticación**: Integra OAuth para usuarios reales
2. **Base de datos**: Implementa persistencia con PostgreSQL
3. **Más widgets**: Crea calendario, gráficos, etc.
4. **Testing**: Añade tests unitarios y de integración
5. **Deploy**: Lleva tu app a producción

¡Diviértete construyendo tu app! 🚀

