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

/**
 * Get the current Stacks network configuration
 */
export function getNetwork() {
  return NETWORKS[DEFAULT_NETWORK];
}

/**
 * Convert microSTX to STX
 * @param micro - Amount in microSTX (1 STX = 1,000,000 microSTX)
 * @returns Amount in STX
 */
export function microToStx(micro: number | bigint): number {
  return Number(micro) / 1_000_000;
}

/**
 * Convert STX to microSTX
 * @param stx - Amount in STX
 * @returns Amount in microSTX
 */
export function stxToMicro(stx: number): bigint {
  return BigInt(Math.floor(stx * 1_000_000));
}

/**
 * Format STX amount for display
 * @param amount - Amount in STX or microSTX
 * @returns Formatted string with comma separators
 */
export function formatStx(amount: number | bigint): string {
  const stx = typeof amount === 'bigint' ? microToStx(amount) : amount;
  return stx.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
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
  return principalCV(address);
}
