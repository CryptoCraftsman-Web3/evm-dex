'use client';

import { useDeployAndFractionalize, useFractionalContract, useNFTApproval, useNFTMetadataLoader } from '@/hooks/nfts';
import { useSwapProtocolAddresses } from '@/hooks/swap-protocol-hooks';
import { NFTCacheRecord } from '@/lib/db-schemas/nft-cache-record';
import { NFTContractCachedLog } from '@/lib/db-schemas/nft-contract-cached-log';
import { cacheERC721Token } from '@/lib/nfts';
import { serpentSwapNftABI, serpentSwapNftManagerABI } from '@/types/wagmi/serpent-swap';
import { LoadingButton } from '@mui/lab';
import { Button, Grid, Paper, Skeleton, Stack, TextField, Typography } from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { formatUnits, parseUnits, zeroAddress } from 'viem';
import {
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import SkeletonLoading from './skeleton-loading';
import saveErc20Token from '@/lib/actions/tokens';

type FractionalizeNFTClientPageProps = {
  nft: NFTCacheRecord;
  contract: NFTContractCachedLog;
};

export default function FractionalizeNFTClientPage({ nft, contract }: FractionalizeNFTClientPageProps) {
  const { loading, metadata, imageUrl, setImageUrl } = useNFTMetadataLoader(nft.tokenURI);

  const [name, setName] = useState<string>('');
  const [symbol, setSymbol] = useState<string>('');
  const [supply, setSupply] = useState<number>(100);

  const { serpentSwapNFTManager } = useSwapProtocolAddresses();
  const { address: userAddress } = useAccount();

  // NFT approval is required before fractionalization
  const {
    isApproved,
    isSubmittingApproval,
    approveNft,
    isApproving,
    approvalSucceeded,
    approvalFailed,
    checkApproval,
  } = useNFTApproval(nft.nftContractAddress as `0x${string}`, BigInt(nft.tokenId));

  useEffect(() => {
    if (approvalSucceeded) {
      toast.success(`Approved ${metadata?.name || 'Unknown NFT'} successfully`);
    }

    if (approvalFailed) {
      toast.error(`Failed to approve ${metadata?.name || 'Unknown NFT'}`);
    }

    checkApproval();
  }, [approvalSucceeded, approvalFailed]);

  // fractionalization
  const { isFractionalizing, isSubmittingFractionalizeTx, fractionalizeSucceeded, fractionalizeFailed, fractionalize } =
    useDeployAndFractionalize(
      name,
      symbol,
      supply,
      nft.nftContractAddress as `0x${string}`,
      BigInt(nft.tokenId),
      isApproved && Boolean(name) && Boolean(symbol) && supply > 0
    );

  useEffect(() => {
    if (fractionalizeSucceeded) {
      toast.success(`Fractionalized ${metadata?.name || 'Unknown NFT'} successfully`);
      refetchSerpentSwapNFTContractAddress().then(async () => {
        await refetchFracTokenData();
      });
      setTimeout(() => {
        // wait for 3 seconds before caching nft so that we can fetch updated NFT data
        cacheERC721Token(contract.nftContractAddress as `0x${string}`, nft.tokenId);
      }, 3000);
    }

    if (fractionalizeFailed) {
      toast.error(`Failed to fractionalize ${metadata?.name || 'Unknown NFT'}`);
    }
  }, [fractionalizeSucceeded, fractionalizeFailed]);

  // query fractional token contract by nft address and token id
  const {
    serpentSwapNFTContractAddress,
    refetchSerpentSwapNFTContractAddress,
    isFractionalized,
    fracTokenTotalSupply,
    fracTokenUserBalance,
    fracTokenSymbol,
    fracTokenName,
    fracTokenAllowance,
    refetchFracTokenData,
    isApprovedToRedeem,
    isRedeemed,
  } = useFractionalContract(nft.nftContractAddress as `0x${string}`, BigInt(nft.tokenId));

  const { chain } = useNetwork();

  const { config: approveFracAllowanceConfig } = usePrepareContractWrite({
    address: serpentSwapNFTContractAddress || zeroAddress,
    abi: serpentSwapNftABI,
    functionName: 'approve',
    args: [serpentSwapNFTManager, fracTokenTotalSupply],
    enabled: !isApprovedToRedeem && isFractionalized,
  });

  const {
    data: approveFracAllowanceData,
    writeAsync: approveFracAllowance,
    isLoading: isSubmittingApproveFracAllowanceTx,
  } = useContractWrite(approveFracAllowanceConfig);

  const {
    isLoading: isApprovingFracAllowance,
    isSuccess: approveFracAllowanceSucceeded,
    isError: approveFracAllowanceFailed,
  } = useWaitForTransaction({
    hash: approveFracAllowanceData?.hash,
  });

  useEffect(() => {
    if (approveFracAllowanceSucceeded) {
      toast.success(`Approved fractional token allowance successfully`);
      refetchFracTokenData();
      refetchSerpentSwapNFTContractAddress();
    }

    if (approveFracAllowanceFailed) {
      toast.error(`Failed to approve fractional token allowance`);
    }
    refetchFracTokenData();
  }, [approveFracAllowanceSucceeded, approveFracAllowanceFailed]);

  const { config: redeemConfig } = usePrepareContractWrite({
    address: serpentSwapNFTManager,
    abi: serpentSwapNftManagerABI,
    functionName: 'redeem',
    args: [serpentSwapNFTContractAddress || zeroAddress],
    enabled:
      fracTokenUserBalance === fracTokenTotalSupply &&
      Boolean(serpentSwapNFTContractAddress) &&
      serpentSwapNFTContractAddress !== zeroAddress,
  });

  const { data: redeemData, writeAsync: redeemNFT, isLoading: isSubmittingRedeemTx } = useContractWrite(redeemConfig);

  const {
    isLoading: isRedeeming,
    isSuccess: redeemSucceeded,
    isError: redeemFailed,
  } = useWaitForTransaction({
    hash: redeemData?.hash,
    enabled: Boolean(redeemData?.hash),
  });

  useEffect(() => {
    if (redeemSucceeded) {
      toast.success(`Redeemed ${metadata?.name || 'Unknown NFT'} successfully`);
      refetchFracTokenData();
      refetchSerpentSwapNFTContractAddress();
    }

    if (redeemFailed) {
      toast.error(`Failed to redeem ${metadata?.name || 'Unknown NFT'}`);
    }
  }, [redeemSucceeded, redeemFailed]);

  useEffect(() => {
    if (!serpentSwapNFTContractAddress) return;
    if (!fracTokenName) return;
    if (!fracTokenSymbol) return;

    saveErc20Token(serpentSwapNFTContractAddress, fracTokenName, fracTokenSymbol, 18);
  }, [serpentSwapNFTContractAddress, fracTokenName, fracTokenSymbol]);

  return (
    <>
      {loading ? (
        <SkeletonLoading />
      ) : (
        <Stack spacing={4}>
          <Stack
            direction="column"
            spacing={0}
          >
            <Typography variant="h4">
              <b>Fractionalize {metadata?.name}</b>
            </Typography>
            <Typography variant="body1">
              {contract.nftContractSymbol} #{nft.tokenId}
            </Typography>
            <Link
              href={`${chain?.blockExplorers?.default?.url}/token/${contract.nftContractAddress}`}
              target="_blank"
              passHref
            >
              <Typography variant="body2">
                {contract.nftContractName} {contract.nftContractAddress.substring(0, 6)}...
                {contract.nftContractAddress.substring(38, 42)}
              </Typography>
            </Link>
          </Stack>

          <Grid
            container
            alignItems="stretch"
            rowGap={6}
          >
            <Grid
              item
              xs={12}
              md={6}
              sx={{ height: '100%' }}
              alignItems="center"
              justifyContent="center"
              display="flex"
            >
              <Paper
                variant="outlined"
                component="img"
                src={imageUrl || '/images/unknown-nft.webp'}
                sx={{
                  width: '70%',
                  aspectRatio: '1 / 1',
                  borderRadius: '10px',
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  setImageUrl('/images/unknown-nft.webp');
                }}
              />
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
              sx={{ height: '100%' }}
              alignItems="center"
            >
              <Stack
                direction="column"
                spacing={{ xs: 1, md: 3 }}
                justifyContent="center"
                alignContent="center"
                sx={{ height: '100%' }}
              >
                {!isFractionalized && (
                  <>
                    {!isApproved && (
                      <>
                        <Typography
                          variant="h6"
                          sx={{ textAlign: 'center' }}
                        >
                          This NFT needs to be approved for fractionalization
                        </Typography>

                        <Typography
                          variant="body1"
                          sx={{ textAlign: 'center' }}
                        >
                          This will allow the SerpentSwap NFT Manager contract to transfer this NFT on your behalf and
                          mint fractional tokens for you.
                        </Typography>

                        <LoadingButton
                          variant="contained"
                          size="large"
                          fullWidth
                          onClick={() => {
                            if (approveNft) approveNft();
                          }}
                          loading={isSubmittingApproval || isApproving}
                        >
                          Approve NFT for Fractionalization
                        </LoadingButton>
                      </>
                    )}

                    {isApproved && (
                      <>
                        <TextField
                          label="Fractional Token Name"
                          variant="outlined"
                          fullWidth
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />

                        <TextField
                          label="Fractional Token Symbol"
                          variant="outlined"
                          fullWidth
                          value={symbol}
                          onChange={(e) => setSymbol(e.target.value)}
                        />

                        <TextField
                          label="Fractional Token Supply"
                          variant="outlined"
                          fullWidth
                          value={supply}
                          onChange={(e) => setSupply(parseInt(e.target.value))}
                        />
                        <LoadingButton
                          variant="contained"
                          size="large"
                          fullWidth
                          loading={isSubmittingFractionalizeTx || isFractionalizing}
                          onClick={() => {
                            if (!name) {
                              toast.error('Please enter a fractional token name');
                              return;
                            }

                            if (!symbol) {
                              toast.error('Please enter a fractional token symbol');
                              return;
                            }

                            if (supply <= 0) {
                              toast.error('Please enter a valid fractional token supply');
                              return;
                            }

                            if (fractionalize) fractionalize();
                          }}
                        >
                          Fractionalize
                        </LoadingButton>
                      </>
                    )}
                  </>
                )}

                {isFractionalized && (
                  <>
                    {!isRedeemed && (
                      <>
                        <Typography
                          variant="h6"
                          sx={{ textAlign: 'center' }}
                        >
                          {`This NFT has already been fractionalized as ${fracTokenName} and can be traded on liquidity pools`}
                        </Typography>
                        <Stack direction="column">
                          <Link
                            href={`${chain?.blockExplorers?.default?.url}/address/${serpentSwapNFTContractAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            passHref
                            style={{ textAlign: 'center' }}
                          >
                            <Typography
                              variant="body1"
                              sx={{ textAlign: 'center', width: '100%' }}
                            >
                              Fractional Token Contract Address: {serpentSwapNFTContractAddress?.substring(0, 6)}...
                              {serpentSwapNFTContractAddress?.substring(38, 42)}
                            </Typography>
                          </Link>

                          <Typography
                            variant="body1"
                            sx={{ textAlign: 'center' }}
                          >
                            Fractional Token Total Supply: {formatUnits(fracTokenTotalSupply, 18).toString()}{' '}
                            {fracTokenSymbol}
                          </Typography>

                          <Typography
                            variant="body1"
                            sx={{ textAlign: 'center' }}
                          >
                            Your Fractional Token Balance: {formatUnits(fracTokenUserBalance, 18).toString()}{' '}
                            {fracTokenSymbol}
                          </Typography>
                        </Stack>

                        <Button
                          variant="contained"
                          size="large"
                          fullWidth
                        >
                          Add to Liquidity Pool
                        </Button>

                        {fracTokenUserBalance === fracTokenTotalSupply && (
                          <Stack direction="column">
                            <Typography
                              variant="body1"
                              sx={{ textAlign: 'center', fontSize: '14px' }}
                            >
                              You own 100% of the fractional token supply. You can redeem the original NFT.
                            </Typography>
                            {!isApprovedToRedeem && (
                              <Typography
                                variant="body1"
                                sx={{ textAlign: 'center', fontSize: '14px' }}
                              >
                                You will need to first approve the fractional token contract to transfer your fractional
                                tokens on your behalf.
                              </Typography>
                            )}

                            {isApprovedToRedeem ? (
                              <LoadingButton
                                variant="contained"
                                size="large"
                                fullWidth
                                loading={isSubmittingRedeemTx || isRedeeming}
                                onClick={() => {
                                  if (redeemNFT) redeemNFT();
                                }}
                              >
                                Redeem NFT
                              </LoadingButton>
                            ) : (
                              <LoadingButton
                                variant="contained"
                                size="large"
                                fullWidth
                                loading={isSubmittingApproveFracAllowanceTx || isApprovingFracAllowance}
                                onClick={() => {
                                  if (approveFracAllowance) approveFracAllowance();
                                }}
                              >
                                Approve Fractional Token Allowance
                              </LoadingButton>
                            )}
                          </Stack>
                        )}
                      </>
                    )}
                  </>
                )}

                <Link
                  href="/application/nfts"
                  passHref
                >
                  <Typography
                    variant="body2"
                    sx={{ textAlign: 'center', width: '100%', fontSize: '14px' }}
                  >
                    Go Back To NFTs List
                  </Typography>
                </Link>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      )}
    </>
  );
}
