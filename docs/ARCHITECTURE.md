# BitRoute Architecture

This document provides detailed technical architecture and design decisions for the BitRoute project.

## Table of Contents

1. [System Overview](#system-overview)
2. [Smart Contract Architecture](#smart-contract-architecture)
3. [Frontend Architecture](#frontend-architecture)
4. [Data Flow](#data-flow)
5. [Design Decisions](#design-decisions)
6. [Future Roadmap](#future-roadmap)

---

## System Overview

BitRoute is a decentralized DEX aggregator consisting of two main components:
````
┌─────────────────────────────────────────────────┐
│                    User                          │
│              (Leather/Xverse)                    │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│           Frontend (Next.js)                     │
│   - Token selection UI                           │
│   - Price quote display                          │
│   - Transaction management                       │
└────────────────┬────────────────────────────────┘
                 │
                 │ Stacks.js
                 ▼
┌─────────────────────────────────────────────────┐
│        Router Contract (Clarity)                 │
│   - Price discovery (read-only)                  │
│   - Swap execution (public)                      │
│   - Admin controls                               │
└────────────────┬────────────────────────────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
┌──────────────┐  ┌──────────────┐
│ ALEX DEX     │  │ Velar DEX    │
│ (Future)     │  │ (Future)     │
└──────────────┘  └──────────────┘
````

Smart Contract Architecture
Design Philosophy
The router contract was designed with these principles:

On-Chain Price Discovery: Eliminate backend dependency
Gas Efficiency: Minimize transaction costs
Security First: Slippage protection and pausability
Extensibility: Easy to add new DEXs

Contract Structure
clarity;; Constants
ERR-NOT-AUTHORIZED (err u100)
ERR-SLIPPAGE-TOO-HIGH (err u101)
ERR-INVALID-AMOUNT (err u102)
ERR-CONTRACT-PAUSED (err u103)
DEX-ALEX u1
DEX-VELAR u2

;; State Variables
contract-paused (data-var bool false)

;; Data Maps
dex-volume { dex-id: uint } → { total-volume: uint }
user-swaps { user: principal } → { swap-count: uint, total-volume: uint }

;; Core Functions
get-best-route (read-only)
execute-auto-swap (public)
set-paused (public, admin-only)
Key Design Decisions
1. On-Chain vs Off-Chain Routing
Decision: Hybrid approach

Price calculation: On-chain (read-only calls)
Route selection: On-chain (deterministic)
Transaction execution: On-chain

Rationale:

✅ Fully decentralized (no oracle needed)
✅ Transparent price discovery
❌ Slightly higher gas (acceptable trade-off)

2. Mock Implementation for Testing
Current implementation uses hardcoded values:
clarity(define-read-only (get-best-route ...)
  (let (
    (alex-quote u1000)   ;; Mock
    (velar-quote u950)   ;; Mock
  )
  ...
)
Why:

Allows end-to-end testing without DEX integrations
Validates contract call mechanisms
Easy to replace with real contract-call? later

Production Implementation:
clarity(alex-quote (unwrap! 
  (contract-call? .alex-vault get-amount-out token-in token-out amount-in)
  ERR-DEX-CALL-FAILED))
3. Slippage Protection
Implemented via min-amount-out parameter:
clarity(asserts! (>= actual-amount-out min-amount-out) 
          ERR-SLIPPAGE-TOO-HIGH)
User calculates on frontend:
typescriptconst minOut = amountOut * (1 - slippage / 100)
````

---

## Frontend Architecture

### Tech Stack Rationale

| Technology | Purpose | Why? |
|------------|---------|------|
| Next.js 14 | Framework | App router, SSR, optimized |
| TypeScript | Language | Type safety, better DX |
| Tailwind CSS | Styling | Rapid UI development |
| @stacks/connect | Wallet | Standard for Stacks wallets |
| @stacks/transactions | Contract calls | Official Stacks SDK |

### Component Hierarchy
````
app/
├── layout.tsx (Providers)
│   ├── WalletProvider
│   └── TransactionProvider
│
└── page.tsx (Main UI)
    ├── Header
    │   ├── NetworkStatus
    │   └── WalletConnect
    ├── SwapForm
    │   ├── TokenSelector
    │   ├── AmountInput
    │   ├── PriceQuote
    │   └── SwapButton
    ├── TransactionToast
    └── TransactionHistory
````

### State Management

**Context-based approach** (no Redux needed for MVP):

1. **WalletContext**: User session and address
2. **TransactionContext**: TX status and history

**Why Context over Redux**:
- ✅ Simple state (no complex updates)
- ✅ Less boilerplate
- ✅ Easier to understand
- ✅ Sufficient for current scope

### Data Flow Example: Get Quote
````
User enters amount
     ↓
SwapForm.handleGetQuote()
     ↓
useContract.getQuote()
     ↓
contract.getBestRoute() [Stacks.js]
     ↓
callReadOnlyFunction() [API call]
     ↓
Router.get-best-route [On-chain]
     ↓
Response: { bestDex, expectedAmount, quotes }
     ↓
Parse and display in UI
````

Data Flow
Quote Flow (Read-Only)
mermaidsequenceDiagram
    User->>Frontend: Enter swap details
    Frontend->>Frontend: Validate inputs
    Frontend->>Stacks API: callReadOnlyFunction()
    Stacks API->>Router Contract: get-best-route
    Router Contract->>Router Contract: Compare DEX prices
    Router Contract-->>Stacks API: Return best route
    Stacks API-->>Frontend: Quote data
    Frontend-->>User: Display quote
Swap Flow (Transaction)
mermaidsequenceDiagram
    User->>Frontend: Click "Swap"
    Frontend->>TransactionContext: addTransaction()
    Frontend->>Wallet: openContractCall()
    Wallet->>User: Show TX details
    User->>Wallet: Approve
    Wallet->>Stacks Network: Broadcast TX
    Stacks Network-->>Frontend: TX ID
    Frontend->>Frontend: Poll for status
    Frontend->>TransactionContext: updateStatus()
    Frontend-->>User: Show success/failure

Design Decisions
1. Token Address Handling
Challenge: STX is native (no contract), but contract expects principals
Solution: Mock token wrapper addresses
typescriptconst buildTokenAddress = (token: Token) => {
  if (token.symbol === 'STX') {
    return `${CONTRACT_ADDRESS}.stx-token`; // Wrapper
  }
  return token.address;
};
Future: Integrate with actual token contracts (SIP-010 compliant)
2. Transaction Status Tracking
Challenge: Stacks doesn't have instant finality
Solution: Polling-based status checker
typescriptsetInterval(async () => {
  const tx = await fetch(`/extended/v1/tx/${txId}`);
  if (tx.status === 'success') {
    updateStatus(SUCCESS);
  }
}, 10000); // Poll every 10s
Trade-offs:

✅ Works reliably
❌ Not real-time (10s delay)
❌ Multiple API calls

Future: WebSocket-based updates
3. Network Configuration
Current: Environment variable based
typescriptNEXT_PUBLIC_NETWORK=testnet
Why:

✅ Simple to change
✅ Build-time optimization
❌ Requires rebuild for network change

Future: Runtime network switching

Testing Strategy
Smart Contract Tests
Framework: Clarinet (Vitest-based)
Coverage:
typescript✓ get-best-route returns valid data
✓ execute-auto-swap validates amount
✓ slippage protection enforced
✓ pause mechanism works
✓ unauthorized pause rejected
✓ volume tracking updates
Test Philosophy:

Test all error paths
Test state changes
Test authorization
Test edge cases (zero amounts, etc.)

Frontend Tests
Not implemented yet (future enhancement)
Planned:

Component unit tests (Jest + RTL)
Integration tests (Playwright)
E2E tests on testnet


Security Considerations
Smart Contract

Reentrancy: Not possible in Clarity (language-level protection)
Integer Overflow: Prevented by Clarity
Access Control: tx-sender checks for admin functions
Pause Mechanism: Emergency circuit breaker

Frontend

Private Key Handling: Never touches frontend (wallet-only)
Transaction Validation: Client-side checks before submission
Network Requests: HTTPS only (Stacks API)


Performance Optimizations
Smart Contract

Read-only functions: Zero gas cost for users
Minimal state updates: Only essential data persisted

Frontend

Code splitting: Next.js automatic chunks
Image optimization: Next.js Image component
Memoization: React hooks where needed


Future Roadmap
Phase 1: Real DEX Integration
Timeline: 2-4 weeks
Tasks:

 Deploy mock SIP-010 tokens
 Integrate ALEX testnet contracts
 Integrate Velar testnet contracts
 Test with real liquidity

Technical Changes:
clarity;; Replace mock values
(alex-quote (contract-call? .alex-vault get-quote ...))
(velar-quote (contract-call? .velar-amm get-quote ...))
Phase 2: Advanced Features
Timeline: 1-2 months

 Multi-hop routing (STX → USDA → sBTC)
 DCA vault implementation
 Keeper network for automated DCA
 Price impact warnings
 Historical analytics

Phase 3: Production Readiness
Timeline: 2-3 months

 Professional security audit
 Gas optimizations
 Mainnet deployment
 Custom domain and branding
 Marketing and user acquisition

Phase 4: Ecosystem Expansion
Timeline: 3-6 months

 Integrate Bitflow
 Cross-chain aggregation (via sBTC)
 Limit orders
 Liquidity provision features
 Mobile app (React Native)


Technical Debt & Known Issues
Current Limitations

Mock DEX Integration

Contract returns hardcoded values
Need real contract-call? implementations


Transaction Monitoring

Polling-based (not real-time)
Could miss rapid status changes


Token List

Hardcoded in frontend
Need dynamic token registry


Error Handling

Generic error messages
Need DEX-specific error parsing


Testing

No frontend unit tests
No E2E test suite



Proposed Solutions
Short-term:

Add frontend test coverage
Implement proper error codes
Dynamic token loading

Long-term:

WebSocket for TX updates
Subgraph for historical data
Decentralized token registry


Development Guidelines
Adding a New DEX

Contract: Add DEX constant and integration

clarity(define-constant DEX-BITFLOW u3)

Quote Function: Implement getter

clarity(bitflow-quote (contract-call? .bitflow-dex get-quote ...))

Comparison Logic: Update best-route

clarity(if (> bitflow-quote current-best)
  (set best bitflow-quote)
  best)

Frontend: Add to constants

typescriptexport const DEX = {
  ALEX: 1,
  VELAR: 2,
  BITFLOW: 3,
} as const;
Code Style

Clarity: Use kebab-case, descriptive names
TypeScript: Strict mode, explicit types
Commits: Conventional commits format
PRs: Include tests and documentation


Appendix
Useful Commands
bash# Contract development
clarinet check                    # Compile contracts
clarinet test                     # Run tests
clarinet console                  # Interactive REPL
clarinet deployments apply --testnet  # Deploy

# Frontend development
npm run dev                       # Start dev server
npm run build                     # Production build
npm run lint                      # Check code quality

# Git workflow
git commit -m "feat: ..."         # Feature
git commit -m "fix: ..."          # Bug fix
git commit -m "docs: ..."         # Documentation
External Resources

Clarity Language Reference
Stacks.js Documentation
ALEX Protocol Docs
Velar Protocol Docs


Last Updated: February 2026
Version: 1.0.0
Maintainer: BitRoute Team
