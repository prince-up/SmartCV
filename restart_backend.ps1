# Kill existing backend process
Write-Host "Stopping existing backend server..." -ForegroundColor Yellow
Get-Process -Name "python" -ErrorAction SilentlyContinue | Where-Object {$_.Path -like "*smartcv*"} | Stop-Process -Force

# Wait a moment
Start-Sleep -Seconds 2

# Start backend server
Write-Host "Starting backend server..." -ForegroundColor Green
Set-Location "c:\Users\lucky\OneDrive\Pictures\Desktop\smartcv\backend"
Start-Process -FilePath ".\venv\Scripts\python.exe" -ArgumentList "-m", "uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000" -NoNewWindow

Write-Host "Backend server restarted successfully!" -ForegroundColor Green
Write-Host "API running at http://localhost:8000" -ForegroundColor Cyan
