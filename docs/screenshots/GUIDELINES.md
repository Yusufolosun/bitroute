# Screenshot Guidelines

To ensure high-quality, consistent screenshots for documentation and marketing, follow these guidelines:

## General Principles
- Use the latest version of BitRoute (testnet or mainnet)
- Hide sensitive/private information (addresses, mnemonics)
- Use light mode unless dark mode is being demonstrated
- Crop to focus on relevant UI
- Use PNG format for lossless quality
- Name files descriptively (e.g., `swap-success.png`, `connect-wallet.png`)

## Required Screenshots

1. **Home Page**: Clean, no wallet connected
2. **Wallet Connect**: Wallet connection modal open
3. **Swap Form**: Filled with example tokens/amounts
4. **Quote Display**: Best route shown
5. **Transaction Toast**: Success and error states
6. **Transaction History**: Populated with sample data
7. **Network Status**: Network indicator (testnet/mainnet)
8. **Mobile View**: Responsive layout on mobile

## How to Capture
- Use built-in OS screenshot tools (Snipping Tool, macOS Screenshot, etc.)
- For mobile, use browser device emulation (Chrome DevTools > Toggle Device Toolbar)
- Save to `docs/screenshots/`

## Example Naming
- `home-page.png`
- `swap-form-filled.png`
- `transaction-success-toast.png`

## Where to Use
- `README.md`
- `docs/ARCHITECTURE.md`
- GitHub issues/PRs

## Tips
- Use demo/testnet accounts
- Blur or redact wallet addresses if needed
- Keep UI up to date with latest design

---

For questions, contact the project maintainers.
