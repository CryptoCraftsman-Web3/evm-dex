'use client';

import { signInWithSignature, signOut } from '@/lib/auth';
import { getCookie } from 'cookies-next';
import { sign } from 'crypto';
import { useEffect } from 'react';
import { useAccount, useSignMessage } from 'wagmi';

export default function ConnectKitAuth() {
  // wallet sign in hooks
  const { isConnected, isDisconnected, address } = useAccount();
  const { signMessage, data: signature,  } = useSignMessage();

  useEffect(() => {
    if (isDisconnected && !address) {
      signOut();
    }
  }, [isDisconnected, address]);

  useEffect(() => {
    console.log(isConnected, address);
    if (isConnected && address) {
      const authCookie = getCookie('serpent-swap-auth');
      if (authCookie) return;

      signMessage({
        message: `I am signing into Serpent Swap with my wallet address: ${address}`,
      });
    }
  }, [isConnected, address]);

  useEffect(() => {
    if (!address) return;
    if (!signature) return;

    signInWithSignature(address, signature);
  }, [signature, address]);

  return <></>;
}
