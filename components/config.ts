export const config = {
  navItems: [
    {
      label: 'Swap',
      href: '/swap',
    },
    {
      label: 'Tokens',
      href: '/tokens',
    },
    {
      label: 'NFTs',
      href: '/nfts',
    },
    {
      label: 'Pools' ,
      href: '/pools',
    }
  ],
  feeAmounts: [
    {
      label: '0.05%',
      value: 500,
      tip: 'Best for stable pairs'
    },
    {
      label: '0.3%',
      value: 3000,
      tip: 'Best for most pairs'
    },
    {
      label: '1%',
      value: 10000,
      tip: 'Best for exotic pairs'
    }
  ]
};