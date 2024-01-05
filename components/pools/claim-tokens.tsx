import { useSwapProtocolAddresses } from '@/hooks/swap-protocol-hooks';
import { syncTransaction } from '@/lib/actions/transactions';
import { colors } from '@/theme/default-colors';
import { nonfungiblePositionManagerABI } from '@/types/wagmi/uniswap-v3-periphery';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Paper,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import { toast } from 'react-toastify';
import { zeroAddress } from 'viem';
import { useAccount, useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

type ClaimTokensProps = {
  tokenASymbol: string;
  tokenBSymbol: string;
  tokenAUnclaimedAmount: number;
  tokenBUnclaimedAmount: number;
  positionTokenId: bigint;
  getUnclaimedTokens: () => void;
};

const ClaimTokens = ({
  tokenASymbol,
  tokenBSymbol,
  tokenAUnclaimedAmount,
  tokenBUnclaimedAmount,
  positionTokenId,
  getUnclaimedTokens,
}: ClaimTokensProps) => {
  const { chain } = useNetwork();
  const { isConnected } = useAccount();
  const [open, setOpen] = useState(false);
  const isMdAndUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

  const { address } = useAccount();

  const handleOpen = () => {
    if (!isConnected) {
      toast('Please connect your wallet first', { type: 'error' });
      return;
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleBackdropClose = (event: React.SyntheticEvent, reason: string) => {
    if (reason === 'backdropClick') return;
    handleClose();
  };

  const { nfPositionManager } = useSwapProtocolAddresses();
  const { config: claimTokensTxConfig } = usePrepareContractWrite({
    address: nfPositionManager,
    abi: nonfungiblePositionManagerABI,
    functionName: 'collect',
    args: [
      {
        tokenId: positionTokenId,
        recipient: address || zeroAddress,
        amount0Max: 2n ** 128n - 1n,
        amount1Max: 2n ** 128n - 1n,
      },
    ],
    value: 0n,
    enabled: address !== undefined,
  });

  const {
    data: claimTokensTxData,
    write: claimTokens,
    isLoading: isClaimingTokens,
  } = useContractWrite(claimTokensTxConfig);

  useEffect(() => {
    if (claimTokensTxData?.hash && chain?.id) {
      syncTransaction(chain.id, claimTokensTxData.hash, 'collect');
    }
  }, [claimTokensTxData, chain]);

  const {
    isLoading: isClaimingTokensWaiting,
    isSuccess: isClaimingTokensSuccess,
    isError: isClaimingTokensError,
  } = useWaitForTransaction({
    hash: claimTokensTxData?.hash,
    enabled: claimTokensTxData?.hash !== undefined,
  });

  useEffect(() => {
    if (isClaimingTokensSuccess) {
      toast('Tokens claimed successfully', { type: 'success' });
      handleClose();
      getUnclaimedTokens();
    }

    if (isClaimingTokensError) {
      toast('Error claiming tokens', { type: 'error' });
    }
  }, [isClaimingTokensSuccess, isClaimingTokensError]);

  return (
    <>
      <Button
        variant="widget"
        onClick={handleOpen}
        size="small"
      >
        Collect
      </Button>

      <Dialog
        open={open}
        onClose={handleBackdropClose}
        maxWidth="lg"
        fullWidth={!isMdAndUp}
        PaperProps={{
          variant: 'outlined',
        }}
      >
        <DialogTitle>
          <b>Claim Tokens</b>
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <IoIosClose />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack
            direction="column"
            spacing={2}
            sx={{ width: { xs: '100%', md: 400 } }}
          >
            <Box
              sx={{
                p: '20px',
                borderRadius: '12px',
                backgroundColor: colors.tertiaryBG,
                width: '100%',
              }}
            >
              <Stack
                direction="column"
                spacing={2}
                p={2}
              >
                <Typography variant="body1">
                  {tokenASymbol}: {tokenAUnclaimedAmount}
                </Typography>

                <Typography variant="body1">
                  {tokenBSymbol}: {tokenBUnclaimedAmount}
                </Typography>
              </Stack>
            </Box>

            <Alert
              severity="info"
              color="info"
              variant="standard"
              sx={{
                borderRadius: '12px',
                backgroundColor: colors.tertiaryBG,
                width: '100%',
              }}
            >
              <Typography
                variant="body2"
                width="100%"
              >
                Claiming tokens will withdraw currently available tokens to your wallet
              </Typography>
            </Alert>

            <LoadingButton
              variant="widget"
              color="primary"
              size="large"
              fullWidth
              loading={isClaimingTokens || isClaimingTokensWaiting}
              onClick={claimTokens}
            >
              Claim Tokens
            </LoadingButton>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClaimTokens;
