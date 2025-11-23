#!/bin/bash

echo "🧪 Testeando Protocolo MCP..."
echo ""

# Test 1: Initialize
echo "1️⃣ Test Initialize..."
curl -s -X POST https://app-gpt-s9jl.onrender.com/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {}
  }' | python3 -m json.tool
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 2: List Tools
echo "2️⃣ Test List Tools..."
curl -s -X POST https://app-gpt-s9jl.onrender.com/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/list",
    "params": {}
  }' | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(json.dumps(data, indent=2))
if 'result' in data and 'tools' in data['result']:
    print(f\"\\n✅ {len(data['result']['tools'])} herramientas encontradas\")
"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 3: Call Tool
echo "3️⃣ Test Call Tool (get_tasks)..."
curl -s -X POST https://app-gpt-s9jl.onrender.com/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "get_tasks",
      "arguments": {}
    }
  }' | python3 -c "
import sys, json
data = json.load(sys.stdin)
if 'result' in data and 'content' in data['result']:
    for item in data['result']['content']:
        if item['type'] == 'text':
            print(f\"✅ Texto: {item['text']}\")
        elif item['type'] == 'resource':
            print(f\"✅ Widget: {len(item['resource']['text'])} caracteres\")
"

echo ""
echo "🎉 Test completado!"

