'use client';

import { Transaction } from '@/lib/db-schemas/transaction';
import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

type TransactionsClientPageProps = {
  userTransactions: Transaction[];
};

export default function TransactionsClientPage({ userTransactions }: TransactionsClientPageProps) {
  return (
    <>
      <Typography variant="h4">
        <b>Transactions</b>
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          p: { xs: 2, md: 4 },
          w: { xs: '100%', md: '600px', lg: '800px' },
        }}
      >
        <Table
          sx={{ minWidth: 650 }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>Function Name</TableCell>
              <TableCell>Tx Hash</TableCell>
              {/* <TableCell>From</TableCell> */}
              <TableCell>To</TableCell>
              <TableCell>Block Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userTransactions.map((tx) => (
              <TableRow
                key={tx.hash}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ textTransform: 'capitalize' }}
                >
                  {tx.status}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ textTransform: 'capitalize' }}
                >
                  {tx.functionName}
                </TableCell>
                <TableCell>
                  {tx.hash.substring(0, 6)}...{tx.hash.substring(58, 66)}
                </TableCell>
                {/* <TableCell>
                  {tx.from.substring(0, 6)}...{tx.from.substring(38, 42)}
                </TableCell> */}
                <TableCell>
                  {tx.to.substring(0, 6)}...{tx.to.substring(38, 42)}
                </TableCell>
                <TableCell>{tx.blockNumber?.toString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {userTransactions.map((tx) => (
          <></>
        ))}
      </Paper>
    </>
  );
}
