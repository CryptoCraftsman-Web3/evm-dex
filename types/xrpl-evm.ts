export interface TokenTransfers {
  message: string
  result: TokenTransferResult[]
  status: string
}

export interface TokenTransferResult {
  value?: string
  blockHash: string
  blockNumber: string
  confirmations: string
  contractAddress: string
  cumulativeGasUsed: string
  from: string
  gas: string
  gasPrice: string
  gasUsed: string
  hash: string
  input: string
  logIndex: string
  nonce: string
  timeStamp: string
  to: string
  tokenDecimal: string
  tokenName: string
  tokenSymbol: string
  transactionIndex: string
  tokenID?: string
}