'use client';

import { getSession, signInWithSignature, signOut } from '@/lib/auth';
import { xrplDevnet } from '@/lib/xrpl-chains';
import { useEffect, useState } from 'react';
import { useAccount, useNetwork, useSignMessage } from 'wagmi';

export default function ConnectKitAuth() {
  // wallet sign in hooks
  const { isConnected, isDisconnected, address } = useAccount();
  const { signMessageAsync: signMessage } = useSignMessage();
  const [signature, setSignature] = useState<`0x${string}` | null>(null);
  const { chain } = useNetwork();

  const chainId = chain?.id || xrplDevnet.id;

  useEffect(() => {
    if (isDisconnected && !address) {
      signOut();
    }
  }, [isDisconnected, address]);

  useEffect(() => {
    if (isConnected && address) {
      getSession().then((session) => {
        if (session?.address) return;
        signMessage({
          message: `I am signing into Serpent Swap with my wallet address: ${address}`,
        }).then((signResult) => {
          setSignature(signResult);
        });
      });
    }
  }, [isConnected, address]);

  useEffect(() => {
    if (!address) return;
    if (!signature) return;

    signInWithSignature(chainId, address, signature);
  }, [signature, address]);

  return <></>;
}
