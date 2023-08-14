import { useErc20Tokens } from '@/hooks/token-hooks';
import { Token } from '@/types/common';
import { Autocomplete, Box, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { isAddress } from 'viem';
import { useToken } from 'wagmi';

type SelectTokenProps = {
  inputLabel: string;
  token: Token | null;
  setToken: (token: Token) => void;
};

const SelectToken = ({ inputLabel, token, setToken }: SelectTokenProps) => {
  const tokens = useErc20Tokens();

  const [inputValue, setInputValue] = useState<string>('');
  const {
    data: searchedToken,
    isError: searchTokenError,
    isFetching: searchTokenFetching,
  } = useToken({
    address: inputValue as `0x{string}`,
    enabled: isAddress(inputValue),
  });

  return (
    <>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={tokens}
        getOptionLabel={(option) => option.name}
        sx={{ width: { xs: 'auto', md: 300 } }}
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
        filterOptions={(options, state) => {
          const isEthAddress = isAddress(state.inputValue);
          if (isEthAddress) {
            if (searchedToken && !searchTokenError && !searchTokenFetching) {
              return [
                {
                  name: searchedToken?.name ?? 'Unnamed Token',
                  symbol: searchedToken?.symbol ?? '',
                  address: searchedToken?.address ?? '',
                  decimals: searchedToken?.decimals ?? 18,
                },
              ];
            }
            return [];
          } else {
            return options.filter((option) => {
              return (
                option.name.toLowerCase().includes(state.inputValue.toLowerCase()) ||
                option.symbol.toLowerCase().includes(state.inputValue.toLowerCase()) ||
                option.address.toLowerCase().includes(state.inputValue.toLowerCase())
              );
            });
          }
        }}
        value={token}
        onChange={(event: any, value: Token | null) => {
          if (value) setToken(value);
        }}
        onInputChange={(event, value) => {
          setInputValue(value);
        }}
      />
    </>
  );
};

export default SelectToken;
