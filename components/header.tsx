'use client';

import { Box, Button, IconButton, Stack, TextField, Grid, InputAdornment } from '@mui/material';
import { config } from './config';
import Link from 'next/link';
import { CiSearch } from 'react-icons/ci';
import Image from 'next/image';
import { Avatar, ConnectKitButton } from 'connectkit';
import ConnectButton from './connect-button';

const Header = () => {
  return (
    <Box
      sx={{
        // position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 10,
        backgroundColor: 'background.default',
        // boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        // borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
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
                src="/serpent-swap-logo.svg"
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
                  <Button
                    key={item.label}
                    sx={{
                      color: 'text.primary',
                      fontWeight: 600,
                    }}
                  >
                    {item.label}
                  </Button>
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
          <ConnectButton />
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
          <IconButton>
            <CiSearch />
          </IconButton>

          <ConnectButton />
        </Stack>
      </Stack>
    </Box>
  );
};

export default Header;
