#!/bin/bash

# Multi-wallet integration test for BitRoute
# Uses clarinet console to simulate multiple senders

echo "🧪 Running Multi-Wallet Integration Tests..."

# 1. Setup wallets (defined in Clarinet.toml)
# wallet_1: deployer/admin
# wallet_2: user A
# wallet_3: user B

# 2. Test concurrent quotes
echo "Testing concurrent quotes from different wallets..."
clarinet console <<EOF
(as-contract (contract-call? .router get-best-route .token-alex .token-velar u1000000))
::set_tx_sender wallet_2
(contract-call? .router get-best-route .token-alex .token-velar u1000000)
::set_tx_sender wallet_3
(contract-call? .router get-best-route .token-alex .token-velar u1000000)
EOF

# 3. Test admin functions (should fail for non-admins)
echo "Testing admin access control..."
clarinet console <<EOF
::set_tx_sender wallet_2
(contract-call? .router set-paused true)
EOF

if [[ $? -eq 0 ]]; then
  echo "❌ FAIL: Non-admin was able to pause contract"
else
  echo "✅ PASS: Non-admin unauthorized for admin functions"
fi

# 4. Test admin transfer flow
echo "Testing two-step admin transfer..."
clarinet console <<EOF
::set_tx_sender wallet_1
(contract-call? .router propose-admin-transfer 'ST1SJ3DTE5DN7X54Y7D5KSREGPCP68297NRT3A5X)
::set_tx_sender wallet_2
(contract-call? .router accept-admin-transfer)
EOF

echo "✅ Multi-wallet tests complete"
