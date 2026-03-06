# BitRoute

DEX aggregator for the Stacks blockchain. Routes token swaps across ALEX and Velar to find the best price, with on-chain slippage protection and protocol fee collection.

## What It Does

BitRoute compares quotes from multiple DEXs and executes swaps through whichever offers the best rate. The routing logic, fee deduction, and slippage enforcement all happen on-chain in a single Clarity contract.

- Queries ALEX and Velar for price quotes
- Routes to the DEX with the higher output
- Deducts a configurable protocol fee (default 0.30%, max 1.00%)
- Enforces user-defined minimum output (slippage protection)
- Tracks volume per DEX and per user

## Architecture

```
contracts/
  contracts/
    router.clar        # Production contract: routing, fees, admin
    mock-token.clar    # Test-only: SIP-010 mock token A
    mock-token-b.clar  # Test-only: SIP-010 mock token B
  tests/               # Clarity + TypeScript test suites

frontend/
  src/
    components/        # SwapForm, TokenSelector, WalletConnect, etc.
    contexts/          # WalletContext, TransactionContext
    hooks/             # useContract
    lib/               # stacks.ts, contract.ts, constants.ts
```

**Contract**: Single Clarity contract (`router.clar`) handles price discovery, swap execution, fee management, and admin controls.

**Frontend**: Next.js 14 with TypeScript. Connects via `@stacks/connect` for wallet integration and `@stacks/transactions` for contract calls.

## Quick Start

### Prerequisites

- Node.js 18+
- [Clarinet](https://github.com/hirosystems/clarinet) 3.x
- [Leather](https://leather.io/) or [Xverse](https://www.xverse.app/) wallet (for frontend)

### Setup

```bash
git clone https://github.com/Yusufolosun/bitroute.git
cd bitroute

# Contract dependencies
cd contracts && npm install

# Frontend dependencies
cd ../frontend && npm install
cp .env.example .env.local
```

### Run Tests

```bash
# Contract tests (Clarity + TypeScript)
cd contracts && npm test

# Frontend tests
cd frontend && npm test
```

### Development

```bash
cd frontend && npm run dev
# Opens http://localhost:3000
```

## Contract API

### Read-Only

| Function | Parameters | Returns |
|---|---|---|
| `get-best-route` | `token-in`, `token-out`, `amount-in` | `{ best-dex, expected-amount-out, alex-quote, velar-quote }` |
| `is-paused` | — | `bool` |
| `get-dex-volume` | `dex-id` (1=ALEX, 2=Velar) | `uint` |
| `get-user-stats` | `user` | `{ swap-count, total-volume }` |
| `get-protocol-fee` | — | `uint` (basis points) |
| `get-fee-balance` | `token` | `uint` |

### Public

| Function | Parameters | Description |
|---|---|---|
| `execute-auto-swap` | `token-in`, `token-out`, `amount-in`, `min-amount-out` | Route swap to best DEX with fee deduction and slippage check |
| `set-paused` | `paused` | Emergency pause (admin only) |
| `set-protocol-fee` | `new-fee-bps` | Update fee, max 100 bps (admin only) |
| `collect-fees` | `token`, `recipient` | Withdraw accumulated fees (admin only) |
| `init-alex-pools` | — | Initialize ALEX pool factors (admin only) |
| `emergency-recover-token` | `token`, `amount`, `recipient` | Recover stuck tokens when paused (admin only) |

### Error Codes

| Code | Meaning |
|---|---|
| u100 | Not authorized |
| u101 | Slippage too high — output below minimum |
| u102 | Invalid amount (zero) |
| u103 | Contract paused |
| u104 | DEX call failed |
| u107 | Amount too large |
| u108 | Same token for input and output |
| u109 | Invalid slippage (min-out > amount-in) |
| u112 | Fee transfer failed |
| u113 | Fee exceeds maximum |
| u114 | No fees to collect |

## Project Status

The router contract is fully functional with mock DEX quotes. Real ALEX and Velar `contract-call?` integration is the next milestone.

**Working:**
- On-chain routing logic with fee mechanism
- Wallet integration (Leather, Xverse)
- Swap UI with quote display and fee breakdown
- Contract + frontend test suites passing
- Emergency pause and admin controls

**Next:**
- Replace mock quotes with live ALEX/Velar contract calls
- Multi-hop routing
- Mainnet deployment

## License

MIT
