import { getSession } from '@/lib/auth';
import TransactionsClientPage from './client-page';
import { Transaction, transactions } from '@/lib/db-schemas/transaction';
import { db } from '@/lib/database';
import { desc, eq } from 'drizzle-orm';

export default async function TransactionsPage() {
  const session = await getSession();

  let userTxs: Transaction[] = [];
  if (session?.address) {
    userTxs = await db.select()
      .from(transactions)
      .where(eq(transactions.from, session.address))
      .orderBy(desc(transactions.blockNumber));
  }

  return (
    <>
      {session ? (
        <TransactionsClientPage userTransactions={userTxs} />
      ) : (
        <>
          <h1>Transactions</h1>
          <p>You are not signed in</p>
        </>
      )}
    </>
  );
}
