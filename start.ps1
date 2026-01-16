# Script de démarrage propre pour ClubHub
# Ce script tue tous les processus Node existants et démarre les serveurs correctement

Write-Host "🧹 Nettoyage des processus Node.js existants..." -ForegroundColor Yellow
taskkill /f /im node.exe 2>$null
Start-Sleep -Seconds 2

Write-Host "✅ Processus nettoyés" -ForegroundColor Green
Write-Host ""

# Démarrer le backend
Write-Host "🚀 Démarrage du backend (API)..." -ForegroundColor Cyan
$backendPath = Join-Path $PSScriptRoot "api"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; npm run dev"
Start-Sleep -Seconds 5

# Démarrer le frontend
Write-Host "🎨 Démarrage du frontend (Vite)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm run dev"

Write-Host ""
Write-Host "✅ Serveurs démarrés !" -ForegroundColor Green
Write-Host "📊 Backend: http://localhost:5002" -ForegroundColor White
Write-Host "🌐 Frontend: http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "Attendez 10 secondes que les serveurs demarrent completement" -ForegroundColor Yellow
Write-Host "Ne fermez PAS cette fenetre" -ForegroundColor Yellow
