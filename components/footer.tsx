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
      <Grid item xs={12} sx={{ display: 'inline-flex', mb: '40px' }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: '40px', margin: '0px auto' }}>
          {config.homeNavItems.map((item, index) => {
            return (
              <Link
                key={index}
                href={item.href}
              >
                <Typography sx={{ color: '#FFF' }}>
                  {item.label}
                </Typography>
              </Link>
            );
          })}
        </Box>
      </Grid>
    </Grid>
  )
}

export default Footer