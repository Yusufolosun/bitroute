# Frequently Asked Questions (FAQ)

## General Questions

### What is BitRoute?

BitRoute is a decentralized exchange (DEX) aggregator for the Stacks blockchain that automatically finds the best prices across multiple DEXs (ALEX, Velar) and executes swaps with optimal routing.

### How does BitRoute work?

1. You select tokens and enter amount
2. BitRoute queries all integrated DEXs
3. Best price is calculated on-chain
4. Your swap executes on the DEX with best rate
5. You pay the same fees as going directly to that DEX

### Is BitRoute safe?

Yes! BitRoute is:
- **Non-custodial**: You always control your tokens
- **Open source**: Code is publicly auditable
- **On-chain**: All logic executes on Stacks blockchain
- **Slippage protected**: You set maximum price movement

### What tokens can I swap?

Currently in testnet phase with mock tokens. After mainnet launch, you'll be able to swap any SIP-010 token available on integrated DEXs.

---

## Usage Questions

### How do I connect my wallet?

1. Install [Leather](https://leather.io) or [Xverse](https://xverse.app)
2. Create/import wallet
3. Switch to Testnet (for testing)
4. Click "Connect Wallet" on BitRoute
5. Approve connection

### What is slippage tolerance?

Slippage is the difference between expected and actual price. Setting 0.5% means you accept up to 0.5% worse price than quoted. Higher slippage = higher chance of success, but potentially worse price.

**Recommendations**:
- Stablecoins: 0.1-0.3%
- Major tokens: 0.5-1%
- Low liquidity: 1-3%

### Why did my swap fail?

Common reasons:
- **Slippage too high**: Price moved more than tolerance
- **Insufficient balance**: Not enough tokens
- **Contract paused**: Emergency maintenance
- **Network congestion**: Try again with higher fees

### How long does a swap take?

- **Quote**: Instant (read-only call)
- **Transaction**: ~10-30 seconds on testnet
- **Confirmation**: Visible after 1 block

---

## Technical Questions

### What are micro-units?

Tokens are stored in smallest units:
- 1 STX = 1,000,000 µSTX (micro-STX)
- 1 USDA = 1,000,000 µUSDA

This prevents decimal math issues on-chain.

### How are fees calculated?

**BitRoute fees**: Currently 0% (no protocol fee)

**DEX fees**: 
- ALEX: ~0.3%
- Velar: ~0.3%

**Network fees**: ~0.002-0.005 STX per transaction

### Can I trust the price quotes?

Yes! Quotes are calculated on-chain by calling DEX contracts directly. The contract code is open source and verifiable.

### What if a DEX has a better price after I get a quote?

The quote shows expected output at that moment. Actual execution happens in your transaction. Slippage protection ensures you get at least your minimum acceptable amount.

---

## Troubleshooting

### "Wallet not connecting"

1. Refresh page
2. Ensure wallet extension is installed
3. Check wallet is unlocked
4. Try different browser
5. Clear browser cache

### "Transaction rejected"

1. Check wallet has enough STX for fees
2. Verify network matches (testnet/mainnet)
3. Increase slippage tolerance
4. Wait and try again

### "Invalid token address"

1. Ensure you're on correct network
2. Verify token is deployed
3. Check contract address format

### "Quote not loading"

1. Check internet connection
2. Verify Stacks API is online
3. Try refreshing page
4. Check browser console for errors

---

## Network Questions

### What is Testnet?

Testnet is a testing blockchain with free tokens for developers. Transactions are real but have no monetary value.

**How to get testnet STX**:
Visit https://explorer.hiro.so/sandbox/faucet?chain=testnet

### When will mainnet launch?

Mainnet deployment planned after:
- Security audit completion
- Real DEX integrations
- Comprehensive testing
- Community feedback

### Can I use BitRoute on mainnet now?

Not yet. Currently only available on testnet. Mainnet deployment coming soon!

---

## Development Questions

### Is BitRoute open source?

Yes! Licensed under MIT. View code on GitHub: [link]

### Can I contribute?

Absolutely! See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

### How can I integrate BitRoute?

For developers wanting to integrate:
```typescript
import { getBestRoute } from '@bitroute/sdk';

const quote = await getBestRoute(tokenIn, tokenOut, amount);
```

(SDK coming soon)

### Can I fork BitRoute?

Yes! It's MIT licensed. Please:
1. Give attribution
2. Don't use "BitRoute" name
3. Deploy your own contracts

---

## Business Questions

### How does BitRoute make money?

Currently no fees. Future revenue options:
- Small protocol fee (0.05-0.1%)
- Premium features
- Grants and partnerships

### Who built BitRoute?

BitRoute was built by [Your Name/Team] as part of the Stacks ecosystem growth.

### Is there a token?

No BitRoute token currently. Focus is on building best product.

---

## Safety & Security

### Has BitRoute been audited?

Testnet version not yet audited. Mainnet version will undergo professional security audit before launch.

### What if I find a bug?

**Security issues**: Email security@bitroute.io (if you set this up)

**Regular bugs**: Open issue on GitHub

**Reward**: Security bounty program (coming soon)

### Can my funds be stolen?

BitRoute is non-custodial and never holds your funds. Funds go directly from your wallet to DEX to your wallet. However:
- Always verify contract address
- Never share seed phrase
- Use hardware wallet for large amounts

---

## Comparison Questions

### BitRoute vs using DEX directly?

**BitRoute advantages**:
- Always get best price
- Don't need to check multiple DEXs
- One interface for all swaps

**Direct DEX**:
- Slightly lower gas (one less hop)
- Access to DEX-specific features

### BitRoute vs 1inch/Jupiter?

**Similar concept**, different chains:
- 1inch: Ethereum ecosystem
- Jupiter: Solana
- BitRoute: Stacks/Bitcoin ecosystem

**BitRoute unique**:
- Secured by Bitcoin
- sBTC integration (future)
- Bitcoin-native assets

---

## Future Features

### What's coming next?

**Phase 2**:
- Real DEX integrations
- DCA (automated regular purchases)
- Multi-hop routing

**Phase 3**:
- Limit orders
- Liquidity provision
- Analytics dashboard

**Phase 4**:
- Cross-chain routing (via sBTC)
- Mobile app
- Advanced trading tools

### Can I request features?

Yes! Open an issue on GitHub with tag `feature-request`.

---

## Still Have Questions?

- Join our [Discord/Telegram]
- Check [Documentation](./ARCHITECTURE.md)
- Open [GitHub Issue](https://github.com/yourusername/bitroute/issues)
- Email: support@bitroute.io (if applicable)
