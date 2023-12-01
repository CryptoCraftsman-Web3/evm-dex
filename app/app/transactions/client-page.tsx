'use client';

import { Transaction } from '@/lib/db-schemas/transaction';
import { Paper, Tab, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useNetwork } from 'wagmi';
import TransactionRow from './transaction-row';

type TransactionsClientPageProps = {
  userTransactions: Transaction[];
};

export default function TransactionsClientPage({ userTransactions }: TransactionsClientPageProps) {
  const { chain } = useNetwork();

  return (
    <>
      <Typography variant="h4">
        <b>Transactions</b>
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          padding: { xs: 2, md: 4 },
          width: { xs: '100%', md: '100%', lg: '80%' },
          overflowX: 'auto',
        }}
      >
        <Table
          sx={{ minWidth: 650, width: '100%', display: 'block' }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Tx Hash</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Function Name</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Block Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userTransactions.map((tx) => (
              <TransactionRow tx={tx} key={tx.hash} />
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}
