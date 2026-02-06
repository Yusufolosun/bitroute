# DEX Integration Architecture

## Design Decision: Monolithic vs Modular

### Chosen Approach: Monolithic with Helper Functions

**Rationale:**
1. Simpler for security audit (single contract)
2. Lower gas costs (no cross-contract calls)
3. Easier deployment and testing
4. Sufficient for 2-3 DEXs

**Structure:**
```
router.clar
├── Core routing logic
├── ALEX helper functions
├── Velar helper functions
└── Best route selection
```

### Contract Flow

```
User Request
    ↓
get-best-route (read-only)
    ├─→ get-alex-quote
    ├─→ get-velar-quote
    └─→ compare & return best
    ↓
execute-auto-swap (public)
    ├─→ get-best-route
    ├─→ if ALEX: call alex-vault
    ├─→ if Velar: call univ2-router
    └─→ validate & return
```

## Error Handling Strategy

**Graceful Degradation:**
```clarity
;; If one DEX fails, use the other
(define-private (get-alex-quote ...)
  (match (try-get-alex-quote ...)
    success (ok success)
    error (ok u0))  ;; Return 0, not error
)
```

This ensures:
- System keeps working if one DEX is down
- User gets best available price
- Clear error messages when both fail

## Token Pair Management

Hard-coded configuration for known pairs:
```clarity
(define-map token-pair-config
  { token-x: principal, token-y: principal }
  {
    alex-factor-x: uint,
    alex-factor-y: uint,
    velar-enabled: bool
  }
)
```

**Supported pairs (mainnet v1):**
- STX ↔ USDA
- STX ↔ sBTC
- ALEX ↔ STX
- (More can be added via governance)

## Gas Optimization

**Techniques:**
- Read-only calls are free
- Batch pool factor lookups
- Early exit if one DEX has 10x better price
- Cache frequently used values

## Security Considerations

**Input Validation:**
```clarity
;; Always validate
(asserts! (> amount-in u0) ERR-INVALID-AMOUNT)
(asserts! (is-standard-principal token-in) ERR-INVALID-TOKEN)
```

**Slippage Protection:**
```clarity
;; User-defined minimum
(asserts! (>= actual-output min-output) ERR-SLIPPAGE-TOO-HIGH)
```

**Reentrancy:**
- Not possible in Clarity (language-level protection)

**Admin Functions:**
- Only owner can pause
- No funds held in contract (direct swaps)
