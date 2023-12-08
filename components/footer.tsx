import { Grid, Typography, Box } from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import { config } from './config'


const Footer = () => {
  return (
    <Grid
      container
      spacing={2}
      pt={'70px'}
      sx={{
        alignItems: 'center',
        display: { xs: 'none', md: 'flex' },
        height: '80px',
        maxWidth: '1320px',
        mx: 'auto',
      }}
    >
      <Grid item xs={12} sx={{ mt: '100px', mb: '60px', display: 'inline-flex' }}>
        <Link href="/" style={{ margin: '0 auto' }}>
          <Image
            src="/serpent-swap-logo.svg"
            priority
            alt="Logo"
            width={70}
            height={70}
          />
        </Link>
      </Grid>
      <Grid item xs={12}>
        {/* 
          So many grid containers because I need to center a 4x grid col and then have a 2x grid col below it.
          without this setup the grid become inline instead of stacked.
        */}
        <Grid container spacing={0}>
          <Grid item xs={12} md={4} sx={{ display: 'inline-flex', mb: '40px', mx: 'auto' }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'space-evenly', width: '100%' }}>
              {config.homeNavItems.map((item, index) => {
                return (
                  <Link
                    key={index}
                    href={item.href}
                    style={{
                      width: '100%',
                      textAlign: 'center',
                    }}
                  >
                    <Typography sx={{ color: '#FFF', mx: 'auto' }}>
                      {item.label}
                    </Typography>
                  </Link>
                );
              })}
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ display: 'inline-flex', mb: '40px', mx: 'auto' }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'space-evenly', width: '100%' }}>

        </Box>
      </Grid>
    </Grid>
  )
}

export default Footer