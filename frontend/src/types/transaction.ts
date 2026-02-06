export enum TransactionStatus {
  IDLE = 'idle',
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export interface Transaction {
  txId: string;
  status: TransactionStatus;
  timestamp: number;
  type: 'swap';
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountOut: string;
  dex: string;
  error?: string;
}

export interface TransactionState {
  current: Transaction | null;
  history: Transaction[];
}
