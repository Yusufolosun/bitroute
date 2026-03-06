# BitRoute API Reference

Contract: `router.clar`

## Read-Only Functions

### get-best-route

Compare quotes from ALEX and Velar to find the best price.

```clarity
(get-best-route (token-in principal) (token-out principal) (amount-in uint))
```

**Returns:**
```clarity
(ok {
  best-dex: uint,            ;; 1 = ALEX, 2 = Velar
  expected-amount-out: uint,  ;; Best quote (micro-units)
  alex-quote: uint,
  velar-quote: uint
})
```

### get-protocol-fee

Query current protocol fee in basis points.

```clarity
(get-protocol-fee) ;; => (ok u30) means 0.30%
```

### get-fee-balance

Query accumulated protocol fees for a token.

```clarity
(get-fee-balance (token principal)) ;; => (ok u50000)
```

### is-paused

```clarity
(is-paused) ;; => (ok false)
```

### get-dex-volume

```clarity
(get-dex-volume (dex-id uint)) ;; => (ok u1000000)
```

### get-user-stats

```clarity
(get-user-stats (user principal))
;; => (ok { swap-count: u10, total-volume: u5000000000 })
```

---

## Public Functions

### execute-auto-swap

Execute a token swap on the best available DEX. Deducts a protocol fee (in basis points) from the input amount before routing.

```clarity
(execute-auto-swap
    (token-in <ft-trait>)
    (token-out <ft-trait>)
    (amount-in uint)
    (min-amount-out uint))
```

**Returns:**
```clarity
(ok {
  dex-used: uint,       ;; 1 = ALEX, 2 = Velar
  amount-out: uint,     ;; Actual output received
  fee-charged: uint     ;; Protocol fee deducted from input
})
```

**Validation checks:**
- Contract must not be paused (`u103`)
- `amount-in` must be > 0 (`u102`) and < 1,000,000,000,000 (`u107`)
- `token-in` and `token-out` must differ (`u108`)
- `min-amount-out` must be <= `amount-in` (`u109`)
- Output must meet `min-amount-out` (`u101`)

### set-protocol-fee (admin)

Update the protocol fee. Bounded by `MAX-FEE-BPS` (100 = 1.00%).

```clarity
(set-protocol-fee (new-fee-bps uint)) ;; => (ok true)
```

### collect-fees (admin)

Withdraw accumulated protocol fees for a token.

```clarity
(collect-fees (token <ft-trait>) (recipient principal)) ;; => (ok u50000)
```

### set-paused (admin)

Emergency pause or unpause the contract.

```clarity
(set-paused (paused bool)) ;; => (ok true)
```

### init-alex-pools (admin)

Initialize default ALEX pool factor mappings. Call once after deployment.

```clarity
(init-alex-pools) ;; => (ok true)
```

### add-alex-pool (admin)

Register a new ALEX pool factor pair.

```clarity
(add-alex-pool (token-x principal) (token-y principal) (factor-x uint) (factor-y uint))
```

### emergency-recover-token (admin)

Recover stuck tokens. Only callable when contract is paused.

```clarity
(emergency-recover-token (token <ft-trait>) (amount uint) (recipient principal))
```

### propose-admin-transfer / accept-admin-transfer

Two-step admin transfer. Note: `CONTRACT-OWNER` is a constant, so actual transfer requires redeployment.

---

## Error Codes

| Code | Constant | Description |
|------|----------|-------------|
| u100 | `ERR-NOT-AUTHORIZED` | Caller is not contract owner |
| u101 | `ERR-SLIPPAGE-TOO-HIGH` | Output below `min-amount-out` |
| u102 | `ERR-INVALID-AMOUNT` | Amount is zero |
| u103 | `ERR-CONTRACT-PAUSED` | Contract is paused |
| u104 | `ERR-DEX-CALL-FAILED` | DEX routing error |
| u105 | `ERR-NO-LIQUIDITY` | Both DEXs returned zero |
| u106 | `ERR-BOTH-DEXS-FAILED` | Both DEX calls failed |
| u107 | `ERR-AMOUNT-TOO-LARGE` | Input exceeds max bound |
| u108 | `ERR-SAME-TOKEN` | Input and output tokens match |
| u109 | `ERR-INVALID-SLIPPAGE` | `min-amount-out` > `amount-in` |
| u112 | `ERR-FEE-TRANSFER-FAILED` | Fee transfer failed |
| u113 | `ERR-FEE-TOO-HIGH` | Fee exceeds `MAX-FEE-BPS` (100) |
| u114 | `ERR-NO-FEE-TO-COLLECT` | No fees accumulated for token |
| u200 | `ERR-ALEX-POOL-NOT-FOUND` | ALEX pool not configured |
| u201 | `ERR-ALEX-QUOTE-FAILED` | ALEX quote call failed |
| u210 | `ERR-VELAR-QUOTE-FAILED` | Velar quote call failed |
| u211 | `ERR-VELAR-SWAP-FAILED` | Velar swap call failed |

---

## Usage Example

```javascript
import { callReadOnlyFunction, openContractCall, principalCV, uintCV, contractPrincipalCV } from '@stacks/transactions';
import { openContractCall } from '@stacks/connect';

// 1. Get quote
const quote = await callReadOnlyFunction({
  contractAddress: 'ST...',
  contractName: 'router',
  functionName: 'get-best-route',
  functionArgs: [
    principalCV('ST....token-a'),
    principalCV('ST....token-b'),
    uintCV(100000000),
  ],
  senderAddress: 'ST...',
});

// 2. Execute swap with slippage protection
await openContractCall({
  contractAddress: 'ST...',
  contractName: 'router',
  functionName: 'execute-auto-swap',
  functionArgs: [
    contractPrincipalCV('ST...', 'token-a'),
    contractPrincipalCV('ST...', 'token-b'),
    uintCV(100000000),
    uintCV(95000000), // 5% slippage tolerance
  ],
});
```
