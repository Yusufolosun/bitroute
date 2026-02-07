#!/bin/bash

# Uptime monitoring script for BitRoute

FRONTEND_URL="https://bitroute.io"
CONTRACT_ADDRESS="SP2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND"
STACKS_API="https://api.mainnet.hiro.so"
ALERT_WEBHOOK="" # Discord/Slack webhook for alerts

echo "🔍 BitRoute Uptime Check - $(date)"

# 1. Check Frontend
echo "Checking frontend..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $FRONTEND_URL)

if [ "$FRONTEND_STATUS" != "200" ]; then
  echo "❌ Frontend DOWN (Status: $FRONTEND_STATUS)"
  # Send alert
  curl -X POST $ALERT_WEBHOOK \
    -H 'Content-Type: application/json' \
    -d "{\"content\":\"🚨 BitRoute Frontend DOWN! Status: $FRONTEND_STATUS\"}"
else
  echo "✅ Frontend UP"
fi

# 2. Check Stacks API
echo "Checking Stacks API..."
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$STACKS_API/v2/info")

if [ "$API_STATUS" != "200" ]; then
  echo "❌ Stacks API DOWN (Status: $API_STATUS)"
  curl -X POST $ALERT_WEBHOOK \
    -H 'Content-Type: application/json' \
    -d "{\"content\":\"🚨 Stacks API DOWN! Status: $API_STATUS\"}"
else
  echo "✅ Stacks API UP"
fi

# 3. Check Contract Accessibility
echo "Checking contract..."
CONTRACT_CHECK=$(curl -s "$STACKS_API/v2/contracts/interface/$CONTRACT_ADDRESS/router")

if echo "$CONTRACT_CHECK" | grep -q "functions"; then
  echo "✅ Contract accessible"
else
  echo "❌ Contract NOT accessible"
  curl -X POST $ALERT_WEBHOOK \
    -H 'Content-Type: application/json' \
    -d "{\"content\":\"🚨 BitRoute contract not accessible!\"}"
fi

# 4. Test Quote Function
echo "Testing quote function..."
QUOTE_TEST=$(curl -s -X POST "$STACKS_API/v2/contracts/call-read/$CONTRACT_ADDRESS/router/get-best-route" \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "'$CONTRACT_ADDRESS'",
    "arguments": [
      "0x0616...",
      "0x0616...",
      "0x0000000000000000000000000000000005f5e100"
    ]
  }')

if echo "$QUOTE_TEST" | grep -q "result"; then
  echo "✅ Quote function working"
else
  echo "❌ Quote function FAILED"
  curl -X POST $ALERT_WEBHOOK \
    -H 'Content-Type: application/json' \
    -d "{\"content\":\"🚨 BitRoute quote function failed!\"}"
fi

echo "✅ Uptime check complete"
