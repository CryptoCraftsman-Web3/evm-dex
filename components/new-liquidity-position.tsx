import { useState } from 'react';
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
import { config } from './config';

const NewLiquidityPosition = () => {
  const [open, setOpen] = useState(false);
  const isMdAndUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleBackdropClose = (event: React.SyntheticEvent, reason: string) => {
    if (reason === 'backdropClick') return;
    handleClose();
  };

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
              <TextField
                label="Pair Token A"
                variant="outlined"
                size="small"
              />

              <TextField
                label="Pair Token B"
                variant="outlined"
                size="small"
              />
            </Stack>

            <FormControl>
              <FormLabel>Fee Tier</FormLabel>
              <RadioGroup
                defaultValue={config.feeAmounts[0].value}
                row={isMdAndUp}
                sx={{ gap: { xs: 0, md: 4 } }}
              >
                {config.feeAmounts.map((feeAmount, index) => {
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
