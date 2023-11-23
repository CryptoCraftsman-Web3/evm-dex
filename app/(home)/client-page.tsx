'use client';

import { Typography, Button, Box, Grid, Stack } from '@mui/material';
import { ConnectKitButton } from 'connectkit';

const HomeClientPage = () => {
  return (
    <Box sx={{ maxWidth: '1320px', mx: 'auto' }}>
      <Grid container spacing={2}>
        <Grid item md={12 / 2} spacing={2} mt={'124px'}>
          <Typography variant="h1">Serpent</Typography>
          <Typography variant="h1">Swap</Typography>
          <Typography variant='body1' mb={'40px'}>Swap and earn rewards on the xrpl evm sidechain.</Typography>
          <Button variant='contained' size='large'>Learn More</Button>
        </Grid>

      </Grid>
      <Grid container spacing={2}>
        <Grid item md={1}></Grid>
        <Grid item md={10}>
          <Typography variant='h3'>
            <span style={{ color: '#519E4A' }}>Introducing Serpent swap</span> - your companion in navigating the XRPL EVM and it's technology. Manage your account, provide liquidity, swap your tokens and earn rewards.
          </Typography>
        </Grid>
        <Grid item md={1}></Grid>
      </Grid>
    </Box>
  );
};

export default HomeClientPage;
