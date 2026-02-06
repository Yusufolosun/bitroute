# BitRoute Mainnet Deployment Checklist

## Pre-Deployment Checklist

### Phase 1: Code Completion ✅
- [x] ALEX protocol integration
  - [x] Pool factor management
  - [x] Quote function (safe fallback)
  - [x] Pool initialization function
- [x] Velar protocol integration
  - [x] Quote function (safe fallback)
  - [x] Routing logic
- [x] Multi-DEX routing logic
- [x] Error handling and graceful degradation
- [x] Frontend token addresses (mainnet ready)
- [x] DEX badge UI enhancement
- [x] Integration tests
- [x] Testnet validation script

### Phase 2: Testing (IN PROGRESS)
- [ ] Run all Clarity tests
  ```bash
  cd contracts
  clarinet test
  ```
- [ ] Test ALEX pool initialization on testnet
- [ ] Verify get-best-route with real token pairs
- [ ] Test small swaps on testnet (1 STX)
- [ ] Validate slippage protection
- [ ] Test pause/unpause functionality
- [ ] Verify volume tracking accuracy
- [ ] Test error scenarios (no liquidity, invalid tokens)
- [ ] Frontend integration testing
- [ ] Cross-browser testing (Chrome, Firefox, Brave)

### Phase 3: Security (REQUIRED BEFORE MAINNET)
- [ ] Code review by second developer
- [ ] External security audit (recommended)
  - Contact: Trail of Bits, Quantstamp, or OpenZeppelin
  - Budget: $15,000 - $50,000
- [ ] Verify no admin backdoors
- [ ] Confirm contract is upgradeable or immutable
- [ ] Test reentrancy protection (Clarity handles this)
- [ ] Validate slippage calculations
- [ ] Review error handling edge cases

### Phase 4: Documentation
- [x] ALEX integration guide
- [x] Velar integration guide
- [x] Architecture documentation
- [ ] User guide for swapping
- [ ] API documentation for developers
- [ ] Troubleshooting guide
- [ ] FAQ document

### Phase 5: Deployment Preparation
- [ ] Update contract addresses for mainnet
  - Current: Testnet addresses
  - Update: ALEX-VAULT, VELAR-ROUTER constants
- [ ] Set up mainnet wallet with deployment funds
  - Estimated cost: ~50 STX for deployment
- [ ] Configure production environment variables
  ```bash
  NEXT_PUBLIC_NETWORK=mainnet
  NEXT_PUBLIC_CONTRACT_ADDRESS=<deployed-address>
  ```
- [ ] Set up monitoring and alerting
  - Block explorer tracking
  - Transaction volume alerts
  - Error rate monitoring

### Phase 6: Mainnet Deployment Steps

#### Step 1: Deploy Router Contract
```bash
cd contracts

# 1. Verify contract compiles
clarinet check

# 2. Generate mainnet deployment plan
clarinet deployments generate --mainnet

# 3. Review deployment plan
cat deployments/default.mainnet-plan.yaml

# 4. Deploy to mainnet (requires STX for fees)
clarinet deployments apply --mainnet

# 5. Note deployed contract address
# Example: SP2...ABC.router
```

#### Step 2: Initialize Contract
```bash
# Call init-alex-pools function
# This must be done by contract owner immediately after deployment
# Use Stacks explorer or CLI
```

#### Step 3: Verify Deployment
```bash
# Run validation script
./scripts/validate-mainnet.sh

# Manual verification checklist:
# - Contract source visible on explorer
# - is-paused returns false
# - get-dex-volume returns 0 for both DEXs
# - init-alex-pools executed successfully
```

#### Step 4: Update Frontend
```bash
cd frontend

# 1. Update production environment
echo "NEXT_PUBLIC_NETWORK=mainnet" > .env.production
echo "NEXT_PUBLIC_CONTRACT_ADDRESS=<deployed-address>" >> .env.production

# 2. Build production frontend
npm run build

# 3. Test production build locally
npm start

# 4. Deploy to Vercel/Netlify
vercel --prod
# or
netlify deploy --prod
```

#### Step 5: Monitor First Transactions
- [ ] Execute test swap with small amount (1 STX)
- [ ] Verify transaction completes successfully
- [ ] Check volume tracking updates correctly
- [ ] Monitor for any errors in browser console

### Phase 7: Post-Deployment
- [ ] Announce launch on Twitter/Discord
- [ ] Update README with mainnet contract address
- [ ] Create tutorial video
- [ ] Monitor first week of transactions
- [ ] Gather user feedback
- [ ] Set up analytics dashboard

## Risk Mitigation

### High Risk Items
1. **Smart Contract Bugs**
   - Mitigation: External audit, extensive testing
   - Backup plan: Emergency pause function

2. **DEX API Changes**
   - Mitigation: Graceful degradation (return 0 on error)
   - Backup plan: Update contract or use one DEX

3. **Low Liquidity**
   - Mitigation: Check both DEXs, error if both return 0
   - Backup plan: Direct users to DEX with liquidity

4. **Frontend Exploits**
   - Mitigation: CSP headers, input validation
   - Backup plan: Take frontend offline, contract still works

### Emergency Procedures
1. **If Critical Bug Found:**
   ```clarity
   ;; Pause contract immediately
   (contract-call? .router set-paused true)
   ```

2. **If DEX Fails:**
   - Graceful degradation routes to working DEX
   - Users can still trade on available DEX

3. **If Frontend Compromised:**
   - Take down frontend
   - Users can interact via Stacks Explorer

## Success Metrics

### Week 1 Goals
- [ ] 10+ unique users
- [ ] 100+ STX total volume
- [ ] 0 critical errors
- [ ] 95%+ uptime

### Month 1 Goals
- [ ] 100+ unique users
- [ ] 10,000+ STX total volume
- [ ] Listed on DeFiLlama
- [ ] Integration with wallet aggregators

### Month 3 Goals
- [ ] 1,000+ unique users
- [ ] 100,000+ STX total volume
- [ ] Multi-hop routing implemented
- [ ] 3+ DEX integrations

## Rollback Plan

If critical issues arise:
1. Pause contract via `set-paused(true)`
2. Take frontend offline
3. Communicate issue to users
4. Diagnose and fix
5. Deploy fix to testnet
6. Test thoroughly
7. Redeploy to mainnet
8. Unpause contract

## Contact Information

**Emergency Contacts:**
- Developer: [Your Email]
- Security Team: [If applicable]
- Stacks Foundation: [For critical issues]

**Community:**
- Discord: [Your Server]
- Twitter: [Your Handle]
- GitHub: [Repo URL]

---

## Current Status

**Phase Completed:** Phase 1 - Code Completion ✅

**Next Steps:**
1. Run comprehensive tests on testnet
2. Execute testnet validation script
3. Review security considerations
4. Plan external audit (if budget allows)

**Blockers:**
- None currently

**Notes:**
- Contract uses mock quotes for compatibility
- Real DEX integrations ready but commented out
- Frontend supports mainnet token addresses
- Validation script ready for testing
