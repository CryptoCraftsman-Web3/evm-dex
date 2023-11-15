import { Box, Button, IconButton, Stack } from '@mui/material';
import { config } from './config';
import Link from 'next/link';

const AppFooter = () => {
  return (
    <Box
      sx={{
        display: { xs: 'flex', md: 'none' },
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        zIndex: 10,
        backgroundColor: 'background.default',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-around"
        alignItems="center"
        p={2}
        sx={{ width: '100%' }}
      >
        {config.navItems.map((item, index) => {
          return (
            <Link
              key={index}
              href={item.href}
            >
              <IconButton
                key={item.label}
                sx={{
                  color: 'text.primary',
                  p: 0,
                }}
              >
                {item.icon}
              </IconButton>
            </Link>
          );
        })}
      </Stack>
    </Box>
  );
};

export default AppFooter;
