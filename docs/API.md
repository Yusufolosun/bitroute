# BitRoute API Documentation

## Smart Contract API

### Contract Address
- **Testnet**: `ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND.router`
- **Mainnet**: TBD

---

## Read-Only Functions

### get-best-route

Get the best price quote across all integrated DEXs.

**Function Signature:**
```clarity
(define-read-only (get-best-route
    (token-in principal)
    (token-out principal)
    (amount-in uint))
    (response {...} uint)
)
```

**Parameters:**
- `token-in`: Contract principal of input token
- `token-out`: Contract principal of output token
- `amount-in`: Amount in micro-units (1 STX = 1,000,000 µSTX)

**Returns:**
```clarity
(ok {
  best-dex: uint,              // 1=ALEX, 2=Velar
  expected-amount-out: uint,   // Expected output (micro-units)
  alex-quote: uint,            // ALEX quote (micro-units)
  velar-quote: uint            // Velar quote (micro-units)
})
```

**Example (JavaScript):**
```javascript
import { callReadOnlyFunction, principalCV, uintCV } from '@stacks/transactions';

const result = await callReadOnlyFunction({
  network: new StacksTestnet(),
  contractAddress: 'ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND',
  contractName: 'router',
  functionName: 'get-best-route',
  functionArgs: [
    principalCV('ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND.stx-token'),
    principalCV('ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND.usda-token'),
    uintCV(100000000), // 100 STX
  ],
  senderAddress: 'ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND',
});
```

---

### is-paused

Check if the contract is currently paused.

**Function Signature:**
```clarity
(define-read-only (is-paused)
    (response bool uint)
)
```

**Returns:**
```clarity
(ok true)  // Contract is paused
(ok false) // Contract is active
```

---

### get-dex-volume

Get total volume routed through a specific DEX.

**Function Signature:**
```clarity
(define-read-only (get-dex-volume (dex-id uint))
    (response uint uint)
)
```

**Parameters:**
- `dex-id`: DEX identifier (1=ALEX, 2=Velar)

**Returns:**
```clarity
(ok u1000000000) // Total volume in micro-units
```

---

### get-user-stats

Get swap statistics for a specific user.

**Function Signature:**
```clarity
(define-read-only (get-user-stats (user principal))
    (response {swap-count: uint, total-volume: uint} uint)
)
```

**Returns:**
```clarity
(ok {
  swap-count: u10,
  total-volume: u5000000000
})
```

---

## Public Functions

### execute-auto-swap

Execute a token swap on the best available DEX.

**Function Signature:**
```clarity
(define-public (execute-auto-swap
    (token-in <ft-trait>)
    (token-out <ft-trait>)
    (amount-in uint)
    (min-amount-out uint))
    (response {...} uint)
)
```

**Parameters:**
- `token-in`: Input token contract (must implement SIP-010)
- `token-out`: Output token contract (must implement SIP-010)
- `amount-in`: Amount to swap (micro-units)
- `min-amount-out`: Minimum acceptable output (slippage protection)

**Returns:**
```clarity
(ok {
  dex-used: u1,
  amount-out: u95000000
})
```

**Errors:**
- `(err u101)`: Slippage too high (output < min-amount-out)
- `(err u102)`: Invalid amount (amount-in = 0)
- `(err u103)`: Contract paused
- `(err u104)`: DEX call failed

**Example (JavaScript):**
```javascript
import { openContractCall } from '@stacks/connect';

await openContractCall({
  network: new StacksTestnet(),
  contractAddress: 'ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND',
  contractName: 'router',
  functionName: 'execute-auto-swap',
  functionArgs: [
    contractPrincipalCV('ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND', 'stx-token'),
    contractPrincipalCV('ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND', 'usda-token'),
    uintCV(100000000),  // 100 STX
    uintCV(95000000),   // Min 95 USDA (5% slippage)
  ],
  onFinish: (data) => console.log('TX:', data.txId),
});
```

---

### set-paused

Emergency pause/unpause the contract (admin only).

**Function Signature:**
```clarity
(define-public (set-paused (paused bool))
    (response bool uint)
)
```

**Parameters:**
- `paused`: true to pause, false to unpause

**Authorization:**
- Only `CONTRACT-OWNER` can call this function

**Errors:**
- `(err u100)`: Not authorized (caller is not owner)

---

## Error Codes

| Code | Constant | Description |
|------|----------|-------------|
| 100 | `ERR-NOT-AUTHORIZED` | Caller lacks permission |
| 101 | `ERR-SLIPPAGE-TOO-HIGH` | Output below minimum |
| 102 | `ERR-INVALID-AMOUNT` | Amount is zero |
| 103 | `ERR-CONTRACT-PAUSED` | Contract is paused |
| 104 | `ERR-DEX-CALL-FAILED` | DEX integration error |

---

## Events

Currently, the contract does not emit custom events. Transaction success/failure can be monitored via the Stacks API.

---

## Rate Limits

When using the Stacks API:
- **Read-only calls**: No limit (processed by nodes)
- **Write transactions**: Limited by block time (~10 seconds on testnet)

---

## Best Practices

### Slippage Calculation
```javascript
const slippagePercent = 0.5; // 0.5%
const minAmountOut = expectedAmount * (1 - slippagePercent / 100);
```

### Amount Conversion
```javascript
// STX to microSTX
const microStx = stxAmount * 1_000_000;

// microSTX to STX
const stx = microStx / 1_000_000;
```

### Error Handling
```javascript
try {
  const result = await executeSwap(...);
  if (result.success) {
    console.log('Swap successful:', result.value);
  }
} catch (error) {
  if (error.message.includes('u101')) {
    alert('Slippage too high. Try increasing slippage tolerance.');
  }
}
```

---

## Testing Endpoints

### Testnet Faucet
Get testnet STX: https://explorer.hiro.so/sandbox/faucet?chain=testnet

### Explorer
View transactions: https://explorer.hiro.so/txid/0x...?chain=testnet

### API Base URL
```
https://api.testnet.hiro.so
```

---

## Support

For API issues or questions:
- Open an issue on GitHub
- Check [Stacks Documentation](https://docs.stacks.co)
- Join [Stacks Discord](https://discord.gg/stacks)
