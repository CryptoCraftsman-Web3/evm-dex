import { useState } from 'react'
import { Box, Button, Paper, Typography, useTheme } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'

type FaqBoxProps = {
  title: string
  content: string
}

const FaqBox = ({ title, content }: FaqBoxProps) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Paper
      sx={{
        p: '24px 32px',
        borderRadius: '20px',
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        gap: '0'
      }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          justifyContent: 'space-between',
          width: '100%',
          transition: 'all 0.3s ease-in-out',
          zIndex: 1,
          alignItems: 'center',
        }}
      >
        <Typography variant={matches ? 'subtitleMedium' : 'body18Medium'} color='#FFF'>{title}</Typography>
        <Button
          aria-label='Expand FAQ box'
          variant='contained'
          onClick={() => setIsOpen(!isOpen)}
          sx={{
            width: '40px',
            height: '40px',
            maxWidth: '40px',
            maxHeight: '40px',
            p: '10px',
            position: 'relative',
          }}
        >
          <span
            style={{
              width: '18px',
              height: '2px',
              borderRadius: '20px',
              backgroundColor: '#FFF',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
          <span
            style={{
              width: '18px',
              height: '2px',
              borderRadius: '20px',
              backgroundColor: '#FFF',
              transition: 'all 0.3s ease-in-out',
              transform: isOpen ? 'rotate(0deg) scale(0.7)' : 'rotate(90deg)',
            }}
          />
        </Button>
      </Box>
      <Box
        sx={{
          transition: 'all 0.2s ease',
          mt: isOpen ? '16px' : '0px',
          overflow: 'hidden',
          maxHeight: isOpen ? '1000px' : '0px',
          zIndex: 0,
        }}
      >
        <Typography
          sx={{
            transition: 'all 0.2s ease',
            transform: isOpen ? 'translateY(0)' : 'translateY(-100%)',
          }}
        >
          {content}
        </Typography>
      </Box>
    </Paper>
  )
}

export default FaqBox