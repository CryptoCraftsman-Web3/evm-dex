import React from 'react'
import { Box, Typography } from '@mui/material'
import { colors } from '@/theme/default-colors'

type TagProps = {
  color: string;
  children: React.ReactNode;
}

const Tag = ({ color, children }: TagProps) => {
  const colorOption = () => {
    if (color === 'green') return '#293607'
  }
  return (
    <Box
      sx={{
        px: '10px',
        pt: '4px',
        pb: '6px',
        borderRadius: '60px',
        backgroundColor: colorOption(),
      }}
    >
      <Typography variant='footnote' color={colors.lightGreen}>
        {children}
      </Typography>
    </Box>
  )
}

export default Tag