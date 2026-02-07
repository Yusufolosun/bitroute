Write-Host "🛡️ Starting Security Checks..." -ForegroundColor Cyan

# 1. Contract Static Analysis
Write-Host "Checking smart contracts for vulnerabilities..." -ForegroundColor Yellow
Push-Location contracts
& clarinet check
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ FAIL: Clarinet check found issues" -ForegroundColor Red
    Pop-Location
    exit 1
} else {
    Write-Host "✅ PASS: Clarinet check successful" -ForegroundColor Green
}
Pop-Location

# 2. NPM Audit
Write-Host "Running npm audit for security vulnerabilities..." -ForegroundColor Yellow
npm audit --audit-level=high
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ WARNING: npm audit found high-severity issues" -ForegroundColor Yellow
} else {
    Write-Host "✅ PASS: No high-severity vulnerabilities found in dependencies" -ForegroundColor Green
}

Write-Host "Security Checks Completed!" -ForegroundColor Cyan
