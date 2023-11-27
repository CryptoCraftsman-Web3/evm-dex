'use client';

import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { config } from './config';

const AppHeader = () => {
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
          px: '3.75rem',
          height: '5rem',
          maxWidth: '90%',
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
          <Link href={'/pools'}>
            <Button variant='contained' color='primary' size='small'>Launch App</Button>
          </Link>
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
          <Link href={'/pools'}>
            <Button variant='contained' color='primary' size='small'>Launch App</Button>
          </Link>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AppHeader;
