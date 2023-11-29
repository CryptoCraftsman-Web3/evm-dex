import { useState } from 'react'
import { Box, Button, Paper, Typography } from '@mui/material'

const FaqBox = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Paper
      sx={{
        p: '24px 32px',
        borderRadius: '20px',
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          justifyContent: 'space-between',
          width: '100%',
          transition: 'all 0.3s ease-in-out',
          zIndex: 1,
        }}
      >
        <Typography variant='subtitle2'>How do I get started?</Typography>
        <Button
          variant='contained'
          onClick={() => setIsOpen(!isOpen)}
          sx={{
            width: '40px',
            height: '40px',
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
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. At ut quidem aliquid quod minima rerum facere? Dolorem voluptas tempore dolorum!
        </Typography>
      </Box>
    </Paper>
  )
}

export default FaqBox