'use client';

import { getSession, signInWithSignature } from '@/lib/auth';
import { xrplDevnet } from '@/lib/xrpl-chains';
import { LoadingButton } from '@mui/lab';
import { Box, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAccount, useNetwork, useSignMessage } from 'wagmi';

export default function NotSignedIn() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync: signMessage } = useSignMessage();
  const [signature, setSignature] = useState<`0x${string}` | null>(null);
  const { chain } = useNetwork();
  const chainId = chain?.id || xrplDevnet.id;

  const signIn = () => {
    getSession().then((session) => {
      if (session?.address) return;
      signMessage({
        message: `I am signing into Serpent Swap with my wallet address: ${address}`,
      }).then((signResult) => {
        setSignature(signResult);
      });
    });
  };

  useEffect(() => {
    if (!address) return;
    if (!signature) return;

    signInWithSignature(chainId, address, signature);
  }, [signature, address]);

  return (
    <Stack
      spacing={2}
      justifyContent="center"
      alignItems="center"
      textAlign="center"
    >
      <Typography variant="h4">
        <b>Not Signed In</b>
      </Typography>

      <Box
        component="img"
        src="/illustrations/not-signed-in.png"
        sx={{
          width: '100%',
          maxWidth: 500,
          height: 'auto',
          objectFit: 'contain',
        }}
      />

      <Typography variant="h5">
        {isConnected
          ? 'Make sure you have signed the sign-in message with your connected wallet'
          : 'Please connect your wallet to continue'}
      </Typography>

      {isConnected && <LoadingButton variant="contained" onClick={signIn}>Sign In</LoadingButton>}
    </Stack>
  );
}
