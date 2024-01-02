import React from 'react'
import { Box, Typography } from '@mui/material'
import { colors } from '@/theme/default-colors'

type TagProps = {
  color: 'green' | 'red' | 'yellow' | 'blue' | 'purple' | 'orange' | 'darkGreen';
  children: React.ReactNode;
}

const Tag = ({ color, children }: TagProps) => {
  const colorOption = () => {
    if (color === 'green') return '#293607'
    if (color === 'red') return '#4C0000'
    if (color === 'yellow') return '#4C3F00'
    if (color === 'blue') return '#002B4C'
    if (color === 'purple') return '#2B0033'
    if (color === 'orange') return '#4C2B00'
    if (color === 'darkGreen') return '#075400'
  }
  return (
    <Box
      sx={{
        px: '16px',
        py: '4px',
        borderRadius: '60px',
        backgroundColor: colorOption(),
        maxHeight: '34px'
      }}
    >
      <Typography variant='body16Medium' color={color === 'green' ? colors.lightGreen : 'white'}>
        {children}
      </Typography>
    </Box>
  )
}

export default Tag