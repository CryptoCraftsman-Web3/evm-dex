'use client';

import NewLiquidityPosition from '@/components/pools/new-liquidity-position';
import PoolsList from '@/components/pools/pools-list';
import { useSwapProtocolAddresses } from '@/hooks/swap-protocol-hooks';
import { nonfungiblePositionManagerABI } from '@/types/wagmi/uniswap-v3-periphery';
import { Button, Paper, Stack, Typography, Grid, Box } from '@mui/material';
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
      <Box sx={{ height: { xs: '60px', md: '120px' } }} />
      <Grid
        container
        justifyContent={'center'}
      >
        <Grid item xs={12} md={8}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            marginBottom={'20px'}
          >
            <Typography variant="title">
              <b>Pools</b>
            </Typography>

            <NewLiquidityPosition refetchPoolsCount={refetchPoolsCount} />
          </Stack>

          {poolsCount && poolsCount > 0n ? (
            <PoolsList
              poolsCount={poolsCount || 0n}
              isGettingPoolsCount={isGettingPoolsCount}
              refetchPoolsCount={refetchPoolsCount}
            />
          ) : (
            <Paper
              sx={{
                width: '100%',
              }}
            >
              <Stack
                width={'100%'}
                direction="column"
                spacing='40px'
                justifyContent="center"
                alignItems="center"
                sx={{
                  py: '80px'
                }}
              >
                <Stack
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  spacing="20px"
                >
                  <IoFileTrayStackedOutline size={96} />

                  <Typography variant="body1" marginBottom='40px' >Your active liquidity positions will appear here.</Typography>
                </Stack>

                {!isConnected && (
                  <Button
                    variant="widget"
                    sx={{
                      width: '500px',
                    }}
                    onClick={() => setConnectWalletOpen(true)}
                  >
                    Connect Wallet
                  </Button>
                )}
              </Stack>
            </Paper>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default PoolsClientPage;
