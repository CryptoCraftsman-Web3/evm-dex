'use client';

import { signOut } from '@/lib/auth';
import { useEffect } from 'react';
import { useAccount, useSignMessage } from 'wagmi';

export default function ConnectKitAuth() {
  // wallet sign in hooks
  const { isConnected, isConnecting, isReconnecting, address } = useAccount();
  const { signMessage } = useSignMessage();

  useEffect(() => {
    if (isConnecting || isReconnecting) return;

    if (isConnected) {
      const signature = signMessage({
        message: `I am signing into Serpent Swap with my wallet address: ${address}`,
      });
      console.log('signature', signature);
    } else {
      console.log('signing out');
      signOut();
    }
  }, [isConnected, isConnecting, isReconnecting, address]);
  return <></>;
}
