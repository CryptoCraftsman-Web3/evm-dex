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
          <FormLabel>Fee Tier</FormLabel>
          <RadioGroup
            defaultValue={config.feeTiers[0].value}
            value={feeTier.value}
            row
            onChange={(e) => {
              const feeTierValue = Number(e.target.value);
              const feeTier = config.feeTiers.find((feeTier) => feeTier.value === feeTierValue);
              if (!feeTier) return;
              setFeeTier(feeTier);
            }}
            sx={{ gap: { xs: 1, md: 2 }, width: '100%', justifyContent: 'space-between', pt: 1 }}
          >
            {config.feeTiers.map((feeTier, index) => {
              let radioLabel = isMdAndUp ? `${feeTier.label}` : `${feeTier.label} (${feeTier.tip})`;
              return (
                <Paper
                  variant="outlined"
                  sx={{ px: 3, pt: 1, pb: 2 }}
                >
                  <Stack
                    direction="column"
                    key={feeTier.id}
                  >
                    <FormControlLabel
                      key={index}
                      value={feeTier.value}
                      control={<Radio />}
                      label={radioLabel}
                    />
                    {isMdAndUp && <Typography variant="body2">{feeTier.tip}</Typography>}
                  </Stack>
                </Paper>
              );
            })}
          </RadioGroup>
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
