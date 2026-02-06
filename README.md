# BitRoute 🚀

> Universal Liquidity Layer for Bitcoin L2s

BitRoute is a decentralized exchange (DEX) aggregator built on the Stacks blockchain that automatically routes token swaps through multiple DEXs (ALEX and Velar) to ensure users always get the best prices.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stacks](https://img.shields.io/badge/Stacks-Testnet-purple)](https://explorer.hiro.so/txid/0x?chain=testnet)

## 🎯 Problem Statement

The Stacks ecosystem suffers from liquidity fragmentation across multiple DEXs:
- Users must manually check prices on ALEX, Velar, and Bitflow
- Large swaps experience significant slippage on single DEXs
- No unified interface for optimal trade execution

## ✨ Solution

BitRoute solves this by:
- **Auto-routing**: Queries all major DEXs and routes to the best price
- **Slippage protection**: User-defined maximum price movement tolerance
- **One-click swaps**: Simple UX that abstracts complexity
- **Non-custodial**: Users maintain full control of their assets

## 🏗️ Architecture

### Smart Contract (Clarity)
- **Router Contract**: On-chain price discovery and swap execution
- **Deployed to**: Stacks Testnet
- **Address**: `ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND.router`

### Frontend (Next.js + React)
- **Wallet Integration**: Leather and Xverse support
- **Real-time Quotes**: Direct contract calls via Stacks.js
- **Transaction Monitoring**: Live status updates

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Clarinet 2.x
- Leather or Xverse wallet

### Installation
```bash
# Clone repository
git clone https://github.com/yourusername/bitroute.git
cd bitroute

# Install contract dependencies
cd contracts
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running Locally
```bash
# Start frontend dev server
cd frontend
npm run dev

# Visit http://localhost:3000
```

### Testing Smart Contracts
```bash
cd contracts

# Run unit tests
clarinet test

# Start local console
clarinet console
```

## 📖 Usage

1. **Connect Wallet**: Click "Connect Wallet" and approve in Leather/Xverse
2. **Select Tokens**: Choose token pair (e.g., STX → USDA)
3. **Enter Amount**: Input swap amount
4. **Get Quote**: Click "Get Best Price" to see routing
5. **Execute Swap**: Click "Swap Tokens" and confirm transaction

## 🛠️ Tech Stack

- **Smart Contracts**: Clarity (Stacks blockchain)
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Blockchain Integration**: Stacks.js, @stacks/connect
- **Testing**: Clarinet, Vitest

## 📊 Features

- ✅ Multi-DEX price comparison
- ✅ Auto-routing to best price
- ✅ Slippage tolerance controls
- ✅ Transaction history
- ✅ Real-time status updates
- ✅ Testnet deployment
- 🚧 DCA (Dollar Cost Averaging) vault
- 🚧 Mainnet deployment
- 🚧 Analytics dashboard

## 🧪 Testing

The project includes comprehensive test coverage:
```bash
# Smart contract tests
cd contracts
clarinet test

# Frontend tests (if applicable)
cd frontend
npm test
```

## 📜 Contract Functions

### Read-Only Functions
- `get-best-route`: Returns optimal DEX and expected output
- `is-paused`: Check if contract is paused
- `get-dex-volume`: Query total volume by DEX
- `get-user-stats`: Retrieve user swap history

### Public Functions
- `execute-auto-swap`: Execute swap on best DEX
- `set-paused`: Emergency circuit breaker (admin only)

## 🗺️ Roadmap

### Phase 1: MVP ✅
- [x] Core router contract
- [x] Basic frontend
- [x] Testnet deployment
- [x] Wallet integration

### Phase 2: Enhancement 🚧
- [ ] Real DEX integrations (ALEX, Velar)
- [ ] DCA vault functionality
- [ ] Multi-hop routing
- [ ] Price impact warnings

### Phase 3: Production 📅
- [ ] Security audit
- [ ] Mainnet deployment
- [ ] Analytics dashboard
- [ ] Liquidity pool insights

## 🤝 Contributing

Contributions welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🔗 Links

- **Explorer**: [View Contract](https://explorer.hiro.so/address/ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND?chain=testnet)
- **Documentation**: See [ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **Stacks**: [https://www.stacks.co](https://www.stacks.co)

## 👥 Team

Built with ❤️ by [Your Name]

## 🙏 Acknowledgments

- Stacks Foundation for blockchain infrastructure
- Hiro for development tools (Clarinet, Stacks.js)
- ALEX and Velar for DEX protocols
