'use server';

import { sealData, unsealData } from 'iron-session';
import { cookies } from 'next/headers';
import { verifyMessage } from 'viem';
import { syncTokenTransfers, updatePendingTransactions } from './actions/transactions';
import { getNFTs } from './nfts';
import { revalidatePath } from 'next/cache';

type Session = {
  address: string;
};

export async function signInWithSignature(chainId: number, address: `0x${string}`, signature: `0x${string}`) {
  const valid = await verifyMessage({
    address,
    message: `I am signing into Serpent Swap with my wallet address: ${address}`,
    signature,
  });

  if (!valid) throw new Error('Invalid signature');

  await saveSession(address);
  updatePendingTransactions(address).then(() => {
    syncTokenTransfers(chainId, address);
  });

  await revalidatePath('/app', 'layout');
  await revalidatePath('/app', 'page');
}

export async function getSession() {
  const isSignedIn = cookies().has('serpent-swap-auth');

  if (!isSignedIn) return null;
  const sessionCookie = cookies().get('serpent-swap-auth');

  if (!sessionCookie) return null;

  const session = (await unsealData(sessionCookie.value, {
    password: process.env.IRON_SESSION_PWD,
    ttl: 60 * 60 * 24 * 365, // 365 days
  })) as Session;

  if (!session) return null;
  if (!session.address) return null;
  return session;
}

export async function signOut() {
  cookies().delete('serpent-swap-auth');
  await revalidatePath('/app', 'layout');
  await revalidatePath('/app', 'page');
}

async function saveSession(address: `0x${string}`) {
  const sessionCookie = await sealData(
    { address },
    {
      password: process.env.IRON_SESSION_PWD,
      ttl: 60 * 60 * 24 * 30, // 30 days
    }
  );

  cookies().set('serpent-swap-auth', sessionCookie, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
  });

  getNFTs(address);
}
