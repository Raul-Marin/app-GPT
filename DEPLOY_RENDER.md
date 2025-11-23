# 🚀 Deploy en Render - Guía Paso a Paso

## ✅ Requisitos
- Cuenta de GitHub (gratis)
- Cuenta de Render (gratis)

---

## 📋 PASO A PASO

### **PASO 1: Crear Cuenta en GitHub (si no tienes)**

1. Ve a: https://github.com/signup
2. Crea tu cuenta (gratis)
3. Verifica tu email

---

### **PASO 2: Crear Repositorio en GitHub**

1. Ve a: https://github.com/new
2. Completa:
   ```
   Repository name: task-manager-chatgpt
   Description: Task Manager App para ChatGPT con Apps SDK
   ✓ Public
   ☐ NO marcar "Add a README file"
   ```
3. Click **"Create repository"**

---

### **PASO 3: Subir Tu Código a GitHub**

Copia y pega estos comandos en tu terminal (UNO POR UNO):

```bash
# 1. Ve a tu proyecto
cd /Users/raulmarin/Desktop/apps-GPT

# 2. Inicializa git (si no está)
git init

# 3. Añade todos los archivos
git add .

# 4. Haz el primer commit
git commit -m "Task Manager App con Apps SDK"

# 5. Conecta con tu repo de GitHub
# ⚠️ REEMPLAZA "tu-usuario" con tu usuario de GitHub
git remote add origin https://github.com/tu-usuario/task-manager-chatgpt.git

# 6. Sube el código
git branch -M main
git push -u origin main
```

**Nota:** Te pedirá tu usuario y contraseña de GitHub.

---

### **PASO 4: Crear Cuenta en Render**

1. Ve a: https://render.com
2. Click **"Get Started for Free"**
3. **Sign up con GitHub** (más fácil)
4. Autoriza Render a acceder a tus repos

---

### **PASO 5: Deploy en Render**

1. En Render, click **"New +"** (arriba derecha)
2. Selecciona **"Web Service"**
3. Click **"Connect a repository"**
4. Si no ves tu repo:
   - Click **"Configure account"**
   - Selecciona tu usuario de GitHub
   - Marca tu repositorio **"task-manager-chatgpt"**
   - Click **"Install"**
5. Ahora verás tu repo, click **"Connect"**

---

### **PASO 6: Configurar el Deploy**

Completa el formulario:

```
Name: task-manager-chatgpt

Region: Oregon (us-west) o el más cercano

Branch: main

Root Directory: (dejar vacío)

Runtime: Python 3

Build Command:
pip install -r server_python/requirements.txt

Start Command:
uvicorn server_python.main:app --host 0.0.0.0 --port $PORT
```

Más abajo:

```
Instance Type: Free

Advanced:
  Environment Variables:
    Click "+ Add Environment Variable"
    Key: BASE_URL
    Value: https://task-manager-chatgpt.onrender.com
    (⚠️ Copia la URL que aparece arriba en "Your service will be live at")
```

---

### **PASO 7: Deploy!**

1. Scroll hasta abajo
2. Click **"Create Web Service"**
3. **Espera 2-5 minutos** mientras se deploya
4. Verás logs en tiempo real

---

### **PASO 8: Verificar que Funciona**

Una vez que veas "Build successful" y "Live":

1. Copia tu URL: `https://task-manager-chatgpt.onrender.com`
2. Abre en tu navegador: `https://task-manager-chatgpt.onrender.com/mcp`
3. Deberías ver un JSON con info del servidor

---

### **PASO 9: Configurar en ChatGPT**

1. Ve a **ChatGPT**: https://chatgpt.com
2. **Settings** → **Connectors**
3. **Add Connector**
4. Completa:
   ```
   Name: Task Manager
   URL: https://task-manager-chatgpt.onrender.com/mcp
   Autenticación: Sin autenticación
   ```
5. Marca el checkbox
6. **Save**

---

### **PASO 10: ¡Prueba tu App!**

En ChatGPT:

```
"Show me my tasks"
"Create a task to review the design by Friday"
"Mark task 1 as completed"
```

🎉 **¡Deberías ver tu widget funcionando!**

---

## 🔧 Actualizar tu App

Cuando hagas cambios en tu código:

```bash
cd /Users/raulmarin/Desktop/apps-GPT
git add .
git commit -m "Descripción de tus cambios"
git push
```

Render detectará los cambios y **re-deployará automáticamente**.

---

## 🐛 Troubleshooting

### Build falla:
- Revisa los logs en Render
- Verifica que `server_python/requirements.txt` exista
- Asegúrate de que todos los archivos estén en GitHub

### "Service Unavailable":
- Espera 1-2 minutos (el servidor de Render tarda en iniciar)
- Verifica los logs en Render

### ChatGPT no conecta:
- Verifica que la URL termine en `/mcp`
- Prueba la URL en tu navegador primero
- Asegúrate de que el servidor esté "Live" en Render

---

## 💰 Costo

**Plan Free de Render:**
- ✅ Totalmente GRATIS
- ✅ 750 horas/mes (suficiente para uso personal)
- ⚠️ El servidor se "duerme" después de 15 minutos de inactividad
- ⚠️ Tarda ~30 segundos en "despertar" la primera vez

**Para evitar que se duerma:**
- Upgrade a plan pago ($7/mes)
- O usa un servicio como UptimeRobot para hacer ping cada 10 min

---

## 🎉 ¡Listo!

Tu app está en producción y funciona con ChatGPT. 🚀

