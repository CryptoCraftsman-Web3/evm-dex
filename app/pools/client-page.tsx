'use client';

import { Alert, Box, Button, Card, Stack, Typography } from '@mui/material';
import { useAccount } from 'wagmi';
import { IoFileTrayStackedOutline } from 'react-icons/io5';
import { useModal } from 'connectkit';
import NewLiquidityPosition from '@/components/pools/new-liquidity-position';

const PoolsClientPage = () => {
  const { isConnected } = useAccount();
  const { setOpen: setConnectWalletOpen } = useModal();

  return (
    <Box
      px={{ xs: 2, md: 6 }}
      pt={{ xs: 4, md: 8 }}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        direction="column"
        spacing={4}
        width={{ xs: '100%', md: '600px' }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          width="100%"
        >
          <Typography variant="h4">
            <b>Pools</b>
          </Typography>

          <NewLiquidityPosition />
        </Stack>

        <Card
          variant="outlined"
          sx={{
            p: { xs: 2, md: 4 },
          }}
        >
          {isConnected ? (
            <></>
          ) : (
            <Stack
              direction="column"
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <IoFileTrayStackedOutline size={96} />

              <Typography variant="body1">Your liquidity positions will appear here</Typography>

              <Button
                variant="outlined"
                onClick={() => setConnectWalletOpen(true)}
              >
                Connect Wallet
              </Button>
            </Stack>
          )}
        </Card>
      </Stack>
    </Box>
  );
};

export default PoolsClientPage;
