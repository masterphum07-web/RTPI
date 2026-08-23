$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
  Write-Host 'ไม่พบ Python 3.11 — ดาวน์โหลดจาก https://www.python.org/downloads/ แล้วติ๊ก Add Python to PATH' -ForegroundColor Red
  Read-Host 'กด Enter เพื่อปิด'
  exit 1
}

if (-not (Test-Path '.venv\Scripts\python.exe')) {
  Write-Host 'กำลังสร้างสภาพแวดล้อม OCR ครั้งแรก...' -ForegroundColor Cyan
  python -m venv .venv
}

$py = Join-Path $PSScriptRoot '.venv\Scripts\python.exe'
& $py -m pip install --upgrade pip
& $py -m pip install -r requirements.txt
Write-Host 'OCR พร้อมใช้งานที่ http://127.0.0.1:7860' -ForegroundColor Green
Write-Host 'เปิดหน้านี้ค้างไว้ แล้วใช้งานแท็บ รูป → ตาราง ในหน้าแอดมิน' -ForegroundColor Yellow
& $py -m uvicorn app:app --host 127.0.0.1 --port 7860
