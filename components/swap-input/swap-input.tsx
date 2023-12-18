'use client'

import { Box, Typography, Stack, Button, Input } from "@mui/material"
import { colors } from "@/theme/default-colors"
import { Token } from '@/types/common';

type SwapInputProps = {
  token: Token | null;
  onTokenChange: (token: Token | null) => void;
  onClick: () => void;
}

const SwapInput = ({ token, onTokenChange, onClick }: SwapInputProps) => {
  return (
    <Box
      sx={{
        p: '25px 20px',
        borderRadius: '12px',
        backgroundColor: colors.tertiaryBG,
        height: '100px',
        width: '100%',
        display: 'inline-flex',
        justifyContent: 'space-between',
      }}
    >
      <Stack gap={'2px'}>
        <Typography
          variant="footnote"
        >
          You pay
        </Typography>
        <Input
          type='number'
          placeholder={'0'}
          fullWidth
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            height: '100%',
            borderBottom: 'none'
          }}
        />
      </Stack>
      <Box
        sx={{
          alignSelf: 'center',
        }}
      >
        <Button
          variant="contained"
          size="small"
          onClick={onClick}
          endIcon={<img src={'/icons/keyboard_arrow_down.svg'} style={{ filter: 'invert(1)' }} alt="drop down icon" />}
        >
          {token ? token.symbol : 'Select token'}
        </Button>
      </Box>
    </Box>
  )
}

export default SwapInput