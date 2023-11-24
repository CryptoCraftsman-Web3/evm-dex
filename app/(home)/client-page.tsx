'use client';

import { Box, Button, Grid, Typography } from '@mui/material';
import Link from 'next/link';

const HomeClientPage = () => {
  return (
    <Box sx={{ width: '1320px', maxWidth: '100%', mx: 'auto', px: { xs: '2%' } }}>
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
          <Typography variant='body1' mb={'40px'}>Swap, and earn rewards on the smartest decentralized platform.</Typography>
          <Link href='/about'>
            <Button variant='contained' size='large'>Learn More</Button>
          </Link>
        </Grid>
      </Grid>
      <Grid container spacing={2} my={'70px'}>
        <Grid item md={1}></Grid>
        <Grid item md={10}>
          <Typography variant='h3'>
            <span style={{ color: '#519E4A' }}>Introducing Serpent swap</span> - your companion in navigating the XRPL EVM and it&apos;s technology. Manage your account, provide liquidity, swap your tokens and earn rewards.
          </Typography>
        </Grid>
        <Grid item md={1}></Grid>
      </Grid>
    </Box>
  );
};

export default HomeClientPage;
