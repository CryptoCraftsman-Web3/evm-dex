'use client';

import NewLiquidityPosition from '@/components/pools/new-liquidity-position';
import PoolsList from '@/components/pools/pools-list';
import { useSwapProtocolAddresses } from '@/hooks/swap-protocol-hooks';
import { nonfungiblePositionManagerABI } from '@/types/wagmi/uniswap-v3-periphery';
import { Button, Paper, Stack, Typography } from '@mui/material';
import { useModal } from 'connectkit';
import { IoFileTrayStackedOutline } from 'react-icons/io5';
import { useAccount, useContractRead } from 'wagmi';

const PoolsClientPage = () => {
  const { isConnected } = useAccount();
  const { setOpen: setConnectWalletOpen } = useModal();

  const { nfPositionManager } = useSwapProtocolAddresses();
  const { address } = useAccount();

  const {
    data: poolsCount,
    isLoading: isGettingPoolsCount,
    refetch: refetchPoolsCount,
  } = useContractRead({
    address: nfPositionManager,
    abi: nonfungiblePositionManagerABI,
    functionName: 'balanceOf',
    args: [address!],
    enabled: address !== undefined,
  });

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        width="100%"
      >
        <Typography variant="h4">
          <b>Pools</b>
        </Typography>

        <NewLiquidityPosition refetchPoolsCount={refetchPoolsCount} />
      </Stack>

      <Paper
        variant="outlined"
        sx={{
          p: { xs: 2, md: 4 },
          w: { xs: '100%', md: '600px', lg: '800px' },
        }}
      >
        {isConnected ? (
          <PoolsList
            poolsCount={poolsCount || 0n}
            isGettingPoolsCount={isGettingPoolsCount}
            refetchPoolsCount={refetchPoolsCount}
          />
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
              variant="contained"
              onClick={() => setConnectWalletOpen(true)}
            >
              Connect Wallet
            </Button>
          </Stack>
        )}
      </Paper>
    </>
  );
};

export default PoolsClientPage;
