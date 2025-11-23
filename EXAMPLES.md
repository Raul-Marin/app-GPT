# 📝 Ejemplos de Uso

Este documento contiene ejemplos prácticos de cómo interactuar con la app Task Manager en ChatGPT.

## 🗣️ Comandos de Ejemplo

### Ver Tareas

```
Usuario: Show me my tasks
Usuario: What tasks do I have?
Usuario: Muéstrame mis tareas pendientes
Usuario: List all my tasks
```

**Respuesta esperada:**
- ChatGPT llama a `get_tasks()`
- Muestra texto: "Tienes 2 tarea(s) pendiente(s) y 1 completada(s)"
- Renderiza el widget con todas las tareas

---

### Crear Tareas

```
Usuario: Create a task to review the design
Usuario: Add a task: "Update API documentation" with high priority
Usuario: Crea una tarea para mañana: preparar presentación
Usuario: Create a task "Fix bug in login" due by 2025-11-25
```

**Respuesta esperada:**
- ChatGPT llama a `create_task()` con los parámetros extraídos
- Muestra texto: "✓ Tarea creada: Review the design"
- Renderiza el widget actualizado con la nueva tarea

**Ejemplo con todos los campos:**

```
Usuario: Create a high priority task titled "Deploy to production" 
with description "Deploy v2.0 to production servers" 
due by 2025-12-01
```

Llama a:
```json
{
  "name": "create_task",
  "arguments": {
    "title": "Deploy to production",
    "description": "Deploy v2.0 to production servers",
    "due_date": "2025-12-01",
    "priority": "high"
  }
}
```

---

### Actualizar Estado de Tareas

```
Usuario: Mark task 1 as completed
Usuario: Complete the task "Review the design"
Usuario: Mark task 2 as incomplete
Usuario: Undo completion of task 3
```

**Respuesta esperada:**
- ChatGPT llama a `update_task_status()`
- Muestra texto: "✓ Tarea marcada como completada: Review the design"
- Renderiza el widget actualizado

---

## 🎯 Escenarios Completos

### Escenario 1: Organización Matutina

```
Usuario: Good morning! Show me my tasks for today

ChatGPT: [Muestra widget con tareas]

Usuario: Create a task to review pull requests, high priority

ChatGPT: [Crea tarea y muestra widget actualizado]

Usuario: Also add a task to update the changelog

ChatGPT: [Añade otra tarea y muestra widget actualizado]
```

---

### Escenario 2: Completar Tareas

```
Usuario: What tasks are pending?

ChatGPT: [Muestra widget con 3 tareas pendientes]

Usuario: I finished the first two tasks, mark them as complete

ChatGPT: [Marca tareas 1 y 2 como completadas y muestra widget]

Usuario: Show me only completed tasks

ChatGPT: [Muestra widget donde las tareas completadas son visibles]
```

---

### Escenario 3: Planificación Semanal

```
Usuario: Let's plan my week. Create these tasks:
- Review design (high priority, due Monday)
- Team meeting (medium priority, due Tuesday)
- Write documentation (low priority, due Friday)

ChatGPT: [Crea las 3 tareas y muestra widget]

Usuario: Actually, make the documentation high priority

ChatGPT: Sorry, I don't have a tool to update priority yet, 
but I can help you create a new task with the correct priority.
```

---

## 🔧 Casos de Prueba para Desarrollo

### Test 1: Sin Tareas

1. Modificar `tasks_db = []` en `server_python/main.py`
2. Reiniciar servidor
3. Preguntar: "Show me my tasks"
4. Verificar: Widget muestra mensaje "No hay tareas"

### Test 2: Muchas Tareas

```python
# Añadir en server_python/main.py
tasks_db = [
    {"id": str(i), "title": f"Task {i}", "completed": False, "priority": "medium"}
    for i in range(1, 11)
]
```

Verificar: Widget muestra scroll correctamente

### Test 3: Fechas Vencidas

```python
{
    "id": "1",
    "title": "Overdue task",
    "dueDate": "2025-11-01",  # Fecha pasada
    "completed": False,
    "priority": "high"
}
```

Mejora sugerida: Añadir badge "Vencida" en el componente

---

## 🎨 Personalización: Nuevos Casos de Uso

