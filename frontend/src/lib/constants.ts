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
