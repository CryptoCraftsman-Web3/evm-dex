'use client';

import { TokenTransfer } from '@/lib/db-schemas/token-transfer';
import { Transaction } from '@/lib/db-schemas/transaction';
import { TableCell, TableRow } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNetwork } from 'wagmi';
import { getTokenTransfers } from './actions';

type TransactionRowProps = {
  tx: Transaction;
};

export default function TransactionRow({ tx }: TransactionRowProps) {
  const { chain } = useNetwork();

  const [tokenTransfers, setTokenTransfers] = useState<TokenTransfer[]>([]);

  useEffect(() => {
    getTokenTransfers(tx.hash as `0x${string}`).then((transfers) => {
      setTokenTransfers(transfers);
    });
  }, []);

  return (
    <>
      <TableRow
        key={tx.hash}
        sx={{
          borderBottom: tokenTransfers.length === 0 ? 1 : 0,
        }}
      >
        <TableCell sx={{ border: 0 }}>
          <a
            href={`${chain?.blockExplorers?.default.url}/tx/${tx.hash}`}
            target="_blank"
          >
            {tx.hash.substring(0, 6)}...{tx.hash.substring(58, 66)}
          </a>
        </TableCell>
        <TableCell sx={{ border: 0 }}>
          {tx.timestamp.toLocaleDateString()} {tx.timestamp.toLocaleTimeString()}
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{ textTransform: 'capitalize', border: 0 }}
        >
          {tx.status}
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{ textTransform: 'capitalize', border: 0 }}
        >
          {tx.functionName}
        </TableCell>

        <TableCell sx={{ border: 0 }}>
          <a
            href={`${chain?.blockExplorers?.default.url}/address/${tx.to}`}
            target="_blank"
          >
            {tx.to.substring(0, 6)}...{tx.to.substring(38, 42)}
          </a>
        </TableCell>
        <TableCell sx={{ border: 0 }}>{tx.blockNumber?.toString()}</TableCell>
      </TableRow>
      {tokenTransfers.length > 0 && (
        <TableRow
          sx={{
            borderBottom: 1,
          }}
        >
          <TableCell
            colSpan={5}
            sx={{ border: 0 }}
          >
            {tokenTransfers.map((transfer) => (
              `${transfer.direction === 'in' ? 'Received' : 'Sent'} ${transfer.amount} ${transfer.tokenSymbol}`
            )).join(', ')}
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