### Añadir Etiquetas (Tags)

**1. Actualizar modelo de datos:**

```python
# server_python/main.py
{
    "id": "1",
    "title": "Task",
    "tags": ["frontend", "urgent"]  # ← Nuevo
}
```

**2. Actualizar componente:**

```tsx
// src/task-manager/App.tsx
{task.tags && (
  <div className="flex gap-1 mt-2">
    {task.tags.map(tag => (
      <Badge key={tag} size="sm" color="secondary">
        {tag}
      </Badge>
    ))}
  </div>
)}
```

**3. Actualizar herramienta:**

```python
Tool(
    name="create_task",
    inputSchema={
        "properties": {
            # ... campos existentes
            "tags": {
                "type": "array",
                "items": {"type": "string"}
            }
        }
    }
)
```

**Uso:**
```
Usuario: Create a task "Fix navbar" with tags frontend and urgent
```

---

### Añadir Asignación de Usuarios

**Modelo:**
```python
{
    "id": "1",
    "title": "Task",
    "assignee": "john@example.com"
}
```

**UI:**
```tsx
{task.assignee && (
  <div className="flex items-center gap-1.5 text-xs">
    <Members className="size-3.5" />
    {task.assignee}
  </div>
)}
```

**Uso:**
```
Usuario: Assign task 1 to sarah@example.com
```

---

### Añadir Subtareas

**Modelo:**
```python
{
    "id": "1",
    "title": "Parent Task",
    "subtasks": [
        {"id": "1.1", "title": "Subtask 1", "completed": false},
        {"id": "1.2", "title": "Subtask 2", "completed": true}
    ]
}
```

**UI:**
```tsx
{task.subtasks && (
  <div className="mt-2 pl-6 space-y-1">
    {task.subtasks.map(sub => (
      <div key={sub.id} className="flex items-center gap-2 text-sm">
        {sub.completed ? <CheckCircle /> : <Circle />}
        <span>{sub.title}</span>
      </div>
    ))}
  </div>
)}
```

---

## 📊 Casos de Uso Avanzados

### 1. Filtros

```
Usuario: Show me only high priority tasks
Usuario: Show tasks due this week
Usuario: Show completed tasks
```

Implementar herramienta:
```python
Tool(
    name="filter_tasks",
    inputSchema={
        "properties": {
            "priority": {"type": "string"},
            "status": {"type": "string"},
            "date_range": {"type": "string"}
        }
    }
)
```

### 2. Estadísticas

```
Usuario: Show me my productivity stats
```

Widget con gráficos:
- Tareas completadas vs pendientes
- Distribución por prioridad
- Tendencia semanal

### 3. Recordatorios

```
Usuario: Remind me about task 1 in 2 hours
```

Integrar con notificaciones del sistema o email

---

## 🧪 Testing Manual

### Checklist de Pruebas

- [ ] Ver tareas sin datos (lista vacía)
- [ ] Ver tareas con datos
- [ ] Crear tarea mínima (solo título)
- [ ] Crear tarea completa (todos los campos)
- [ ] Completar tarea
- [ ] Descompletar tarea
- [ ] Widget se actualiza después de cada acción
- [ ] Fechas se muestran correctamente
- [ ] Prioridades tienen colores correctos
- [ ] Modo oscuro funciona correctamente
- [ ] Widget es responsive (móvil/desktop)

---

## 🚀 Próximas Funcionalidades

Ideas para expandir:

1. **Búsqueda**: "Find tasks containing 'design'"
2. **Ordenamiento**: "Sort tasks by priority"
3. **Archivado**: "Archive completed tasks"
4. **Duplicación**: "Duplicate task 1"
5. **Plantillas**: "Create task from template"
6. **Comentarios**: "Add comment to task 1"
7. **Adjuntos**: "Attach file to task"
8. **Historial**: "Show task history"

---

## 💡 Tips

- **Lenguaje natural**: ChatGPT entiende variaciones en el lenguaje
- **Contexto**: Puedes referirte a tareas por título, no solo por ID
- **Lotes**: Puedes pedir múltiples acciones en un mensaje
- **Confirmación**: Siempre verás el widget actualizado después de cambios

¡Experimenta y diviértete! 🎉

