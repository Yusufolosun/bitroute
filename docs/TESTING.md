# Testing Guide

Comprehensive guide for testing BitRoute contracts and frontend.

## Table of Contents

1. [Contract Testing](#contract-testing)
2. [Frontend Testing](#frontend-testing)
3. [Integration Testing](#integration-testing)
4. [Manual Testing](#manual-testing)

---

## Contract Testing

### Setup
```bash
cd contracts
npm install
```

### Running Tests
```bash
# Run all tests
clarinet test

# Run specific test file
clarinet test tests/router_test.clar

# Verbose output
clarinet test --verbose
```

### Test Structure
```clarity
;; tests/router_test.clar

(define-public (test-get-best-route-returns-data)
  (let (
    (result (contract-call? .router get-best-route 
              'SP...token-a
              'SP...token-b
              u1000))
  )
  (begin
    (asserts! (is-ok result) (err u1))
    (ok true)
  ))
)
```

### Current Test Coverage
```
✓ test-get-best-route-returns-data
✓ test-execute-auto-swap-validates-amount
✓ test-paused-contract-blocks-swaps
✓ test-unauthorized-pause-rejected
✓ test-volume-tracking-updates
✓ test-slippage-protection-enforced

Coverage: 6/6 tests passing
```

### Writing New Tests

1. **Create test file**: `tests/your-feature_test.clar`

2. **Define test function**:
```clarity
(define-public (test-your-feature)
  (begin
    ;; Setup
    ;; Execute
    ;; Assert
    (ok true)
  ))
```

3. **Run test**:
```bash
clarinet test tests/your-feature_test.clar
```

---

## Frontend Testing

### Setup
```bash
cd frontend
npm install
```

### Unit Tests (To be implemented)
```bash
npm test
```

### Component Testing Template
```typescript
// __tests__/SwapForm.test.tsx
import { render, screen } from '@testing-library/react';
import SwapForm from '@/components/SwapForm';

describe('SwapForm', () => {
  it('renders token selectors', () => {
    render();
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('To')).toBeInTheDocument();
  });
  
  it('validates amount input', () => {
    // Test implementation
  });
});
```

---

## Integration Testing

### Testnet Integration Flow

1. **Deploy Contract**
```bash
cd contracts
clarinet deployments apply --testnet
```

2. **Get Testnet STX**
- Visit faucet
- Request tokens
- Verify balance

3. **Configure Frontend**
```env
NEXT_PUBLIC_NETWORK=testnet
```

4. **Test User Flow**
- Connect wallet
- Select tokens
- Get quote
- Execute swap
- Verify transaction

### Test Checklist

- [ ] Wallet connects successfully
- [ ] Token selection works
- [ ] Amount validation prevents invalid inputs
- [ ] Quote returns expected data
- [ ] Swap triggers wallet popup
- [ ] Transaction broadcasts successfully
- [ ] Status updates correctly
- [ ] History updates
- [ ] Error states display properly

---

## Manual Testing

### Test Scenarios

#### Scenario 1: Happy Path Swap

1. Open app in browser
2. Connect Leather wallet (testnet)
3. Select STX → USDA
4. Enter 100 STX
5. Click "Get Best Price"
6. Verify quote shows ALEX as best
7. Click "Swap Tokens"
8. Approve in wallet
9. Wait for confirmation
10. Verify success message

**Expected**: Transaction succeeds, history updates

#### Scenario 2: Slippage Protection

1. Get quote for 100 STX
2. Set slippage to 0.1%
3. Wait 30 seconds (quote becomes stale)
4. Try to swap
5. Should fail with slippage error

**Expected**: Transaction rejected, error displayed

#### Scenario 3: Insufficient Balance

1. Try to swap 1,000,000 STX (more than balance)
2. Wallet should show insufficient funds

**Expected**: Wallet prevents transaction

#### Scenario 4: Network Switch

1. Connect on testnet
2. Get quote
3. Switch wallet to mainnet
4. Try to swap

**Expected**: Error about network mismatch

#### Scenario 5: Contract Paused

1. (As admin) Pause contract
2. Try to execute swap
3. Should fail with "contract paused" error

**Expected**: Transaction rejected

---

## Performance Testing

### Load Testing (Future)

Test contract with high volume:
```bash
# Simulate 100 swaps
for i in {1..100}; do
  clarinet console -c "(contract-call? .router execute-auto-swap ...)"
done
```

### Gas Optimization

Monitor gas costs:
```clarity
;; Check transaction cost
(print (stx-get-balance tx-sender))
;; Execute swap
;; Check balance again
```

Target: <0.003 STX per swap

---

## Regression Testing

### Before Each Release

1. Run all contract tests
2. Deploy to testnet
3. Manual test all user flows
4. Check for console errors
5. Test on multiple browsers
6. Test mobile responsive
7. Verify network switching
8. Test error scenarios

### Automated Regression Suite (Future)
```bash
# Run full test suite
npm run test:all

# Contract tests
npm run test:contracts

# Frontend tests
npm run test:frontend

# E2E tests
npm run test:e2e
```

---

## Debugging Tips

### Contract Debugging
```clarity
;; Add print statements
(print "Amount in:")
(print amount-in)

;; Check with clarinet console
>> (contract-call? .router get-best-route ...)
```

### Frontend Debugging
```typescript
// Add console logs
console.log('🔍 Token addresses:', { tokenIn, tokenOut });

// Check network requests
// Open browser DevTools → Network tab

// Inspect contract responses
console.log('📦 Raw result:', result);
```

### Common Issues

**Issue**: Tests fail locally
- **Fix**: Clear cache: `rm -rf .cache`

**Issue**: Contract call fails
- **Fix**: Check contract address in constants.ts

**Issue**: Transaction rejected
- **Fix**: Increase slippage tolerance

---

## CI/CD Testing (Future)

### GitHub Actions Workflow
```yaml
name: Tests

on: [push, pull_request]

jobs:
  contract-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install Clarinet
        run: |
          wget https://github.com/hirosystems/clarinet/releases/...
      - name: Run tests
        run: clarinet test

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install
        run: npm install
      - name: Test
        run: npm test
```

---

## Test Data

### Mock Tokens
```typescript
const MOCK_TOKENS = {
  STX: 'ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND.stx-token',
  USDA: 'ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND.usda-token',
};
```

### Test Wallets

Never use real funds for testing!

**Testnet Addresses**:
- Deployer: ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND
- Wallet 1: ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5
- Wallet 2: ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG

---

## Reporting Bugs

When reporting test failures:

1. Include test output
2. Specify environment (OS, browser, versions)
3. Steps to reproduce
4. Expected vs actual behavior
5. Screenshots/logs

---

## Next Steps

- [ ] Add frontend unit tests
- [ ] Implement E2E tests with Playwright
- [ ] Set up CI/CD pipeline
- [ ] Add performance benchmarks
- [ ] Create test fixtures
