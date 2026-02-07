# BitRoute Threat Model

## Actors

### Legitimate Users
- **Goals:** Swap tokens at best price
- **Capabilities:** Call public functions, provide parameters
- **Trust Level:** None required (non-custodial)

### Admin
- **Goals:** Maintain system, respond to emergencies
- **Capabilities:** Pause contract, add pools
- **Trust Level:** HIGH (must trust admin won't abuse)

### Malicious Actors
- **Goals:** Steal funds, manipulate prices, DoS
- **Capabilities:** Submit transactions, observe mempool
- **Trust Level:** ZERO

### DEX Operators (ALEX, Velar)
- **Goals:** Provide liquidity, earn fees
- **Capabilities:** Modify their own contracts
- **Trust Level:** MEDIUM (assumed honest)

## Attack Scenarios

### Scenario 1: MEV Bot Front-Running

**Attacker:** MEV Bot
**Target:** User's swap transaction
**Method:**
1. Monitor mempool for large swaps
2. Submit transaction with higher fee (front-run)
3. Execute large trade in same direction
4. User's trade executes at worse price
5. Bot back-runs with opposite trade

**Impact:** User loses money to slippage

**Probability:** MEDIUM (active MEV on Stacks)

**Defenses:**
- User-set slippage tolerance (partial)
- Fast block times reduce window (partial)
- Private mempool (future)

**Residual Risk:** MEDIUM

**Mitigation Priority:** HIGH (Phase 2)

---

### Scenario 2: Admin Key Theft

**Attacker:** Hacker
**Target:** Admin private key
**Method:**
1. Phishing, malware, or physical theft
2. Gain access to admin key
3. Call `set-paused(true)` to DoS
4. OR add malicious pool with bad factors

**Impact:** Service disruption, potential fund loss

**Probability:** LOW (hardware wallet, good opsec)

**Defenses:**
- Hardware wallet storage
- Multi-sig admin (planned)
- Timelock on pool additions (planned)

**Residual Risk:** LOW

**Mitigation Priority:** HIGH (Phase 2)

---

### Scenario 3: Malicious Pool Configuration

**Attacker:** Compromised Admin
**Target:** Users swapping affected pair
**Method:**
1. Call `add-alex-pool` with incorrect factors
2. Users get wrong quotes
3. Swaps execute at bad prices

**Impact:** Users lose funds via bad routing

**Probability:** LOW (requires admin compromise)

**Defenses:**
- Multi-sig reduces single point of failure
- Monitoring alerts on pool changes
- Community can verify pool configs

**Residual Risk:** LOW

**Mitigation Priority:** MEDIUM

---

### Scenario 4: DEX Contract Exploit

**Attacker:** Hacker targeting ALEX or Velar
**Target:** Underlying DEX contract
**Method:**
1. Exploit vulnerability in ALEX/Velar
2. Drain liquidity or manipulate prices
3. BitRoute routes to exploited DEX

**Impact:** Users receive bad prices or failed swaps

**Probability:** LOW (DEXs are audited)

**Defenses:**
- Graceful degradation (use other DEX)
- Monitor for DEX anomalies
- Can pause if needed

**Residual Risk:** LOW

**Mitigation Priority:** LOW (external dependency)

---

### Scenario 5: Sybil Attack on Volume Stats

**Attacker:** Malicious User
**Target:** Volume tracking metrics
**Method:**
1. Create many wallets
2. Execute many small swaps
3. Inflate volume statistics

**Impact:** Misleading metrics

**Probability:** MEDIUM (cheap to execute)

**Defenses:**
- Metrics are informational only
- No governance based on volume
- Can analyze on-chain data

**Residual Risk:** MEDIUM

**Mitigation Priority:** LOW (low impact)

---

### Scenario 6: Slippage Manipulation

**Attacker:** Whale trader
**Target:** Other users' transactions
**Method:**
1. Execute massive trade on DEX
2. Drain liquidity temporarily
3. Victim's trade executes at bad price

**Impact:** Victim gets poor execution

**Probability:** LOW (expensive attack)

**Defenses:**
- Slippage protection
- Victim transaction reverts if exceeded
- DEX arbitrage corrects price quickly

**Residual Risk:** LOW

**Mitigation Priority:** LOW

---

## Risk Matrix

| Threat | Probability | Impact | Risk Level | Priority |
|--------|-------------|--------|------------|----------|
| MEV Front-Running | Medium | Medium | MEDIUM | HIGH |
| Admin Key Theft | Low | High | MEDIUM | HIGH |
| Malicious Pool Config | Low | High | MEDIUM | MEDIUM |
| DEX Exploit | Low | Medium | LOW | LOW |
| Sybil Volume Attack | Medium | Low | LOW | LOW |
| Slippage Manipulation | Low | Medium | LOW | LOW |

## Security Controls

### Preventative

1. **Input Validation:** All parameters validated
2. **Access Control:** Admin functions restricted
3. **Slippage Protection:** User-defined limits
4. **Immutable Code:** Cannot be upgraded
5. **Non-Custodial:** No fund holding

### Detective

1. **Transaction Monitoring:** Alert on anomalies
2. **Volume Tracking:** Detect unusual patterns
3. **Failed Swap Alerts:** High failure rate = issue
4. **Admin Action Logs:** All privileged calls logged

### Responsive

1. **Emergency Pause:** Quick shutdown capability
2. **Incident Response Plan:** Documented procedures
3. **Communication Channels:** Discord, Twitter
4. **Post-Mortem Process:** Learn from incidents

## Assumptions

**We Assume:**
1. Stacks blockchain is secure
2. Clarity interpreter is bug-free
3. ALEX and Velar are honest
4. Users understand slippage risks
5. Admin acts in good faith

**We Do NOT Assume:**
1. MEV bots are absent
2. All users are honest
3. Network is always available
4. DEX prices are always fair
5. No zero-day vulnerabilities exist

## Out of Scope

**Not Part of Our Threat Model:**
1. Stacks blockchain consensus attacks
2. ALEX/Velar contract vulnerabilities
3. User wallet security
4. DNS/phishing attacks on frontend
5. Regulatory compliance
