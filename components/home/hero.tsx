import { Button, Grid, Typography } from '@mui/material'
import Link from 'next/link'

const Hero = () => {
  return (
    <Grid
      container
      spacing={2}
      sx={{
        minHeight: '90vh',
        background: 'url(/hero-illustration.svg) no-repeat bottom right',
      }}
    >
      <Grid item xs={12} md={12 / 2} mt={{ xs: '35px', md: '124px' }}>
        <Typography variant="h1">Serpent</Typography>
        <Typography variant="h1">Swap</Typography>
        <Typography variant='subtitle1' mb={'40px'} width={'525px'}>Swap, and earn rewards on the smartest decentralized platform.</Typography>
        <Link href='/about'>
          <Button variant='contained' size='large'>Learn More</Button>
        </Link>
      </Grid>
    </Grid>
  )
}

export default Hero