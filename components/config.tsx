import { FeeTier } from '@/types/common';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import PoolIcon from '@mui/icons-material/Pool';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TokenIcon from '@mui/icons-material/Token';

type NavItem = {
  label: string;
  href: string;
  icon?: React.ReactNode | string;
  isHidden?: boolean;
};

type AppConfig = {
  homeNavItems: NavItem[];
  appNavItems: NavItem[];
  feeTiers: FeeTier[];
  socialNavItems: {
    label: string;
    href: string;
    icon: string;
  }[];
};

export const config: AppConfig = {
  homeNavItems: [
    {
      label: 'Blog',
      href: '/blog',
      isHidden: true,
    },
    {
      label: 'About',
      href: '/about',
      isHidden: true,
    },
    {
      label: 'Help center',
      href: '/help',
      isHidden: true,
    },
  ],
  appNavItems: [
    {
      label: 'Swap',
      href: '/app/swap',
      icon: <SwapHorizIcon fontSize="large" />,
    },
    {
      label: 'Tokens',
      href: '/tokens',
    },
    {
      label: 'NFTs',
      href: '/app/nfts',
      icon: <TokenIcon fontSize="large" />,
    },
    {
      label: 'Pools',
      href: '/app/pools',
      icon: <PoolIcon fontSize="large" />,
    },
    {
      label: 'Transactions',
      href: '/app/transactions',
      icon: <ReceiptLongIcon fontSize="large" />,
    },
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
  socialNavItems: [
    {
      label: 'X',
      href: 'https://x.com/serpentswap',
      icon: '/icons/x.svg',
    },
    {
      label: 'Discord',
      href: 'https://Discord.com/#',
      icon: '/icons/discord.svg'
    },
  ]
};
