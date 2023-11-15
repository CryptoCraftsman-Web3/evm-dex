import { FeeTier } from '@/types/common';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import PoolIcon from '@mui/icons-material/Pool';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

type NavItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

type AppConfig = {
  navItems: NavItem[];
  feeTiers: FeeTier[];
};

export const config: AppConfig = {
  navItems: [
    {
      label: 'Swap',
      href: '/swap',
      icon: <SwapHorizIcon fontSize='large' />,
    },
    // {
    //   label: 'Tokens',
    //   href: '/tokens',
    // },
    // {
    //   label: 'NFTs',
    //   href: '/nfts',
    // },
    {
      label: 'Pools',
      href: '/pools',
      icon: <PoolIcon fontSize='large' />,
    },
    {
      label: 'Transactions',
      href: '/transactions',
      icon: <ReceiptLongIcon fontSize='large' />,
    }
  ],
  feeTiers: [
    {
      id: 500,
      label: '0.05%',
      value: 500,
      tip: 'Best for stable pairs',
    },
    {
      id: 3000,
      label: '0.3%',
      value: 3000,
      tip: 'Best for most pairs',
    },
    {
      id: 10000,
      label: '1%',
      value: 10000,
      tip: 'Best for exotic pairs',
    },
  ],
};
