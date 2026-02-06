# Deployment Guide

This guide covers deploying BitRoute to testnet and mainnet.

## Prerequisites

- [ ] Clarinet 2.x installed
- [ ] Node.js 18+ installed
- [ ] Testnet/Mainnet STX for deployment fees
- [ ] Contract tested locally

---

## Testnet Deployment

### Step 1: Configure Network

Edit `contracts/settings/Testnet.toml`:
```toml
[accounts.deployer]
mnemonic = "your twelve word mnemonic phrase here..."
balance = 100_000_000_000_000
```

**Security**: Never commit real mnemonics to git!

### Step 2: Get Testnet STX

Visit faucet: https://explorer.hiro.so/sandbox/faucet?chain=testnet

Request STX to deployer address from Testnet.toml.

### Step 3: Generate Deployment Plan
```bash
cd contracts
clarinet deployments generate --testnet --low-cost
```

This creates `deployments/default.testnet-plan.yaml`.

### Step 4: Deploy Contract
```bash
clarinet deployments apply --testnet
```

Confirm the transaction when prompted.

### Step 5: Verify Deployment

Check explorer:
```
https://explorer.hiro.so/address/YOUR_ADDRESS?chain=testnet
```

Contract should appear in "Contracts" tab.

### Step 6: Update Frontend

Edit `frontend/src/lib/constants.ts`:
```typescript
export const CONTRACT_ADDRESS = {
  testnet: 'YOUR_DEPLOYED_ADDRESS',
  // ...
};
```

Update `.env.local`:
```env
NEXT_PUBLIC_NETWORK=testnet
```

---

## Mainnet Deployment

### ⚠️ Pre-Deployment Checklist

- [ ] All tests passing (`clarinet test`)
- [ ] Security audit completed
- [ ] Functionality verified on testnet
- [ ] Gas costs optimized
- [ ] Emergency procedures documented
- [ ] Multi-sig wallet setup (recommended)

### Step 1: Mainnet Configuration

Edit `contracts/settings/Mainnet.toml`:
```toml
[accounts.deployer]
mnemonic = "SECURE_MNEMONIC_HERE"  # Use hardware wallet!
```

### Step 2: Acquire Mainnet STX

Purchase STX from exchanges or use existing holdings.

**Minimum required**: ~0.05 STX for deployment

### Step 3: Generate Mainnet Plan
```bash
cd contracts
clarinet deployments generate --mainnet --low-cost
```

Review `deployments/default.mainnet-plan.yaml` carefully.

### Step 4: Deploy to Mainnet
```bash
clarinet deployments apply --mainnet
```

**⚠️ CRITICAL**: This costs real STX. Double-check everything!

### Step 5: Verify on Explorer
```
https://explorer.hiro.so/address/YOUR_ADDRESS?chain=mainnet
```

### Step 6: Update Production Frontend
```typescript
export const CONTRACT_ADDRESS = {
  mainnet: 'YOUR_MAINNET_ADDRESS',
};
```
```env
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_STACKS_API_URL=https://api.mainnet.hiro.so
```

---

## Frontend Deployment (Vercel)

### Step 1: Prepare Repository

Ensure code is pushed to GitHub/GitLab.

### Step 2: Connect to Vercel

1. Visit https://vercel.com
2. Click "New Project"
3. Import your repository
4. Select `frontend` as root directory

### Step 3: Configure Build

**Framework Preset**: Next.js

**Build Command**: `npm run build`

**Output Directory**: `.next`

**Install Command**: `npm install`

### Step 4: Environment Variables

Add in Vercel dashboard:
```
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_STACKS_API_URL=https://api.testnet.hiro.so
```

For production:
```
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_STACKS_API_URL=https://api.mainnet.hiro.so
```

### Step 5: Deploy

Click "Deploy" and wait for build to complete.

Your app will be live at: `https://your-project.vercel.app`

### Step 6: Custom Domain (Optional)

1. Purchase domain (e.g., bitroute.io)
2. Add domain in Vercel dashboard
3. Configure DNS records
4. Wait for SSL certificate

---

## Post-Deployment

### Monitoring

1. **Transaction Activity**: Watch explorer for contract calls
2. **Error Tracking**: Monitor frontend logs
3. **User Feedback**: Set up feedback channels

### Maintenance

1. **Regular Updates**: Keep dependencies updated
2. **Security Patches**: Monitor for vulnerabilities
3. **Performance**: Track gas costs and optimize

### Emergency Procedures

If critical issue discovered:

1. **Pause Contract**:
```clarity
   (contract-call? .router set-paused true)
```

2. **Notify Users**: Update frontend with warning

3. **Investigate**: Review transaction logs

4. **Fix & Redeploy**: Deploy patched version

---

## Rollback Procedures

### Contract Rollback

**Cannot rollback deployed contracts!**

Instead:
1. Deploy new version with fixes
2. Update frontend to use new contract
3. Migrate state if needed

### Frontend Rollback

Vercel:
1. Go to Deployments tab
2. Find previous working deployment
3. Click "Promote to Production"

---

## Cost Estimates

### Testnet
- Contract deployment: FREE (faucet STX)
- Transaction testing: FREE

### Mainnet
- Contract deployment: ~0.04 STX (~$0.08)
- Each swap (user pays): ~0.002 STX (~$0.004)

### Frontend Hosting
- Vercel (Free tier): $0/month
- Vercel (Pro): $20/month
- Custom domain: ~$12/year

---

## Troubleshooting

### "Insufficient balance"
- Get more STX from faucet (testnet) or exchange (mainnet)

### "Contract already exists"
- Contract name already taken
- Change contract name or use different deployer address

### "Transaction failed"
- Check Clarity syntax: `clarinet check`
- Review error message in explorer
- Verify network configuration

### Frontend not connecting
- Check `NEXT_PUBLIC_NETWORK` matches deployed network
- Verify contract address in constants.ts
- Check browser console for errors

---

## Security Best Practices

1. **Never commit private keys**: Use `.gitignore`
2. **Use hardware wallets**: For mainnet deployments
3. **Test thoroughly**: On testnet before mainnet
4. **Audit code**: Get professional audit for mainnet
5. **Implement pause**: Have emergency shutdown
6. **Monitor actively**: Watch for unusual activity

---

## Support

Need help deploying?
- Check [Clarinet Docs](https://docs.hiro.so/clarinet)
- Join [Stacks Discord](https://discord.gg/stacks)
- Open GitHub issue
