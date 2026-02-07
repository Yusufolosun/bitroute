# BitRoute Security Specification

## Contract Security Model

### Trust Assumptions

**What Users Must Trust:**
1. Contract owner won't maliciously pause during their transactions
2. ALEX and Velar contracts are legitimate and secure
3. Token contracts implement SIP-010 correctly
4. Stacks blockchain maintains integrity

**What Users Don't Need to Trust:**
1. Contract never holds user funds (atomic swaps)
2. No admin functions can steal tokens
3. Routing logic is deterministic and transparent
4. All calculations done on-chain (no oracle dependencies)

### Attack Surface Analysis

#### 1. Smart Contract Layer

**Potential Vulnerabilities:**

**Reentrancy:**
- **Risk Level:** LOW
- **Mitigation:** Clarity prevents reentrancy by design
- **Status:** Protected by language

**Integer Overflow/Underflow:**
- **Risk Level:** LOW  
- **Mitigation:** Clarity prevents by design
- **Status:** Protected by language

**Access Control:**
- **Risk Level:** MEDIUM
- **Mitigation:** `CONTRACT-OWNER` checks on admin functions
- **Verification:** Only `set-paused` and `add-alex-pool` are admin-only
- **Status:** Implemented

**Slippage Protection:**
- **Risk Level:** HIGH (user-facing)
- **Mitigation:** User-defined `min-amount-out` parameter
- **Verification:** `asserts!` check before swap completion
- **Status:** Implemented

**DEX Integration Failures:**
- **Risk Level:** MEDIUM
- **Mitigation:** Graceful degradation (return u0, not error)
- **Verification:** One DEX can be down without breaking system
- **Status:** Implemented

**Pool Factor Manipulation:**
- **Risk Level:** LOW
- **Mitigation:** Admin-only pool configuration
- **Verification:** `add-alex-pool` requires owner signature
- **Status:** Implemented

#### 2. Economic Attacks

**Front-Running:**
- **Risk Level:** MEDIUM
- **Attack:** MEV bot sees pending swap, executes large trade first
- **Mitigation:** Slippage tolerance, fast block times (5s)
- **User Control:** User sets acceptable slippage
- **Status:** Partially mitigated

**Sandwich Attacks:**
- **Risk Level:** MEDIUM
- **Attack:** Front-run + back-run user transaction
- **Mitigation:** Slippage protection, transaction ordering
- **Status:** Relies on user-set slippage

**Price Oracle Manipulation:**
- **Risk Level:** LOW
- **Mitigation:** No external oracles (on-chain DEX prices only)
- **Status:** Not applicable

**Liquidity Draining:**
- **Risk Level:** LOW
- **Attack:** Drain DEX liquidity to manipulate routing
- **Mitigation:** Router doesn't affect underlying liquidity
- **Status:** Not applicable (external to our contract)

#### 3. Operational Risks

**Admin Key Compromise:**
- **Risk Level:** MEDIUM
- **Impact:** Attacker could pause contract or add malicious pools
- **Mitigation Plan:**
  - Multi-sig wallet for admin (TODO)
  - Timelock for pool additions (TODO)
  - Emergency pause only (cannot steal funds)
- **Status:** Single-sig admin (needs upgrade)

**Contract Pause Abuse:**
- **Risk Level:** LOW
- **Impact:** Denial of service
- **Mitigation:** Users can swap on DEXs directly
- **Status:** Acceptable for v1

**Upgrade Path Issues:**
- **Risk Level:** N/A
- **Mitigation:** Clarity contracts are immutable
- **Status:** Cannot be upgraded (feature, not bug)

### Security Guarantees

**What We Guarantee:**

1. ✅ **Non-Custodial:** Contract never holds user tokens
2. ✅ **Atomic Swaps:** Swap succeeds completely or reverts
3. ✅ **Transparent Routing:** All logic on-chain and auditable  
4. ✅ **Slippage Protection:** User-defined maximum price movement
5. ✅ **No Hidden Fees:** Only DEX fees (0.3%), no protocol fee

**What We Don't Guarantee:**

1. ❌ Best execution vs. direct DEX usage
2. ❌ Protection against extreme market volatility
3. ❌ Uptime (admin can pause)
4. ❌ Future DEX integration compatibility

### Emergency Procedures

**Incident Response Plan:**

1. **Critical Bug Discovered:**
   - Immediate: Pause contract via `set-paused(true)`
   - Within 1hr: Post mortem to community
   - Within 24hr: Mitigation plan published
   - Users: Can still use DEXs directly

2. **Admin Key Compromise:**
   - Immediate: Announce compromise publicly
   - Deploy new contract with new admin
   - Migrate users to new contract
   - Old contract remains paused

3. **DEX Integration Failure:**
   - System continues with working DEX
   - Monitor and investigate
   - If needed, remove failing DEX from routing

4. **Stacks Network Issues:**
   - Wait for network resolution
   - No action needed (contract is stateless)

### Audit Checklist

**Pre-Audit:**
- [ ] All functions documented with natspec-style comments
- [ ] All edge cases have tests
- [ ] No TODO comments in production code
- [ ] All admin functions identified and justified
- [ ] Known issues documented
- [ ] Test coverage >90%

**During Audit:**
- [ ] Provide full access to codebase
- [ ] Answer auditor questions within 24 hours
- [ ] Document all design decisions
- [ ] Track all findings in issue tracker

**Post-Audit:**
- [ ] Fix all critical and high findings
- [ ] Document medium/low findings if not fixed
- [ ] Get re-audit on fixes
- [ ] Publish audit report publicly

### Testing Strategy

**Coverage Requirements:**

- Unit Tests: >90% code coverage
- Integration Tests: All DEX paths tested
- Edge Cases: All error conditions tested
- Stress Tests: Large amounts, extreme slippage
- Negative Tests: Invalid inputs, unauthorized access

**Test Scenarios:**

1. Normal swaps (small amounts)
2. Large swaps (>$10k equivalent)
3. Zero amount inputs
4. Invalid token addresses
5. Paused contract
6. Unauthorized admin calls
7. One DEX down
8. Both DEXs down
9. Extreme slippage scenarios
10. Concurrent transactions

### Code Quality Standards

**Mandatory:**
- No dead code
- No commented-out code
- No magic numbers (use constants)
- Consistent naming conventions
- Descriptive variable names
- Comments explain "why", not "what"

**Forbidden:**
- `unwrap-panic` (except in tests and read-only)
- `as-contract` (not needed)
- Complex nested conditionals (>3 levels)
- Functions >50 lines
- Duplicate logic

### Deployment Security

**Mainnet Deployment Checklist:**

- [ ] Contract source matches deployed bytecode
- [ ] Admin address is multi-sig
- [ ] All pool factors initialized correctly
- [ ] Test transactions completed successfully
- [ ] Emergency pause tested
- [ ] Monitoring and alerts configured
- [ ] Incident response team on standby

### Post-Deployment Monitoring

**Metrics to Track:**

1. Total volume routed
2. Number of swaps per day
3. Average swap size
4. DEX selection ratio (ALEX vs Velar %)
5. Failed transaction rate
6. Slippage occurrence rate
7. Gas costs per swap

**Alert Triggers:**

- Failed swap rate >5%
- Volume spike >500% in 1 hour
- Admin function called
- Contract paused/unpaused
- New pool added
