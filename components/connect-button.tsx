import { Button, Theme, useMediaQuery } from '@mui/material';
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

        return (
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
      }}
    </ConnectKitButton.Custom>
  );
};

export default ConnectButton;
