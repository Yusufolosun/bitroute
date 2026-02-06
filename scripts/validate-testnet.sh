#!/bin/bash

# BitRoute Testnet Validation Script
# This script validates the deployed router contract on Stacks testnet

set -e  # Exit on error

echo "🧪 BitRoute Testnet Validation"
echo "================================"
echo ""

# Configuration
CONTRACT_ADDRESS="${CONTRACT_ADDRESS:-ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND.router}"
API_URL="https://api.testnet.hiro.so"

echo "Contract Address: $CONTRACT_ADDRESS"
echo "API Endpoint: $API_URL"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run a test
run_test() {
  local test_name="$1"
  local test_command="$2"
  
  echo -n "Testing: $test_name... "
  
  if eval "$test_command" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((TESTS_PASSED++))
  else
    echo -e "${RED}✗ FAILED${NC}"
    ((TESTS_FAILED++))
  fi
}

# Function to call read-only function
call_readonly() {
  local function_name="$1"
  local args="$2"
  
  curl -s -X POST "$API_URL/v2/contracts/call-read/$CONTRACT_ADDRESS/$function_name" \
    -H "Content-Type: application/json" \
    -d "{
      \"sender\": \"$CONTRACT_ADDRESS\",
      \"arguments\": $args
    }"
}

# Test 1: Contract exists and is deployed
echo -e "${YELLOW}1. Checking contract deployment...${NC}"
CONTRACT_INFO=$(curl -s "$API_URL/v2/contracts/source/$CONTRACT_ADDRESS")
if echo "$CONTRACT_INFO" | grep -q "source"; then
  echo -e "${GREEN}✓ Contract is deployed${NC}"
  ((TESTS_PASSED++))
else
  echo -e "${RED}✗ Contract not found${NC}"
  ((TESTS_FAILED++))
  exit 1
fi
echo ""

# Test 2: Test get-best-route with STX/USDA
echo -e "${YELLOW}2. Testing get-best-route function...${NC}"
echo "   Input: 100 STX → USDA"
ROUTE_RESULT=$(call_readonly "get-best-route" '[
  "0x0616537033480b4330504650455643563746e5a36515352575051324a45394535423650335041304b42523907746f6b656e2d77737478",
  "0x0616537033480b4330504650455643563746e5a36515352575051324a45394535423650335041304b42523909746f6b656e2d775573646182",
  "0x0000000000000000000000000000000005f5e100"
]')

if echo "$ROUTE_RESULT" | grep -q "best-dex"; then
  echo -e "${GREEN}✓ get-best-route returns valid data${NC}"
  ((TESTS_PASSED++))
  echo "   Response: $ROUTE_RESULT" | head -c 200
  echo "..."
else
  echo -e "${RED}✗ get-best-route failed${NC}"
  ((TESTS_FAILED++))
fi
echo ""

# Test 3: Check if contract is paused
echo -e "${YELLOW}3. Checking contract pause status...${NC}"
PAUSE_STATUS=$(call_readonly "is-paused" '[]')
if echo "$PAUSE_STATUS" | grep -q "false"; then
  echo -e "${GREEN}✓ Contract is not paused (active)${NC}"
  ((TESTS_PASSED++))
else
  echo -e "${YELLOW}! Contract might be paused${NC}"
fi
echo ""

# Test 4: Check DEX volume tracking
echo -e "${YELLOW}4. Testing DEX volume tracking...${NC}"
ALEX_VOLUME=$(call_readonly "get-dex-volume" '["0x0000000000000000000000000000000000000001"]')
VELAR_VOLUME=$(call_readonly "get-dex-volume" '["0x0000000000000000000000000000000000000002"]')

if echo "$ALEX_VOLUME" | grep -q "ok"; then
  echo -e "${GREEN}✓ ALEX volume query works${NC}"
  ((TESTS_PASSED++))
else
  echo -e "${RED}✗ ALEX volume query failed${NC}"
  ((TESTS_FAILED++))
fi

if echo "$VELAR_VOLUME" | grep -q "ok"; then
  echo -e "${GREEN}✓ Velar volume query works${NC}"
  ((TESTS_PASSED++))
else
  echo -e "${RED}✗ Velar volume query failed${NC}"
  ((TESTS_FAILED++))
fi
echo ""

# Test 5: Check recent transactions
echo -e "${YELLOW}5. Checking contract transaction history...${NC}"
TX_HISTORY=$(curl -s "$API_URL/extended/v1/address/$CONTRACT_ADDRESS/transactions?limit=5")
TX_COUNT=$(echo "$TX_HISTORY" | grep -o '"tx_id"' | wc -l)

echo "   Recent transactions: $TX_COUNT"
if [ "$TX_COUNT" -gt 0 ]; then
  echo -e "${GREEN}✓ Contract has transaction history${NC}"
  ((TESTS_PASSED++))
else
  echo -e "${YELLOW}! No transactions yet (expected for new deployment)${NC}"
fi
echo ""

# Test 6: Verify network connectivity
echo -e "${YELLOW}6. Testing network connectivity...${NC}"
NETWORK_INFO=$(curl -s "$API_URL/v2/info")
if echo "$NETWORK_INFO" | grep -q "testnet"; then
  echo -e "${GREEN}✓ Connected to Stacks testnet${NC}"
  ((TESTS_PASSED++))
else
  echo -e "${RED}✗ Network connectivity issue${NC}"
  ((TESTS_FAILED++))
fi
echo ""

# Summary
echo "================================"
echo -e "${YELLOW}Test Summary:${NC}"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All tests passed! Router contract is ready for use.${NC}"
  exit 0
else
  echo -e "${RED}⚠️  Some tests failed. Please review the errors above.${NC}"
  exit 1
fi
