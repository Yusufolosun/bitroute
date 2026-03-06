# BitRoute Architecture

## System Overview

BitRoute is a DEX aggregator on Stacks. A single Clarity smart contract compares prices across ALEX and Velar, then routes swaps to the best-priced DEX with protocol fee collection.

```
User (Leather/Xverse wallet)
        │
        ▼
  Next.js Frontend
  - Token selection, quotes, TX management
        │ @stacks/connect + @stacks/transactions
        ▼
  Router Contract (Clarity)
  - On-chain price discovery
  - Fee deduction (basis points)
  - Swap execution
  - Admin controls
        │
   ┌────┴────┐
   ▼         ▼
 ALEX      Velar
```

## Smart Contract

### Design Principles

- **On-chain routing**: No off-chain oracle dependency
- **Non-custodial**: Contract holds only accumulated fees, never user funds during swaps
- **Atomic**: Swaps complete fully or revert entirely
- **Fee-on-input**: Protocol fee deducted before routing to DEX

### Key Data Structures

| Map | Key | Value |
|-----|-----|-------|
| `dex-volume` | `dex-id` | `total-volume` |
| `user-swaps` | `user` | `swap-count`, `total-volume` |
| `fee-balances` | `token` | `balance` |
| `alex-pool-factors` | `token-x`, `token-y` | `factor-x`, `factor-y` |

### Fee Mechanism

1. User calls `execute-auto-swap` with `amount-in`
2. Contract calculates fee: `amount-in * protocol-fee-bps / 10000`
3. Fee transferred from user to contract via SIP-010 `transfer`
4. Remaining `net-amount` routed to best DEX
5. Admin withdraws accumulated fees via `collect-fees`

Default: 30 bps (0.30%). Hard cap: 100 bps (1.00%).

### DEX Integration

Currently uses mock quotes (ALEX returns `u1000`, Velar returns `u950`). Production deployment replaces with real `contract-call?` to ALEX and Velar AMM contracts. Graceful degradation: if one DEX fails, the other is used.

## Frontend

| Technology | Purpose |
|------------|---------|
| Next.js 14 | App router, SSR |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| @stacks/connect | Wallet integration |
| @stacks/transactions | Contract calls |
| @yusufolosun/stx-utils | Address formatting, TX URLs, error decoding |

### State Management

Context-based (no Redux):
- **WalletContext**: User session and address
- **TransactionContext**: TX status and history

### Swap Flow

1. User enters amount → frontend calls `get-best-route` (read-only, zero gas)
2. Frontend displays quote with fee breakdown
3. User clicks Swap → `openContractCall` triggers wallet popup
4. User approves → TX broadcast to Stacks network
5. Frontend polls for confirmation → updates history

## Security

- **Clarity**: No reentrancy (language-level), no integer overflow
- **Access control**: `tx-sender` checks on all admin functions
- **Pause mechanism**: Emergency circuit breaker
- **Slippage protection**: User-defined `min-amount-out`
- **Fee bound**: `MAX-FEE-BPS` constant prevents admin abuse
- **Frontend**: Private keys never leave wallet

See [docs/security/](security/) for threat model and specification.

## Adding a New DEX

1. Add constant: `(define-constant DEX-NEW u3)`
2. Add quote function: `get-new-dex-quote-safe`
3. Update `get-best-route` comparison logic
4. Add frontend constant: `DEX.NEW = 3`
5. Update `getDexName()` in `contract.ts`
Maintainer: BitRoute Team
