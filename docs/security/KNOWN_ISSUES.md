# Known Issues and Limitations

## Critical Issues: NONE

## High Priority Issues

### H-1: Single Admin Key

**Issue:** Contract has single-signature admin control

**Impact:** 
- Admin key compromise allows pausing contract
- Admin can add malicious pool configurations

**Likelihood:** LOW (key kept in hardware wallet)

**Mitigation Plan:**
- Phase 1: Current state (single-sig)
- Phase 2: Deploy multi-sig admin contract (2-of-3)
- Phase 3: Transition to DAO governance

**Timeline:** Multi-sig in v1.1 (Post-mainnet Month 2)

**Status:** ACCEPTED for v1.0

---

## Medium Priority Issues

### M-1: Front-Running Vulnerability

**Issue:** Transactions can be front-run by MEV bots

**Impact:**
- User may receive worse price than quoted
- Protected by slippage tolerance

**Likelihood:** MEDIUM

**Mitigation:**
- User sets slippage tolerance
- Fast block times (5 seconds) reduce window
- Future: Integrate with private mempool

**Timeline:** Private mempool integration v2.0

**Status:** PARTIALLY MITIGATED

---

### M-2: No Rate Limiting

**Issue:** No protection against spam transactions

**Impact:**
- Network congestion possible
- Higher gas fees for all users

**Likelihood:** LOW

**Mitigation:**
- Stacks network has built-in fee market
- Spam is economically expensive

**Status:** ACCEPTED (network-level protection)

---

### M-3: Pool Factor Hardcoding

**Issue:** Pool factors are hardcoded in contract

**Impact:**
- Cannot adapt to DEX pool changes automatically
- Requires admin update if DEX changes pools

**Likelihood:** LOW (pool factors rarely change)

**Mitigation:**
- Admin can update via `add-alex-pool`
- Monitoring alerts for pool changes

**Timeline:** Dynamic discovery in v2.0

**Status:** ACCEPTED for v1.0

---

## Low Priority Issues

### L-1: No Transaction Bundling

**Issue:** Cannot batch multiple swaps

**Impact:** Higher gas costs for users making multiple swaps

**Mitigation:** Users can call directly multiple times

**Status:** FEATURE REQUEST for v1.1

---

### L-2: Limited Token Support

**Issue:** Only supports tokens on ALEX and Velar

**Impact:** Cannot swap tokens exclusive to other DEXs

**Mitigation:** Gradual addition of more DEXs

**Timeline:** Bitflow integration v1.1

**Status:** ROADMAP ITEM

---

### L-3: No Historical Data

**Issue:** Contract doesn't maintain swap history

**Impact:** Users must track externally

**Mitigation:** Frontend maintains history

**Status:** ACCEPTED (not needed on-chain)

---

## Informational

### I-1: Gas Not Optimized

**Issue:** Contract could use less gas with optimizations

**Impact:** Slightly higher transaction costs

**Effort:** 2-3 weeks of optimization work

**Benefit:** ~10-15% gas reduction

**Status:** NOT PLANNED for v1.0 (diminishing returns)

---

### I-2: No Events/Logging

**Issue:** Clarity has no event emission

**Impact:** Harder to track contract activity

**Mitigation:** Index blockchain directly

**Status:** LANGUAGE LIMITATION

---

## False Positives (Not Issues)

### FP-1: Reentrancy

**Claimed Issue:** Contract could be vulnerable to reentrancy

**Reality:** Clarity prevents reentrancy by design

**Status:** NOT APPLICABLE

---

### FP-2: Integer Overflow

**Claimed Issue:** Calculations could overflow

**Reality:** Clarity prevents overflow by design

**Status:** NOT APPLICABLE

---

## Acceptance Criteria

For mainnet launch, the following MUST be resolved:
- [ ] No critical issues
- [ ] All high issues either fixed or have documented mitigation
- [ ] All medium issues acknowledged with timeline

**Current Status:** ✅ READY FOR AUDIT
