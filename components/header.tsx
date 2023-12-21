'use client';

import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { config } from './config';
import ConnectButton from './connect-button';
import { useRouter } from 'next/router';

type HeaderProps = {
  location: 'home' | 'app';
}

const Header = ({ location }: HeaderProps) => {
  const navItems = location === 'home' ? config.homeNavItems : config.appNavItems;
  return (
    <Box
      sx={{
        // position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 10,
        backgroundColor: 'background.default',
      }}
    >
      <Grid
        container
        sx={{
          alignItems: 'center',
          display: { xs: 'none', md: 'flex' },
          height: '80px',
          maxWidth: '1320px',
          mx: 'auto',
        }}
      >
        <Grid
          item
          xs={1}
        >
          <Link href="/" style={{ marginRight: '85px' }}>
            <Image
              src="/serpent-swap-logo.svg"
              priority
              alt="Logo"
              width={48}
              height={48}
            />
          </Link>
        </Grid>
        <Grid
          item
          xs={7}
          sm={4}
          md={3}
          display={'flex'}
          alignItems={'flex-start'}
          gap={'40px'}
          p={'0rem'}
        >
          {navItems.map((item, index) => {
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
        </Grid>

        <Grid
          item
          xs={4}
        >
        </Grid>

        <Grid
          item
          xs={4}
          sx={{
            textAlign: 'right',
          }}
        >
          {location === 'home' ? <LaunchAppButton /> : <ConnectButton />}
        </Grid>
      </Grid>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        px={2}
        py={1}
        sx={{
          display: { xs: 'flex', md: 'none' },
        }}
      >
        <Stack
          direction="row"
          spacing={2}
        >
          <Link href="/">
            <Image
              src="/serpent-swap-logo.svg"
              alt="Logo"
              width={48}
              height={48}
            />
          </Link>
        </Stack>

        <Stack
          direction="row"
          spacing={2}
          justifyContent="flex-end"
        >
          {location === 'home' ? <LaunchAppButton /> : <ConnectButton />}
        </Stack>
      </Stack>
    </Box>
  );
};

const LaunchAppButton = () => {
  return (
    <Link href="/application/swap">
      <Button variant='contained' color='primary' size='small'>Launch App</Button>
    </Link>
  )
}

export default Header;
