import { StacksMainnet, StacksTestnet, StacksMocknet } from '@stacks/network';

// Network configurations
export const NETWORKS = {
  mainnet: new StacksMainnet(),
  testnet: new StacksTestnet(),
  devnet: new StacksMocknet({ url: 'http://localhost:20444' }), // Custom devnet port
} as const;

// Contract deployment addresses (update after deployment)
export const CONTRACT_ADDRESS = {
  devnet: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  testnet: 'ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND', // ✅ YOUR DEPLOYED ADDRESS
  mainnet: '',
} as const;

export const CONTRACT_NAME = 'router';

// Default network (change based on environment)
export const DEFAULT_NETWORK = 
  process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? 'mainnet' :
  process.env.NEXT_PUBLIC_NETWORK === 'testnet' ? 'testnet' : 
  'devnet';

// Mock token addresses for testing (Devnet)
export const MOCK_TOKENS = {
  STX: {
    symbol: 'STX',
    name: 'Stacks',
    decimals: 6,
    // STX is native, no contract address
  },
  USDA: {
    symbol: 'USDA',
    name: 'USD Arkadiko',
    decimals: 6,
    address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usda-token', // Mock
  },
  sBTC: {
    symbol: 'sBTC',
    name: 'Synthetic Bitcoin',
    decimals: 8,
    address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sbtc-token', // Mock
  },
} as const;

// Real Stacks Mainnet Token Addresses
export const MAINNET_TOKENS = {
  // Wrapped STX (ALEX)
  WSTX_ALEX: {
    symbol: 'wSTX',
    name: 'Wrapped STX (ALEX)',
    decimals: 6,
    address: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.token-wstx',
    dex: 'ALEX',
  },
  
  // Wrapped STX (Velar)
  WSTX_VELAR: {
    symbol: 'wSTX',
    name: 'Wrapped STX (Velar)',
    decimals: 6,
    address: 'SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.wstx',
    dex: 'Velar',
  },
  
  // USDA
  USDA: {
    symbol: 'USDA',
    name: 'USD Arkadiko',
    decimals: 6,
    address: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.usda-token',
  },
  
  // ALEX Token
  ALEX: {
    symbol: 'ALEX',
    name: 'ALEX Token',
    decimals: 8,
    address: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.age000-governance-token',
  },
  
  // Velar Token
  VELAR: {
    symbol: 'VELAR',
    name: 'Velar Token',
    decimals: 6,
    address: 'SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.velar-token',
  },
  
  // sBTC (wrapped Bitcoin)
  SBTC: {
    symbol: 'sBTC',
    name: 'Synthetic Bitcoin',
    decimals: 8,
    address: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.token-wbtc',
  },
} as const;

// Network-specific token lists
export const getTokensForNetwork = (network: 'mainnet' | 'testnet' | 'devnet') => {
  switch (network) {
    case 'mainnet':
      return Object.values(MAINNET_TOKENS);
    case 'testnet':
      // Use mainnet addresses for testnet (they work cross-network)
      return Object.values(MAINNET_TOKENS);
    default:
      return Object.values(MOCK_TOKENS);  // Keep mock for devnet
  }
};

// DEX identifiers (must match contract)
export const DEX = {
  ALEX: 1,
  VELAR: 2,
} as const;

// Error codes (must match contract)
export const ERRORS = {
  NOT_AUTHORIZED: 100,
  SLIPPAGE_TOO_HIGH: 101,
  INVALID_AMOUNT: 102,
  CONTRACT_PAUSED: 103,
  DEX_CALL_FAILED: 104,
} as const;

// UI configuration
export const UI_CONFIG = {
  DEFAULT_SLIPPAGE: 0.5, // 0.5%
  MAX_SLIPPAGE: 5.0,     // 5%
  MIN_SLIPPAGE: 0.1,     // 0.1%
} as const;
