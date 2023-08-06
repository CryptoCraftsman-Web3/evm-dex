import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  Theme,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { config } from '../config';
import SelectToken from './select-token';
import { FeeTier, Token } from '@/types/common';
import { useAccount } from 'wagmi';
import { toast } from 'react-toastify';
import SelectFeeTier from './select-fee-tier';

const NewLiquidityPosition = () => {
  const { isConnected } = useAccount();
  const [open, setOpen] = useState(false);
  const isMdAndUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

  useEffect(() => {
    if (!isConnected) setOpen(false);
  }, [isConnected]);

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

  const [tokenA, setTokenA] = useState<Token | null>(null);
  const [tokenB, setTokenB] = useState<Token | null>(null);
  const [feeTier, setFeeTier] = useState<FeeTier>(config.feeTiers[0]);

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleOpen}
      >
        Add Liquidity
      </Button>

      <Dialog
        open={open}
        onClose={handleBackdropClose}
        maxWidth={ isMdAndUp ? 'md' : 'xl' }
        fullWidth={!isMdAndUp}
        PaperProps={{
          variant: 'outlined',
        }}
      >
        <DialogContent>
          <Stack
            direction="column"
            spacing={2}
            px={{ xs: 0, md: 2 }}
            py={{ xs: 0, md: 1 }}
            justifyContent="stretch"
          >
            <Typography variant="h6">
              <b>Add Liquidity</b>
            </Typography>

            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              width="100%"
              justifyContent="stretch"
            >
              <SelectToken inputLabel="Pair Token A" token={tokenA} setToken={setTokenA} />

              <SelectToken inputLabel="Pair Token B" token={tokenB} setToken={setTokenB} />
            </Stack>

            <SelectFeeTier feeTier={feeTier} setFeeTier={setFeeTier} />

            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
            >
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleClose}>Add</Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewLiquidityPosition;
