import {
  callReadOnlyFunction,
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  FungibleConditionCode,
  makeStandardSTXPostCondition,
} from '@stacks/transactions';
import { StacksNetwork } from '@stacks/network';
import {
  CONTRACT_ADDRESS,
  CONTRACT_NAME,
  DEFAULT_NETWORK,
  DEX,
} from './constants';
import {
  getNetwork,
  toUintCV,
  toPrincipalCV,
  parseClarityValue,
  stxToMicro,
} from './stacks';

// Types for contract responses
export interface BestRouteResponse {
  bestDex: number;
  expectedAmountOut: bigint;
  alexQuote: bigint;
  velarQuote: bigint;
}

export interface SwapResult {
  dexUsed: number;
  amountOut: bigint;
}

/**
 * Get the best route for a token swap across all integrated DEXs
 * 
 * @param tokenIn - Contract principal of input token
 * @param tokenOut - Contract principal of output token
 * @param amountIn - Amount to swap (in decimal form, e.g., 100 for 100 STX)
 * @returns Promise resolving to best route details including quotes from all DEXs
 * @throws Error if contract call fails or returns invalid data
 * 
 * @example
 * ```typescript
 * const route = await getBestRoute(
 *   'ST2NEB...stx-token',
 *   'ST2NEB...usda-token',
 *   100
 * );
 * console.log(`Best DEX: ${route.bestDex}`);
 * ```
 */
export async function getBestRoute(
  tokenIn: string,
  tokenOut: string,
  amountIn: number
): Promise<BestRouteResponse> {
  const network = getNetwork();
  const contractAddress = CONTRACT_ADDRESS[DEFAULT_NETWORK];
  
  try {
    console.log('🔍 Getting best route...', { tokenIn, tokenOut, amountIn });
    
    const result = await callReadOnlyFunction({
      network,
      contractAddress,
      contractName: CONTRACT_NAME,
      functionName: 'get-best-route',
      functionArgs: [
        toPrincipalCV(tokenIn),
        toPrincipalCV(tokenOut),
        toUintCV(stxToMicro(amountIn)),
      ],
      senderAddress: contractAddress,
    });

    console.log('📦 Raw result:', result);
    
    const parsed = parseClarityValue(result);
    console.log('✅ Parsed result:', parsed);
    
    if (parsed.success && parsed.value && parsed.value.value) {
      // The contract returns a response with nested tuple
      const tupleData = parsed.value.value;
      console.log('📋 Tuple data:', tupleData);
      
      return {
        bestDex: Number(tupleData['best-dex']?.value || 1),
        expectedAmountOut: BigInt(tupleData['expected-amount-out']?.value || 0),
        alexQuote: BigInt(tupleData['alex-quote']?.value || 0),
        velarQuote: BigInt(tupleData['velar-quote']?.value || 0),
      };
    }
    
    // Log the error response for debugging
    console.error('❌ Contract call failed:', parsed);
    throw new Error('Failed to get route: ' + JSON.stringify(parsed));
  } catch (error) {
    console.error('❌ Error getting best route:', error);
    throw error;
  }
}

/**
 * Execute an auto-routed swap transaction on the best available DEX
 * 
 * @param userSession - Authenticated user session from Stacks Connect
 * @param tokenIn - Contract principal of input token
 * @param tokenOut - Contract principal of output token
 * @param amountIn - Amount to swap (in decimal form)
 * @param minAmountOut - Minimum acceptable output (slippage protection)
 * @returns Promise resolving when transaction is broadcasted
 * @throws Error if transaction fails or user rejects
 * 
 * @example
 * ```typescript
 * await executeAutoSwap(
 *   userSession,
 *   'ST2NEB...stx-token',
 *   'ST2NEB...usda-token',
 *   100,
 *   95  // 5% slippage tolerance
 * );
 * ```
 */
export async function executeAutoSwap(
  userSession: any,
  tokenIn: string,
  tokenOut: string,
  amountIn: number,
  minAmountOut: number,
  onFinish?: (data: any) => void,
  onCancel?: () => void
) {
  const network = getNetwork();
  const contractAddress = CONTRACT_ADDRESS[DEFAULT_NETWORK];
  
  try {
    console.log('💱 Executing swap...', {
      tokenIn,
      tokenOut,
      amountIn,
      minAmountOut,
    });

    // Build transaction options
    const txOptions = {
      network,
      anchorMode: AnchorMode.Any,
      contractAddress,
      contractName: CONTRACT_NAME,
      functionName: 'execute-auto-swap',
      functionArgs: [
        toPrincipalCV(tokenIn),
        toPrincipalCV(tokenOut),
        toUintCV(stxToMicro(amountIn)),
        toUintCV(stxToMicro(minAmountOut)),
      ],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [
        // Add post-condition to ensure user is spending
        // TODO: Add proper token post-conditions
      ],
      onFinish: (data: any) => {
        console.log('✅ Transaction broadcast:', data);
        if (onFinish) onFinish(data);
      },
      onCancel: () => {
        console.log('❌ Transaction cancelled');
        if (onCancel) onCancel();
      },
    };

    // For now, return the options for openContractCall
    return txOptions;
  } catch (error) {
    console.error('❌ Error executing swap:', error);
    throw error;
  }
}

/**
 * Check if contract is paused (read-only)
 */
export async function isContractPaused(): Promise<boolean> {
  const network = getNetwork();
  const contractAddress = CONTRACT_ADDRESS[DEFAULT_NETWORK];
  
  try {
    const result = await callReadOnlyFunction({
      network,
      contractAddress,
      contractName: CONTRACT_NAME,
      functionName: 'is-paused',
      functionArgs: [],
      senderAddress: contractAddress,
    });

    const parsed = parseClarityValue(result);
    return parsed.success && parsed.value === true;
  } catch (error) {
    console.error('❌ Error checking pause status:', error);
    return false;
  }
}

/**
 * Get DEX volume (read-only)
 */
export async function getDexVolume(dexId: number): Promise<bigint> {
  const network = getNetwork();
  const contractAddress = CONTRACT_ADDRESS[DEFAULT_NETWORK];
  
  try {
    const result = await callReadOnlyFunction({
      network,
      contractAddress,
      contractName: CONTRACT_NAME,
      functionName: 'get-dex-volume',
      functionArgs: [toUintCV(dexId)],
      senderAddress: contractAddress,
    });

    const parsed = parseClarityValue(result);
    return parsed.success ? BigInt(parsed.value) : BigInt(0);
  } catch (error) {
    console.error('❌ Error getting DEX volume:', error);
    return BigInt(0);
  }
}

/**
 * Helper: Convert DEX ID to name
 */
export function getDexName(dexId: number): string {
  switch (dexId) {
    case DEX.ALEX:
      return 'ALEX';
    case DEX.VELAR:
      return 'Velar';
    default:
      return 'Unknown';
  }
}
