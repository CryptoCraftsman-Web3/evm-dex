import { Button, Theme, useMediaQuery, Box, Typography } from '@mui/material';
import { Avatar, ConnectKitButton } from 'connectkit';

const ConnectButton = () => {
  const isMdAndUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

  const disconnectedLabel = isMdAndUp ? 'Connect Wallet' : 'Connect';

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show, hide, address, ensName, chain }) => {
        const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null;
        const shortestAddress = address ? `${address.slice(0, 5)}...${address.slice(-3)}` : null;

        const displayAddress = isMdAndUp ? shortAddress : shortestAddress;

        if (!isConnected) return (
          <Button
            variant="widget"
            size="small"
            onClick={show}
            startIcon={
              isConnected ? (
                <Avatar
                  size={18}
                  address={address}
                />
              ) : null
            }
            sx={{
              textTransform: 'none',
            }}
          >
            {isConnected ? displayAddress : disconnectedLabel}
          </Button>
        );

        return (
          <button
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              width: '135px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
              gap: '12px'
            }}
            onClick={show}
          >
            <Avatar
              size={18}
              address={address}
            />
            <Typography>
              {displayAddress}
            </Typography>
          </button>
        )
      }}
    </ConnectKitButton.Custom>
  );
};

export default ConnectButton;
