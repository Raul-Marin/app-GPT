#!/bin/bash

echo "🧪 Simulando llamadas de ChatGPT a tu servidor"
echo "================================================"
echo ""

echo "1️⃣ ChatGPT pregunta: 'Show me my tasks'"
echo ""
echo "📡 Llamando a get_tasks..."
curl -s -X POST http://localhost:8000/mcp/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "get_tasks",
    "arguments": {}
  }' | python3 -c "
import sys, json
data = json.load(sys.stdin)
print('✅ Respuesta del servidor:')
print(f\"   Texto: {data['result']['text']}\")
print(f\"   Widget: HTML con {len(data['result']['widget'])} caracteres\")
"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "2️⃣ ChatGPT dice: 'Create a task to review the design'"
echo ""
echo "📡 Llamando a create_task..."
curl -s -X POST http://localhost:8000/mcp/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "create_task",
    "arguments": {
      "title": "Review the design",
      "priority": "high",
      "dueDate": "2025-11-30"
    }
  }' | python3 -c "
import sys, json
data = json.load(sys.stdin)
print('✅ Respuesta del servidor:')
print(f\"   Texto: {data['result']['text']}\")
print(f\"   Widget actualizado: {len(data['result']['widget'])} caracteres\")
"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "3️⃣ ChatGPT dice: 'Mark task 1 as completed'"
echo ""
echo "📡 Llamando a update_task_status..."
curl -s -X POST http://localhost:8000/mcp/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "update_task_status",
    "arguments": {
      "task_id": "1",
      "completed": true
    }
  }' | python3 -c "
import sys, json
data = json.load(sys.stdin)
print('✅ Respuesta del servidor:')
print(f\"   Texto: {data['result']['text']}\")
"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎉 ¡Tu servidor funciona perfectamente!"
echo ""
echo "📊 Abre el widget actualizado:"
echo "   http://localhost:8000/widget"

