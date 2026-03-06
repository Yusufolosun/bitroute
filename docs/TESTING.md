# Testing Guide

## Quick Start

```bash
# Contract tests (10 tests)
cd contracts && npm test

# Frontend tests (4 tests)
cd frontend && npm test

# Both
npm run test:contracts && cd frontend && npm test
```

## Contract Tests

Framework: Clarinet SDK + Vitest (`vitest-environment-clarinet`)

### Test Files

| File | Tests | Covers |
|------|-------|--------|
| `tests/router.test.ts` | 4 | Core routing, swap execution, fee mechanism |
| `tests/router_test.clar` | 2 | get-best-route, execute-auto-swap basics |
| `tests/security_test.clar` | 2 | Pause authorization, admin access control |
| `tests/edge-cases_test.clar` | 2 | Zero amount, slippage protection |

### Test Tokens

- `mock-token.clar` — SIP-010 token A (also defines `ft-trait`)
- `mock-token-b.clar` — SIP-010 token B (different token for swap testing)

Both are test-only. The router is the single production contract.

### Running

```bash
cd contracts
npm test              # All tests
npx vitest run tests/router.test.ts  # Specific file
```

## Frontend Tests

Framework: Vitest + jsdom + @testing-library/react

### Test Files

| File | Tests | Covers |
|------|-------|--------|
| `src/__tests__/SwapForm.test.tsx` | 4 | Rendering, quote display, fee breakdown, DEX name |

### Running

```bash
cd frontend
npm test
```

## Testnet Integration

1. Deploy: `cd contracts && clarinet deployments apply --testnet`
2. Get STX: https://explorer.hiro.so/sandbox/faucet?chain=testnet
3. Set `NEXT_PUBLIC_NETWORK=testnet` in `.env`
4. Test: connect wallet → select tokens → get quote → execute swap

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
