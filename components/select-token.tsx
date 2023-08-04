import { useErc20Tokens } from '@/hooks/token-hooks';
import { Autocomplete, Box, Stack, TextField, Typography } from '@mui/material';

type SelectTokenProps = {
  inputLabel: string;
};

const SelectToken = ({ inputLabel }: SelectTokenProps) => {
  const tokens = useErc20Tokens();

  return (
    <>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={tokens}
        getOptionLabel={(option) => option.name}
        sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={inputLabel}
          />
        )}
        renderOption={(props, option) => (
          <Box
            component="li"
            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
            {...props}
          >
            <Stack
              direction="column"
              spacing={0}
              alignItems="flex-start"
            >
              <Typography variant="body1">
                {option.symbol} {option.name !== option.symbol ? `(${option.name})` : ''}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                {option.address.slice(0, 6)}...{option.address.slice(-4)}
              </Typography>
            </Stack>
          </Box>
        )}
      />
    </>
  );
};

export default SelectToken;
