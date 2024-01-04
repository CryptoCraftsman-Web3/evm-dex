import { Fade, Modal, Paper, Box, IconButton, Stack, Typography, Divider, Grid, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { colors } from '@/theme/default-colors';
import Tag from '@/components/tag';
import { useAccount, useNetwork } from 'wagmi';
import { useSwapProtocolAddresses } from '@/hooks/swap-protocol-hooks';
import { useLiquidityPosition } from '@/hooks/pools';
import { useEthersProvider } from '@/lib/ethers';
import { BigNumber, ethers } from 'ethers';
import { nonfungiblePositionManagerABI } from '@/types/wagmi/uniswap-v3-periphery';
import { formatUnits } from 'viem';
import { IoLink } from 'react-icons/io5';
import ClaimTokens from './claim-tokens';
import AddLiquidity from './add-liquidity';
import RemoveLiquidity from './remove-liquidity';

type TokenIdModalProps = {
  tokenId: bigint;
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
};

const TokenIdModal = ({ isModalOpen, setIsModalOpen, tokenId }: TokenIdModalProps) => {
  const [switchToken, setSwitchToken] = React.useState(0);

  const { chain } = useNetwork();
  const { address } = useAccount();
  const { nfPositionManager } = useSwapProtocolAddresses();

  const {
    position,
    gettingPosition,
    refetchPosition,
    pool,
    slot0,
    tokenAName,
    tokenBName,
    tokenASymbol,
    tokenBSymbol,
    tokenADecimals,
    tokenBDecimals,
    gettingToken0Symbol,
    gettingToken1Symbol,
    gettingToken0Decimals,
    gettingToken1Decimals,
    gettingToken0Name,
    gettingToken1Name,
    gettingPool,
    gettingSlot0,
    sqrtPriceX96,
    currentTick,
    price,
    minPrice,
    maxPrice,
    sqrtRatioA,
    sqrtRatioB,
    sqrtPrice,
    amountAInWei,
    amountBInWei,
    amountAFormatted,
    amountBFormatted,
  } = useLiquidityPosition(tokenId);

  // we need to use ethers.js to get the amount of uncollected fees
  // this is because wagmi/viem does not have callstatic support
  const provider = useEthersProvider();
  const nfPositionManagerContract = new ethers.Contract(
    nfPositionManager,
    nonfungiblePositionManagerABI,
    provider || ethers.getDefaultProvider()
  );

  const [tokenAUnclaimedFees, setTokenAUnclaimedFees] = useState<number>(0);
  const [tokenBUnclaimedFees, setTokenBUnclaimedFees] = useState<number>(0);
  const [gettingUnclaimedFees, setGettingUnclaimedFees] = useState<boolean>(false);

  const getUnclaimedTokens = () => {
    setGettingUnclaimedFees(true);
    nfPositionManagerContract.callStatic
      .collect({
        tokenId,
        recipient: address,
        amount0Max: BigNumber.from(2).pow(128).sub(1),
        amount1Max: BigNumber.from(2).pow(128).sub(1),
      })
      .then((result: { amount0: BigNumber; amount1: BigNumber }) => {
        setTokenAUnclaimedFees(Number(formatUnits(result.amount0.toBigInt(), tokenADecimals || 18)));
        setTokenBUnclaimedFees(Number(formatUnits(result.amount1.toBigInt(), tokenBDecimals || 18)));
      })
      .finally(() => setGettingUnclaimedFees(false));
  };

  useEffect(() => {
    getUnclaimedTokens();
  }, [tokenId]);

  const tokenAUnclaimedFeesFormatted = tokenAUnclaimedFees.toLocaleString(undefined, {
    minimumFractionDigits: 8,
    maximumFractionDigits: 8,
  });

  const tokenBUnclaimedFeesFormatted = tokenBUnclaimedFees.toLocaleString(undefined, {
    minimumFractionDigits: 8,
    maximumFractionDigits: 8,
  });

  const isLoading =
    gettingPosition ||
    gettingToken0Symbol ||
    gettingToken0Decimals ||
    gettingToken0Name ||
    gettingToken1Symbol ||
    gettingToken1Decimals ||
    gettingToken1Name ||
    gettingPool ||
    gettingSlot0 ||
    gettingUnclaimedFees;

  return (
    <Modal
      open={isModalOpen}
      onClose={() => {
        setIsModalOpen(false)
      }}
      closeAfterTransition
      keepMounted
    >
      <Fade in={isModalOpen}>
        <Paper
          sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '650px',
            maxWidth: '100%',
            maxHeight: '85%',
          }}
        >
          <IconButton
            sx={{
              position: 'absolute',
              top: '16px',
              right: '16px',
            }}
            onClick={() => setIsModalOpen(false)}
          >
            <img
              src={'/icons/close.svg'}
              alt="close icon"
            />
          </IconButton>

          <Stack
            direction="row"
            gap="14px"
          >
            <Typography variant="subtitle3">USDX - WXRP</Typography>
            <Tag color="darkGreen">Active</Tag>
          </Stack>
          <Divider sx={{ width: '100%' }} />
          <Stack
            direction="column"
            gap="36px"
            sx={{
              width: '100%',
            }}
          >
            <Grid
              container
              spacing="20px"
            >
              <Grid
                item
                xs={6}
              >
                <Typography variant="body1">Liquidity</Typography>
                <Typography variant="subtitle2"></Typography>
              </Grid>
              <Grid
                item
                xs={6}
              >
                <Typography variant="body1">Unclaimed fees</Typography>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="subtitle2"></Typography>
                  {tokenASymbol && tokenBSymbol && (
                    <ClaimTokens
                      tokenASymbol={tokenASymbol}
                      tokenBSymbol={tokenBSymbol}
                      tokenAUnclaimedAmount={tokenAUnclaimedFees}
                      tokenBUnclaimedAmount={tokenBUnclaimedFees}
                      positionTokenId={tokenId}
                      getUnclaimedTokens={getUnclaimedTokens}
                    />
                  )}
                </Stack>
              </Grid>
              <Grid
                item
                xs={6}
              >
                <Box
                  sx={{
                    p: '20px',
                    borderRadius: '12px',
                    backgroundColor: colors.tertiaryBG,
                    width: '100%',
                  }}
                >
                  <Stack gap="16px">
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                    >
                      <a
                        href={`${chain?.blockExplorers?.default.url}/address/${position.token0}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Typography
                          variant="body16Medium"
                          color="white"
                        >
                          {tokenASymbol} <IoLink />
                        </Typography>
                      </a>

                      <Typography
                        variant="body16Medium"
                        color="white"
                      >
                        {amountAFormatted}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                    >
                      <a
                        href={`${chain?.blockExplorers?.default.url}/address/${position.token1}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Typography
                          variant="body16Medium"
                          color="white"
                        >
                          {tokenBSymbol} <IoLink />
                        </Typography>
                      </a>
                      <Typography
                        variant="body16Medium"
                        color="white"
                      >
                        {amountBFormatted}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Grid>
              <Grid
                item
                xs={6}
              >
                <Box
                  sx={{
                    p: '20px',
                    borderRadius: '12px',
                    backgroundColor: colors.tertiaryBG,
                    width: '100%',
                  }}
                >
                  <Stack gap="16px">
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                    >
                      <a
                        href={`${chain?.blockExplorers?.default.url}/address/${position.token0}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Typography
                          variant="body16Medium"
                          color="white"
                        >
                          {tokenASymbol} <IoLink />
                        </Typography>
                      </a>
                      <Typography
                        variant="body16Medium"
                        color="white"
                      >
                        {tokenAUnclaimedFeesFormatted}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                    >
                      <a
                        href={`${chain?.blockExplorers?.default.url}/address/${position.token1}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Typography
                          variant="body16Medium"
                          color="white"
                        >
                          {tokenBSymbol} <IoLink />
                        </Typography>
                      </a>
                      <Typography
                        variant="body16Medium"
                        color="white"
                      >
                        {tokenBUnclaimedFeesFormatted}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
            <Stack
              direction="row"
              justifyContent="space-between"
            >
              <Typography
                variant="body1"
                color="white"
              >
                Price range
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  padding: '2px',
                  alignItems: 'flex-start',
                  borderRadius: '8px',
                  backgroundColor: colors.tertiaryBG,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    padding: '4px 12px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '6px',
                    gap: '10px',
                    backgroundColor: !switchToken ? colors.cta : colors.tertiaryBG,
                    color: !switchToken ? 'white' : colors.textGrey,
                    cursor: 'pointer',
                  }}
                  // onClick={() => setSwitchToken(0)}
                >
                  {tokenASymbol}
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    padding: '4px 12px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '6px',
                    gap: '10px',
                    backgroundColor: switchToken ? colors.cta : colors.tertiaryBG,
                    color: switchToken ? 'white' : colors.textGrey,
                    cursor: 'pointer',
                  }}
                  // onClick={() => setSwitchToken(1)}
                >
                  {tokenBSymbol}
                </Box>
              </Box>
            </Stack>
            <Grid
              container
              spacing="20px"
            >
              <Grid
                item
                xs={6}
              >
                <Box
                  sx={{
                    p: '20px',
                    borderRadius: '12px',
                    backgroundColor: colors.tertiaryBG,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="footnote">Low price</Typography>
                  <Typography variant="numbers">
                    {minPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 8,
                      maximumFractionDigits: 8,
                    })}
                  </Typography>
                  <Typography variant="footnote">
                    {tokenBSymbol} per {tokenASymbol}
                  </Typography>
                </Box>
              </Grid>
              <Grid
                item
                xs={6}
              >
                <Box
                  sx={{
                    p: '20px',
                    borderRadius: '12px',
                    backgroundColor: colors.tertiaryBG,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="footnote">High price</Typography>
                  <Typography variant="numbers">
                    {maxPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 8,
                      maximumFractionDigits: 8,
                    })}
                  </Typography>
                  <Typography variant="footnote">
                    {tokenBSymbol} per {tokenASymbol}
                  </Typography>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
              >
                <Box
                  sx={{
                    p: '20px',
                    borderRadius: '12px',
                    backgroundColor: colors.tertiaryBG,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="footnote">Current price</Typography>
                  <Typography variant="numbers">
                    {price.toLocaleString(undefined, {
                      minimumFractionDigits: 8,
                      maximumFractionDigits: 8,
                    })}
                  </Typography>
                  <Typography variant="footnote">
                    {tokenBSymbol} per {tokenASymbol}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={3}
            >
              <AddLiquidity
                positionTokenId={tokenId}
                tokenAAddress={position.token0}
                tokenBAddress={position.token1}
                tokenASymbol={tokenASymbol || ''}
                tokenBSymbol={tokenBSymbol || ''}
                tokenADecimals={tokenADecimals || 18}
                tokenBDecimals={tokenBDecimals || 18}
                amountAInWei={amountAInWei}
                amountBInWei={amountBInWei}
                fee={position.fee}
                minPrice={minPrice}
                maxPrice={maxPrice}
                currentPrice={price}
                refetchPosition={refetchPosition}
              />

              <RemoveLiquidity
                positionTokenId={tokenId}
                positionLiquidity={position.liquidity}
                tokenASymbol={tokenASymbol || ''}
                tokenBSymbol={tokenBSymbol || ''}
                tokenADecimals={tokenADecimals || 18}
                tokenBDecimals={tokenBDecimals || 18}
                tokenALiquidity={amountAInWei}
                tokenBLiquidity={amountBInWei}
                refetchPosition={refetchPosition}
                getUnclaimedTokens={getUnclaimedTokens}
              />
            </Stack>
          </Stack>
        </Paper>
      </Fade>
    </Modal>
  );
};

export default TokenIdModal;
