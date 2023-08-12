import { FeeTier } from '@/types/common';
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
  feeTier: FeeTier;
  setFeeTier: (feeTier: FeeTier) => void;
};

const SelectFeeTier = ({ feeTier, setFeeTier }: SelectFeeTierProps) => {
  const isMdAndUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  return (
    <>
      {isMdAndUp ? (
        <FormControl>
          <FormLabel sx={{ mb: 2 }}>Fee Tier</FormLabel>
          <Stack
            direction="row"
            spacing={2}
            // justifyContent="space-between"
          >
            {config.feeTiers.map((ftier, index) => {
              let radioLabel = isMdAndUp ? `${ftier.label}` : `${ftier.label} (${ftier.tip})`;
              return (
                <Paper
                  variant="outlined"
                  sx={{ px: 3, pt: 1, pb: 2 }}
                >
                  <Stack
                    direction="column"
                    key={ftier.id}
                  >
                    <FormControlLabel
                      key={index}
                      value={ftier.value}
                      checked={ftier.value === feeTier.value}
                      onClick={() => setFeeTier(ftier)}
                      control={<Radio />}
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
