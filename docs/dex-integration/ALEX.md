# ALEX Protocol Integration Guide

## Overview
ALEX is an automated market maker (AMM) on Stacks blockchain.

## Mainnet Contract Addresses

**Core Contracts:**
- ALEX Vault: `SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.alex-vault`
- ALEX Reserve Pool: `SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.alex-reserve-pool`

**Token Contracts:**
- Wrapped STX: `SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.token-wstx`
- USDA: `SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.token-wusda`
- ALEX Token: `SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.age000-governance-token`

## Key Functions

### get-helper (Read-Only Quote Function)

**Signature:**
```clarity
(define-read-only (get-helper
    (token-x-trait <ft-trait>)
    (token-y-trait <ft-trait>)
    (factor-x uint)
    (factor-y uint)
    (dx uint))
    (response uint uint)
)
```

**Parameters:**
- `token-x-trait`: Input token contract implementing ft-trait
- `token-y-trait`: Output token contract implementing ft-trait
- `factor-x`: Weight factor for token X (pool specific)
- `factor-y`: Weight factor for token Y (pool specific)
- `dx`: Input amount in micro-units

**Returns:**
- `(ok uint)`: Expected output amount in micro-units
- `(err uint)`: Error code if pool doesn't exist or invalid params

**Example:**
```clarity
;; Get quote for 100 STX → USDA
(contract-call? 
  'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.alex-vault
  get-helper
  'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.token-wstx
  'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.token-wusda
  u50000000  ;; 50% weight for STX
  u50000000  ;; 50% weight for USDA
  u100000000 ;; 100 STX in micro-units
)
```

### swap-helper (Swap Execution Function)

**Signature:**
```clarity
(define-public (swap-helper
    (token-x-trait <ft-trait>)
    (token-y-trait <ft-trait>)
    (factor-x uint)
    (factor-y uint)
    (dx uint)
    (min-dy uint))
    (response uint uint)
)
```

**Parameters:**
- Same as `get-helper` plus:
- `min-dy`: Minimum acceptable output (slippage protection)

**Returns:**
- `(ok uint)`: Actual output amount received
- `(err uint)`: Error if swap fails or slippage exceeded

## Pool Factor Reference

Common pool configurations on ALEX:

| Token Pair | Factor X | Factor Y | Type |
|------------|----------|----------|------|
| STX/USDA | 50000000 | 50000000 | Balanced |
| ALEX/STX | 80000000 | 20000000 | Weighted |
| sBTC/STX | 50000000 | 50000000 | Balanced |

**Note:** Factor values represent pool weights as percentages * 1,000,000
- 50000000 = 50%
- 80000000 = 80%

## Fees

- Swap fee: 0.3% (taken from input amount)
- Fee distribution: To liquidity providers

## Error Codes

- `err-pool-not-exists (u2001)`: Pool doesn't exist for token pair
- `err-token-mismatch (u2002)`: Invalid token trait
- `err-transfer-failed (u2003)`: Token transfer failed
- `err-get-balance-failed (u2004)`: Cannot fetch balance

## Integration Checklist

- [ ] Verify token contracts implement SIP-010 ft-trait
- [ ] Confirm pool exists for token pair
- [ ] Use correct factor values for pool
- [ ] Handle error cases gracefully
- [ ] Test with small amounts first
- [ ] Implement slippage protection
