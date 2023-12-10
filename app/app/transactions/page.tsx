import { getSession } from '@/lib/auth';
import TransactionsClientPage from './client-page';
import { Transaction, transactions } from '@/lib/db-schemas/transaction';
import { db } from '@/lib/database';
import { desc, eq } from 'drizzle-orm';
import NotSignedIn from '@/components/common/not-signed-in';

export default async function TransactionsPage() {
  const session = await getSession();
  if (!session) return <NotSignedIn />;

  let userTxs: Transaction[] = [];
  if (session?.address) {
    userTxs = await db
      .select()
      .from(transactions)
      .where(eq(transactions.from, session.address))
      .orderBy(desc(transactions.blockNumber));
  }

  return <TransactionsClientPage userTransactions={userTxs} />;
}
