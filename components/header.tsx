'use client';

import { Box, Button, IconButton, Stack, TextField, Grid, InputAdornment } from '@mui/material';
import { config } from './config';
import Link from 'next/link';
import { CiSearch } from 'react-icons/ci';
import Image from 'next/image';
import { Avatar, ConnectKitButton } from 'connectkit';

const Header = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 10,
        backgroundColor: 'background.default',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Grid
        container
        px={2}
        py={1}
        sx={{
          alignItems: 'center',
          display: { xs: 'none', md: 'flex' },
        }}
      >
        <Grid
          item
          xs={4}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
          >
            <Link href="/">
              <Image
                src="/logo.webp"
                alt="Logo"
                width={48}
                height={48}
              />
            </Link>
            {config.navItems.map((item, index) => {
              return (
                <Link
                  key={index}
                  href={item.href}
                >
                  <Button key={item.label}>{item.label}</Button>
                </Link>
              );
            })}
          </Stack>
        </Grid>

        <Grid
          item
          xs={4}
        >
          <TextField
            size="small"
            label="Search for tokens and NFTs"
            sx={{
              width: '100%',
            }}
          />
        </Grid>

        <Grid
          item
          xs={4}
          sx={{
            textAlign: 'right',
          }}
        >
          <ConnectKitButton.Custom>
            {({ isConnected, isConnecting, show, hide, address, ensName, chain }) => {
              const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null;
              return (
                <Button
                  variant="contained"
                  size="large"
                  onClick={show}
                  startIcon={
                    isConnected ?
                    <Avatar
                      size={18}
                      address={address}
                    /> : null
                  }
                  sx={{
                    textTransform: 'none',
                  }}
                >
                  {isConnected ? ensName || shortAddress : 'Connect Wallet'}
                </Button>
              );
            }}
          </ConnectKitButton.Custom>
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
              src="/logo.webp"
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
          <IconButton>
            <CiSearch />
          </IconButton>
          <Button variant="outlined">Connect</Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Header;
