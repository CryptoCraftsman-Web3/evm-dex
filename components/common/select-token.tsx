import { useErc20Tokens, useNativeToken } from '@/hooks/token-hooks';
import { Token } from '@/types/common';
import { Box, Typography, Modal, Paper, IconButton, Input, Divider } from '@mui/material';
import { colors } from '@/theme/default-colors';
import { useState } from 'react';
import { isAddress } from 'viem';
import { useAccount, useNetwork, useToken } from 'wagmi';

type SelectTokenProps = {
  tokenModalOpen: boolean;
  setTokenModalOpen: (open: boolean) => void;
  selectedToken: Token | null;
  setSelectedToken: (token: Token | null) => void;
};

const SelectToken = ({ tokenModalOpen, setTokenModalOpen, selectedToken, setSelectedToken }: SelectTokenProps) => {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const tokens = useErc20Tokens();
  const nativeToken = useNativeToken();
  const tokensWithNative = [nativeToken, ...tokens];

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
      <Modal
        open={tokenModalOpen}
        onClose={() => setTokenModalOpen(false)}
      >
        <Paper
          sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '650px',
            maxWidth: '100%',
            maxHeight: '85%'
          }}
        >
          <IconButton
            sx={{
              position: 'absolute',
              top: '16px',
              right: '16px',
            }}
            onClick={() => setTokenModalOpen(false)}
          >
            <img src={'/icons/close.svg'} alt="close icon" />
          </IconButton>
          <Typography variant='subtitle3'>Select token</Typography>
          <Input
            placeholder='search'
            startAdornment={<img src={'/icons/search.svg'} alt="search icon" />}
            fullWidth
            sx={{
              p: '12px 28px',
              backgroundColor: colors.tertiaryBG,
              borderRadius: '40px',
              gap: '20px'
            }}
          />
          <Box
            sx={{
              backgroundColor: colors.tertiaryBG,
              display: 'inline-flex',
              gap: '8px',
              alignItems: 'center',
              py: '4px',
              pl: '6px',
              pr: '12px',
              borderRadius: '60px'
            }}
          >
            <img
              style={{
                width: '24px',
                height: '24px',
              }}
              src={'/icons/unknown-token.svg'}
              alt="unknown token icon"
            />
            <Typography variant={'body16Medium'} sx={{ color: '#ffffff' }}>XRP</Typography>
          </Box>
          <Divider sx={{ width: '100%' }} />
          <Box
            sx={{
              height: '340px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              overflowY: 'scroll',
              pr: '24px'
            }}
          >
            {tokensWithNative.map((token, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'transparent',
                  borderRadius: 'none',
                  cursor: 'pointer',
                  height: '32px',
                  '&:hover': {
                    backgroundColor: colors.tertiaryBG,
                  }
                }}
                onClick={() => {
                  setTokenModalOpen(false);
                  setSelectedToken(token);
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <img
                    style={{
                      width: '32px',
                      height: '32px',
                    }}
                    src={'/icons/unknown-token.svg'}
                    alt="unknown token icon"
                  />
                  <Typography>{token.name} {token.symbol}</Typography>
                </Box>
                <Box
                  sx={{
                    //display a visual check mark if the token is selected so the user knows
                    display: selectedToken?.name === token.name ? 'flex' : 'none',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <img src={'/icons/done.svg'} alt='selected token
                   check mark' />
                </Box>
              </Box>
            )
            )}
          </Box>
        </Paper>
      </Modal>
    </>
  );
};

export default SelectToken;

{/*
  <>
      <Autocomplete
        disablePortal
        options={[nativeToken, ...tokens]}
        getOptionLabel={(option) => option.name}
        sx={{ width: { xs: 'auto', md: 300 } }}
        renderInput={(params) => (
          <>
            {isConnected ? (
              <TextField
                {...params}
                label={inputLabel}
              />
            ) : (
              <TextField
                size="small"
                value={'Connect Wallet'}
                disabled
              />
            )}
          </>
        )}
        renderOption={(props, option) => (
          <Box
            component="li"
            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
            {...props}
            key={option.address}
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
                variant="caption"
                color="text.secondary"
              >
                {option.isNative ? (
                  <>{`${chain?.name}'s Native Token`}</>
                ) : (
                  <>
                    {option.address.slice(0, 6)}...{option.address.slice(-4)}
                  </>
                )}
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
                  isNative: false,
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
*/}