# Script de inicio para Windows PowerShell

Write-Host "🚀 Iniciando Task Manager App..." -ForegroundColor Cyan
Write-Host ""

# Verificar si node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  node_modules no encontrado. Instalando dependencias..." -ForegroundColor Yellow
    npm install
}

# Verificar si .venv existe
if (-not (Test-Path ".venv")) {
    Write-Host "⚠️  .venv no encontrado. Creando entorno virtual..." -ForegroundColor Yellow
    python -m venv .venv
    .\.venv\Scripts\Activate.ps1
    pip install -r server_python\requirements.txt
} else {
    .\.venv\Scripts\Activate.ps1
}

# Verificar si dist existe
if (-not (Test-Path "dist")) {
    Write-Host "⚠️  dist\ no encontrado. Compilando componentes..." -ForegroundColor Yellow
    npm run build
}

Write-Host ""
Write-Host "✓ Dependencias verificadas" -ForegroundColor Green
Write-Host ""
Write-Host "Iniciando servicios..." -ForegroundColor Blue
Write-Host ""
Write-Host "1. Servidor de assets: http://localhost:4444" -ForegroundColor Green
Write-Host "2. Servidor MCP: http://localhost:8000" -ForegroundColor Green
Write-Host ""
Write-Host "Presiona Ctrl+C para detener todos los servicios" -ForegroundColor Yellow
Write-Host ""

# Iniciar servicios en paralelo
$job1 = Start-Job -ScriptBlock { npm run serve }
Start-Sleep -Seconds 2
$job2 = Start-Job -ScriptBlock { npm run server:python }

# Esperar y mostrar output
try {
    while ($true) {
        Receive-Job -Job $job1
        Receive-Job -Job $job2
        Start-Sleep -Seconds 1
    }
} finally {
    Write-Host ""
    Write-Host "Deteniendo servicios..." -ForegroundColor Yellow
    Stop-Job -Job $job1
    Stop-Job -Job $job2
    Remove-Job -Job $job1
    Remove-Job -Job $job2
}

