import { 
  openContractCall,
  openSTXTransfer,
} from '@stacks/connect';
import {
  uintCV,
  principalCV,
  contractPrincipalCV,
  cvToJSON,
  ClarityValue,
} from '@stacks/transactions';
import { 
  CONTRACT_ADDRESS, 
  CONTRACT_NAME, 
  DEFAULT_NETWORK,
  NETWORKS,
} from './constants';
import {
  formatSTX,
  formatSTXWithUnit,
  toMicroSTX,
  toSTX,
  shortenAddress,
  txUrl,
  validateStake,
  registerErrors,
  decodeError,
  isValidAddress,
  validatePrincipal,
} from '@yusufolosun/stx-utils';

// Re-export stx-utils functions for use across the app
export {
  formatSTX,
  formatSTXWithUnit,
  shortenAddress,
  txUrl,
  validateStake,
  decodeError,
  isValidAddress,
  validatePrincipal,
};

// Register BitRoute contract error codes on module load
registerErrors({
  100: 'Not authorized',
  101: 'Slippage too high — output below your minimum',
  102: 'Invalid amount',
  103: 'Contract is paused',
  104: 'DEX call failed',
  105: 'No liquidity available',
  106: 'Both DEXs failed',
  107: 'Amount too large',
  108: 'Cannot swap same token',
  109: 'Invalid slippage parameter',
  112: 'Fee transfer failed',
  113: 'Fee exceeds maximum',
  114: 'No fees to collect',
});

/**
 * Get the current Stacks network configuration
 */
export function getNetwork() {
  return NETWORKS[DEFAULT_NETWORK];
}

/**
 * Convert microSTX to STX (delegates to @yusufolosun/stx-utils)
 */
export function microToStx(micro: number | bigint): number {
  return toSTX(Number(micro));
}

/**
 * Convert STX to microSTX (delegates to @yusufolosun/stx-utils)
 */
export function stxToMicro(stx: number): bigint {
  return BigInt(toMicroSTX(stx));
}

/**
 * Format STX amount for display (delegates to @yusufolosun/stx-utils)
 */
export function formatStx(amount: number | bigint): string {
  if (typeof amount === 'bigint' || amount > 1_000) {
    // Treat as microSTX
    return formatSTX(Number(amount), 6);
  }
  // Already in STX — convert to micro first for consistent formatting
  return formatSTX(toMicroSTX(amount), 6);
}

/**
 * Parse Clarity value to JavaScript object
 * @param value - Clarity value from contract call
 * @returns JavaScript representation of the value
 */
export function parseClarityValue(value: ClarityValue): any {
  return cvToJSON(value);
}

/**
 * Build contract principal Clarity value
 * @param network - Network environment (devnet/testnet/mainnet)
 * @returns Contract principal CV
 */
export function getContractPrincipal(network: keyof typeof CONTRACT_ADDRESS = DEFAULT_NETWORK) {
  return contractPrincipalCV(CONTRACT_ADDRESS[network], CONTRACT_NAME);
}

/**
 * Helper to create uint Clarity value
 * @param value - Number or BigInt value
 * @returns Uint Clarity value
 */
export function toUintCV(value: number | bigint): ReturnType<typeof uintCV> {
  return uintCV(value);
}

/**
 * Helper to create principal Clarity value
 * @param address - Stacks address
 * @returns Principal Clarity value
 */
export function toPrincipalCV(address: string): ReturnType<typeof principalCV> {
  console.log('🏗️ Creating principal CV for address:', address, 'length:', address.length);
  return principalCV(address);
}
