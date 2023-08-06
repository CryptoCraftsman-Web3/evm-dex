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
import { Token } from '@/types/common';
import { useAccount } from 'wagmi';
import { toast } from 'react-toastify';

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

            <FormControl>
              <FormLabel>Fee Tier</FormLabel>
              <RadioGroup
                defaultValue={config.feeTiers[0].value}
                row={isMdAndUp}
                sx={{ gap: { xs: 0, md: 4 } }}
              >
                {config.feeTiers.map((feeAmount, index) => {
                  let radioLabel = isMdAndUp ? `${feeAmount.label}` : `${feeAmount.label} (${feeAmount.tip})`;
                  return (
                    <Stack direction="column">
                      <FormControlLabel
                        key={index}
                        value={feeAmount.value}
                        control={<Radio />}
                        label={radioLabel}
                      />
                      {isMdAndUp && <Typography variant="body2">{feeAmount.tip}</Typography>}
                    </Stack>
                  );
                })}
              </RadioGroup>
            </FormControl>

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
