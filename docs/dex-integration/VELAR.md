# Velar Protocol Integration Guide

## Overview
Velar is a Uniswap V2-style AMM on Stacks.

## Mainnet Contract Addresses

**Core Contracts:**
- Univ2 Core: `SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.univ2-core`
- Univ2 Router: `SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.univ2-router`
- Univ2 Library: `SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.univ2-library`

**Token Contracts:**
- Wrapped STX: `SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.wstx`
- USDA: `SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.usda-token`
- Velar Token: `SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.velar-token`

## Key Functions

### get-amounts-out (Read-Only Quote Function)

**Signature:**
```clarity
(define-read-only (get-amounts-out
    (amount-in uint)
    (path (list 2 principal)))
    (response (list 2 uint) uint)
)
```

**Parameters:**
- `amount-in`: Input amount in micro-units
- `path`: List of token addresses [token-in, token-out]

**Returns:**
- `(ok (list uint uint))`: [amount-in, amount-out]
- `(err uint)`: Error code

**Example:**
```clarity
;; Get quote for 100 STX → USDA
(contract-call?
  'SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.univ2-router
  get-amounts-out
  u100000000
  (list
    'SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.wstx
    'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.usda-token
  )
)
```

### swap-exact-tokens-for-tokens (Swap Execution)

**Signature:**
```clarity
(define-public (swap-exact-tokens-for-tokens
    (amount-in uint)
    (amount-out-min uint)
    (path (list 2 principal))
    (to principal))
    (response (list 2 uint) uint)
)
```

**Parameters:**
- `amount-in`: Exact input amount
- `amount-out-min`: Minimum acceptable output (slippage)
- `path`: Token route
- `to`: Recipient address

## Pool Format

Velar uses constant product formula: `x * y = k`

**No pool factors needed** - simpler than ALEX

## Fees

- Swap fee: 0.3%
- Protocol fee: 0.05%

## Error Codes

- `err-invalid-path (u1000)`: Path must contain exactly 2 tokens
- `err-insufficient-output-amount (u1001)`: Output below minimum
- `err-insufficient-liquidity (u1002)`: Not enough liquidity

## Comparison: ALEX vs Velar

| Feature | ALEX | Velar |
|---------|------|-------|
| Style | Weighted pools | Constant product |
| Params | Complex (factors) | Simple (path) |
| Pools | Customizable weights | Always 50/50 |
| Fee | 0.3% | 0.3% + 0.05% |
