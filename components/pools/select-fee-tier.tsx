import { FeeTier, Token } from '@/types/common';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { config } from '../config';

type SelectFeeTierProps = {
  tokenA: Token | null;
  tokenB: Token | null;
  feeTier: FeeTier;
  setFeeTier: (feeTier: FeeTier) => void;
};

const SelectFeeTier = ({ tokenA, tokenB, feeTier, setFeeTier }: SelectFeeTierProps) => {
  const isMdAndUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const disabled = tokenA === null || tokenB === null; console.log('fee disabled', disabled);
  return (
    <>
      {isMdAndUp ? (
        <FormControl
          disabled={disabled}
        >
          <FormLabel sx={{ mb: 2 }}>Fee Tier</FormLabel>
          <Stack
            direction="row"
            spacing={2}
          >
            {config.feeTiers.map((ftier, index) => {
              let radioLabel = isMdAndUp ? `${ftier.label}` : `${ftier.label} (${ftier.tip})`;
              return (
                <Paper
                  key={ftier.id}
                  variant="outlined"
                  sx={{ px: 3, pt: 1, pb: 2 }}
                >
                  <Stack direction="column">
                    <FormControlLabel
                      key={index}
                      value={ftier.value}
                      checked={ftier.value === feeTier.value}
                      onClick={() => {
                        if (disabled) return;
                        setFeeTier(ftier)
                      }}
                      control={<Radio disabled={disabled} />}
                      label={radioLabel}
                    />
                    {isMdAndUp && (
                      <Typography
                        variant="caption"
                        color="GrayText"
                      >
                        {ftier.tip}
                      </Typography>
                    )}
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        </FormControl>
      ) : (
        <FormControl fullWidth>
          <InputLabel>Fee Tier</InputLabel>
          <Select
            fullWidth
            label="Fee Tier"
            value={feeTier.value}
            onChange={(e) => {
              const feeTierValue = Number(e.target.value);
              const feeTier = config.feeTiers.find((feeTier) => feeTier.value === feeTierValue);
              if (!feeTier) return;
              setFeeTier(feeTier);
            }}
          >
            {config.feeTiers.map((feeTier, index) => {
              return (
                <MenuItem
                  key={index}
                  value={feeTier.value}
                >
                  {feeTier.label} ({feeTier.tip})
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      )}
    </>
  );
};

export default SelectFeeTier;
