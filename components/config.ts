import { FeeTier } from '@/types/common';

type NavItem = {
  label: string;
  href: string;
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
    },
    {
      label: 'Transactions',
      href: '/transactions',
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
