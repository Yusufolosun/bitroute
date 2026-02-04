#!/bin/bash

# Test script to verify all router.clar contract functions
echo "========================================="
echo "Testing BitRoute Router Contract"
echo "========================================="
echo ""

# Test 1: Run Clarinet test suite
echo "📋 Running Clarinet test suite..."
clarinet test --allow-wallets

echo ""
echo "========================================="
echo "✅ All tests completed!"
echo "========================================="
