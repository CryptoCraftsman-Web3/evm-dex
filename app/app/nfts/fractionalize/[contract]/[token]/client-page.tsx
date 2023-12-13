'use client';

import { useSwapProtocolAddresses } from '@/hooks/swap-protocol-hooks';
import { NFTCacheRecord } from '@/lib/db-schemas/nft-cache-record';
import { NFTContractCachedLog } from '@/lib/db-schemas/nft-contract-cached-log';
import { cacheERC721Token } from '@/lib/nfts';
import { NFTMetadata } from '@/types/common';
import { erc721ABI, serpentSwapNftABI, serpentSwapNftManagerABI } from '@/types/wagmi/serpent-swap';
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

type FractionalizeNFTClientPageProps = {
  nft: NFTCacheRecord;
  contract: NFTContractCachedLog;
};

export default function FractionalizeNFTClientPage({ nft, contract }: FractionalizeNFTClientPageProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [metadata, setMetadata] = useState<NFTMetadata>();
  const [imageUrl, setImageUrl] = useState<string>();

  useEffect(() => {
    // load nft from metadata
    const { tokenURI } = nft;
    if (!tokenURI) {
      setLoading(false);
      return;
    }

    let metadataUri = tokenURI;
    if (tokenURI.startsWith('ipfs://')) {
      metadataUri = tokenURI.replace('ipfs://', 'https://cloudflare-ipfs.com/ipfs/');
    }

    const fetchMetadata = async (uri: string) => {
      setLoading(true);
      try {
        const res = await fetch(uri);
        if (!res.ok) throw new Error('Failed to fetch metadata');

        const metadata = await res.json();
        setMetadata(metadata);

        // process image url
        let imageUrl = metadata.image;
        if (metadata.image.startsWith('ipfs://')) {
          imageUrl = metadata.image.replace('ipfs://', 'https://cloudflare-ipfs.com/ipfs/');
        }
        setImageUrl(imageUrl);
      } catch (err) {
        setImageUrl('/images/unknown-nft.webp');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata(metadataUri);
  }, []);

  const [name, setName] = useState<string>('');
  const [symbol, setSymbol] = useState<string>('');
  const [supply, setSupply] = useState<number>(100);

  const { serpentSwapNFTManager } = useSwapProtocolAddresses();
  const { address: userAddress } = useAccount();

  const { data: getApprovedData, refetch: checkApproval } = useContractRead({
    address: contract.nftContractAddress as `0x${string}`,
    abi: erc721ABI,
    functionName: 'getApproved',
    args: [BigInt(nft.tokenId)],
  });

  const isApproved = getApprovedData === serpentSwapNFTManager;

  const { config: approveConfig } = usePrepareContractWrite({
    address: contract.nftContractAddress as `0x${string}`,
    abi: erc721ABI,
    functionName: 'approve',
    args: [serpentSwapNFTManager, BigInt(nft.tokenId)],
  });

  const {
    data: approveData,
    writeAsync: approveNft,
    isLoading: isSubmittingApproval,
  } = useContractWrite(approveConfig);
  const {
    isLoading: isApproving,
    isSuccess: approvalSucceeded,
    isError: approvalFailed,
  } = useWaitForTransaction({
    hash: approveData?.hash,
  });

  useEffect(() => {
    if (approvalSucceeded) {
      toast.success(`Approved ${metadata?.name || 'Unknown NFT'} successfully`);
    }

    if (approvalFailed) {
      toast.error(`Failed to approve ${metadata?.name || 'Unknown NFT'}`);
    }

    checkApproval();
  }, [approvalSucceeded, approvalFailed]);

  const { config } = usePrepareContractWrite({
    address: serpentSwapNFTManager,
    abi: serpentSwapNftManagerABI,
    functionName: 'deployAndFractionalize',
    args: [
      name,
      symbol,
      parseUnits(supply.toString(), 18),
      userAddress || zeroAddress,
      contract.nftContractAddress as `0x${string}`,
      BigInt(nft.tokenId),
    ],
    enabled: isApproved && Boolean(name) && Boolean(symbol) && supply > 0,
  });

  const {
    data: fractionalizeData,
    isLoading: isSubmittingFractionalizeTx,
    writeAsync: fractionalize,
  } = useContractWrite(config);

  const {
    isLoading: isFractionalizing,
    isSuccess: fractionalizeSucceeded,
    isError: fractionalizeFailed,
  } = useWaitForTransaction({
    hash: fractionalizeData?.hash,
  });

  useEffect(() => {
    if (fractionalizeSucceeded) {
      toast.success(`Fractionalized ${metadata?.name || 'Unknown NFT'} successfully`);
      refetchSerpentSwapNFTContractAddress().then(() => {
        refetchFracTokenData();
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

  const { data: serpentSwapNFTContractAddress, refetch: refetchSerpentSwapNFTContractAddress } = useContractRead({
    address: serpentSwapNFTManager,
    abi: serpentSwapNftManagerABI,
    functionName: 'getUserSerpentSwapNFTContractForNFT',
    args: [contract.nftContractAddress as `0x${string}`, BigInt(nft.tokenId)],
  });

  const isFractionalized = Boolean(serpentSwapNFTContractAddress) && serpentSwapNFTContractAddress !== zeroAddress;

  const serpentSwapNFTContract = {
    address: serpentSwapNFTContractAddress,
    abi: serpentSwapNftABI,
  };

  const { data: fracTokenData, refetch: refetchFracTokenData } = useContractReads({
    contracts: [
      {
        ...serpentSwapNFTContract,
        functionName: 'totalSupply',
      },
      {
        ...serpentSwapNFTContract,
        functionName: 'balanceOf',
        args: [userAddress || zeroAddress],
      },
      {
        ...serpentSwapNFTContract,
        functionName: 'symbol',
      },
      {
        ...serpentSwapNFTContract,
        functionName: 'name',
      },
    ],
  });

  const fracTokenTotalSupply = (fracTokenData?.at(0)?.result as bigint) || BigInt(0);
  const fracTokenUserBalance = (fracTokenData?.at(1)?.result as bigint) || BigInt(0);
  const fracTokenSymbol = (fracTokenData?.at(2)?.result as string) || '';
  const fracTokenName = (fracTokenData?.at(3)?.result as string) || '';
  const isRedeemed = fracTokenTotalSupply === BigInt(0);

  const { chain } = useNetwork();

  return (
    <>
      {loading ? (
        <Stack
          direction="column"
          spacing={4}
        >
          <Stack
            direction="column"
            spacing={1}
          >
            <Skeleton
              variant="rounded"
              width="50%"
              height="48px"
            />
            <Skeleton
              variant="rounded"
              width="40%"
              height="18px"
            />
          </Stack>

          <Grid
            container
            spacing={6}
          >
            <Grid
              item
              xs={12}
              md={6}
            >
              <Skeleton
                variant="rounded"
                sx={{
                  width: '70%',
                  height: '100%',
                  aspectRatio: '1 / 1',
                }}
              />
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
            >
              <Stack
                direction="column"
                spacing={3}
              >
                <Skeleton
                  variant="rounded"
                  height="40px"
                  width="100%"
                />

                <Skeleton
                  variant="rounded"
                  height="40px"
                  width="100%"
                />

                <Skeleton
                  variant="rounded"
                  height="40px"
                  width="100%"
                />

                <Skeleton
                  variant="rounded"
                  height="40px"
                  width="100%"
                />
              </Stack>
            </Grid>
          </Grid>
        </Stack>
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

                        <Button
                          variant="contained"
                          size="large"
                          fullWidth
                        >
                          Add to Liquidity Pool
                        </Button>

                        {fracTokenUserBalance === fracTokenTotalSupply && (
                          <>
                            <Typography
                              variant="body1"
                              sx={{ textAlign: 'center' }}
                            >
                              You own 100% of the fractional token supply. You can redeem the original NFT.
                            </Typography>

                            <LoadingButton
                              variant="contained"
                              size="large"
                              fullWidth
                            >
                              Redeem NFT
                            </LoadingButton>
                          </>
                        )}
                      </>
                    )}
                  </>
                )}

                <Link
                  href="/app/nfts"
                  passHref
                >
                  <Typography
                    variant="body2"
                    sx={{ textAlign: 'center', width: '100%' }}
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
