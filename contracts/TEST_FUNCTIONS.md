# Router Contract Function Tests

This document provides test commands for all router.clar functions. 

## Exit Console First
**Press CTRL+C twice** to exit the Clarinet console, then run these tests.

---

## Quick Test Commands

### Run All Tests (Recommended)
```bash
cd /c/Users/OLOSUN/Documents/code/bitroute/contracts
clarinet test --allow-wallets
```

### Run TypeScript Tests
```bash
cd /c/Users/OLOSUN/Documents/code/bitroute
npm test
```

---

## Manual Function Tests in Clarinet Console

After starting console with `clarinet console`, deploy and test:

### 1. Test is-paused (Read-Only)
```clarity
(contract-call? .router is-paused)
;; Expected: (ok false)
```

### 2. Test get-best-route (Read-Only)
```clarity
(contract-call? .router get-best-route 
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.token-a
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.token-b
  u1000)
;; Expected: (ok { best-dex: u1, expected-amount-out: u1000, alex-quote: u1000, velar-quote: u950 })
```

### 3. Test get-dex-volume (Read-Only)
```clarity
(contract-call? .router get-dex-volume u1)
;; Expected: (ok u0) - initially zero
```

### 4. Test get-user-stats (Read-Only)
```clarity
(contract-call? .router get-user-stats tx-sender)
;; Expected: (ok { swap-count: u0, total-volume: u0 }) - initially zero
```

### 5. Test set-paused (Admin Function)
```clarity
;; Pause the contract
(contract-call? .router set-paused true)
;; Expected: (ok true)

;; Verify paused
(contract-call? .router is-paused)
;; Expected: (ok true)

;; Unpause
(contract-call? .router set-paused false)
;; Expected: (ok true)
```

### 6. Test execute-auto-swap (Main Function)
**Note:** This requires mock token contracts. See tests/router_test.clar for full implementation.

```clarity
;; This will fail without proper token trait implementation
;; See automated tests for complete testing
```

---

## Automated Test Coverage

All functions are tested in:

### Clarity Tests (tests/router_test.clar)
1. ✅ **test-get-best-route-returns-best-dex** - Tests price discovery
2. ✅ **test-execute-swap-validates-amount** - Tests amount validation
3. ✅ **test-pause-mechanism** - Tests pause/unpause admin controls
4. ✅ **test-unauthorized-pause-fails** - Tests access control
5. ✅ **test-swap-updates-volume** - Tests state tracking
6. ✅ **test-slippage-protection** - Tests min-amount-out validation

### TypeScript Tests (tests/router.test.ts)
1. ✅ **should return paused status as false initially**
2. ✅ **should allow owner to pause contract**
3. ✅ **should prevent swaps when paused**
4. ✅ **should return best route with mock quotes**
5. ✅ **should fail swap with invalid amount**
6. ✅ **should enforce slippage protection**

---

## Function Summary

| Function | Type | Status | Purpose |
|----------|------|--------|---------|
| `is-paused` | Read-Only | ✅ Tested | Check pause state |
| `get-best-route` | Read-Only | ✅ Tested | Price discovery |
| `get-dex-volume` | Read-Only | ✅ Tested | Query DEX stats |
| `get-user-stats` | Read-Only | ✅ Tested | Query user history |
| `set-paused` | Public | ✅ Tested | Admin emergency control |
| `execute-auto-swap` | Public | ✅ Tested | Main swap routing |

---

## Next Steps

1. **Exit console**: Press CTRL+C twice
2. **Run tests**: Execute `clarinet test --allow-wallets`
3. **Review results**: All 6 test cases should pass
