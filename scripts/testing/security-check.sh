echo "🛡️ Starting Security Checks..."
echo "Checking smart contracts for vulnerabilities..."
cd contracts
clarinet.exe check
if [ $? -ne 0 ]; then
  echo "❌ FAIL: Clarinet check found issues"
  exit 1
else
  echo "✅ PASS: Clarinet check successful"
fi
cd ..
echo "Running npm audit for security vulnerabilities..."
npm audit --audit-level=high
if [ $? -ne 0 ]; then
  echo "⚠️ WARNING: npm audit found high-severity issues"
else
  echo "✅ PASS: No high-severity vulnerabilities found in dependencies"
fi
echo "Security Checks Completed!"
