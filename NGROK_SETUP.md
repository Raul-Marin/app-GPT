# 🚀 Configuración de ngrok para ChatGPT

## ✅ Estado Actual

- ✅ ngrok instalado en `~/bin/ngrok`
- ✅ Servidor Python corriendo en http://localhost:8000
- ✅ Servidor de assets corriendo en http://localhost:4444

---

## 📋 Configuración Paso a Paso

### 1️⃣ Crear Cuenta en ngrok (GRATIS)

1. Ve a: **https://dashboard.ngrok.com/signup**
2. Regístrate con:
   - Email
   - Google
   - GitHub

### 2️⃣ Obtener tu AuthToken

Una vez registrado:

1. Ve a: **https://dashboard.ngrok.com/get-started/your-authtoken**
2. Copia tu authtoken (se ve así: `2abc...xyz123`)
3. Ejecuta en tu terminal:

```bash
~/bin/ngrok config add-authtoken TU_TOKEN_AQUÍ
```

### 3️⃣ Iniciar ngrok

En una **nueva terminal**, ejecuta:

```bash
~/bin/ngrok http 8000
```

Verás algo como:

```
ngrok

Session Status                online
Account                       tu@email.com
Version                       3.33.0
Region                        United States (us)
Latency                       45ms
Web Interface                 http://127.0.0.1:4040

Forwarding                    https://abc-123-xyz.ngrok-free.app -> http://localhost:8000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

### 4️⃣ Copiar tu URL Pública

Busca la línea que dice **"Forwarding"**:
```
Forwarding  https://abc-123-xyz.ngrok-free.app -> http://localhost:8000
```

**Tu URL pública es:** `https://abc-123-xyz.ngrok-free.app`

---

## 🤖 Configurar en ChatGPT

### Paso 1: Ir a Configuración

1. Abre **ChatGPT**
2. Click en tu **perfil** (esquina inferior izquierda)
3. Click en **Settings** (⚙️)

### Paso 2: Añadir Connector

1. En el menú lateral, busca **"Connectors"** o **"Integrations"**
2. Click en **"Add Connector"** o **"+"**
3. Completa el formulario:

```
Name: Task Manager
URL: https://TU-URL-DE-NGROK.ngrok-free.app/mcp
Description: Mi gestor de tareas personal
```

**⚠️ IMPORTANTE:** Añade `/mcp` al final de tu URL de ngrok

Ejemplo completo:
```
https://abc-123-xyz.ngrok-free.app/mcp
```

4. Click en **"Save"** o **"Add"**

### Paso 3: Activar en Conversación

1. Inicia una **nueva conversación** en ChatGPT
2. Click en el botón **"More"** (⋯) o similar
3. Selecciona **"Task Manager"** de la lista
4. Verás que el connector está **activo** ✅

---

## 💬 Prueba tu App

Ahora puedes hablar con ChatGPT usando lenguaje natural:

### Comandos de Ejemplo:

```
🔍 Ver tareas:
   "Show me my tasks"
   "What do I need to do?"
   "List all my pending tasks"

➕ Crear tareas:
   "Create a task to review the design"
   "Add a task: prepare presentation for tomorrow"
   "Create a high priority task to fix bug #123"

✅ Completar tareas:
   "Mark task 1 as completed"
   "Complete the design review task"
   "Mark the first task as done"

📊 Estado:
   "What's my task status?"
   "How many tasks do I have?"
```

ChatGPT entenderá tu intención, llamará a tu servidor, y te mostrará:
- ✅ Respuesta en texto
- 🎨 Widget visual interactivo

---

## 🐛 Solución de Problemas

### Error: "Failed to connect"

1. Verifica que ngrok esté corriendo:
```bash
ps aux | grep ngrok
```

2. Verifica que tu servidor esté corriendo:
```bash
curl http://localhost:8000/health
```

3. Reinicia ngrok:
```bash
# Mata el proceso
pkill ngrok

# Inicia de nuevo
~/bin/ngrok http 8000
```

### Error: "Tunnel not found"

- ngrok requiere conexión a Internet
- Verifica tu firewall
- Prueba con otra región: `~/bin/ngrok http 8000 --region=us`

### La URL de ngrok cambió

La URL gratuita de ngrok **cambia cada vez que lo reinicias**.

**Solución:**
1. Copia la nueva URL de ngrok
2. Ve a ChatGPT Settings → Connectors
3. Edita tu connector
4. Actualiza la URL

**Solución permanente** (pago):
- Suscríbete al plan básico de ngrok ($8/mes)
- Tendrás una URL fija que nunca cambia

---

## 🎯 Verificar que Todo Funciona

### 1. Verifica el servidor:
```bash
curl http://localhost:8000/health
```
Debe responder: `{"status":"healthy","tasks_count":3}`

### 2. Verifica ngrok:
Abre en tu navegador: **http://127.0.0.1:4040**

Verás el **panel de ngrok** con todas las peticiones en tiempo real.

### 3. Prueba la URL pública:
```bash
curl https://TU-URL-DE-NGROK.ngrok-free.app/health
```
Debe responder lo mismo que localhost.

### 4. Prueba en ChatGPT:
Pregunta: **"Show me my tasks"**

Deberías ver:
- ✅ Texto: "Tienes 2 tareas pendientes y 1 completada"
- 🎨 Widget visual con tus tareas

---

## 🌟 Próximos Pasos

Una vez funcionando:

1. 🎨 **Personaliza el widget** en `src/task-manager/App.tsx`
2. ➕ **Añade más herramientas** en `server_python/main.py`
3. 🗄️ **Conecta una base de datos** real
4. 🚀 **Despliega en producción** (Render, Railway, etc.)

---

## 📞 Necesitas Ayuda?

Si tienes problemas:

1. Lee los logs de ngrok en la terminal
2. Revisa el panel web: http://127.0.0.1:4040
3. Verifica los logs del servidor Python
4. Prueba la URL de ngrok en tu navegador primero

---

## 🎉 ¡Disfruta tu App!

Una vez configurado, tendrás tu gestor de tareas personal integrado en ChatGPT.

ChatGPT entenderá comandos en lenguaje natural y mostrará widgets visuales interactivos.

**¡Es magia!** 🪄✨

