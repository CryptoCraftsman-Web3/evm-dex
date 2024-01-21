import { Grid, Typography, Paper, Stack, Box, useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery'
import Image from 'next/image';

const Features = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  return (
    <Grid
      container
      spacing={2}
      py={'70px'}
    >
      <Grid
        item
        xs={12}
      >
        <Typography
          variant="h2"
          textAlign={'center'}
          mb={'20px'}
        >
          Features
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
      >
        <Paper
          sx={{
            p: { xs: '20px', md: '0px' },
            height: '640px',
            width: '100%',
            flexShrink: 0,
            overflow: 'hidden'
          }}
          variant="green"
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent='space-between'
            width='100%'
            height='100%'
            alignItems='center'
          >
            <Box width="456px" maxWidth='100%' mx="auto">
              <Typography variant={matches ? 'title' : 'subtitleSemibold'}>Earn with Serpent Swap multi-fungible liquidity pools</Typography>
              <Typography mt={'16px'}>
                Our liquidity pools allow users to earn rewards on their favorite tokens and NFTs through trading fees.
                A dangerously inclusive decentralized exchange (DEX), poised to unlock all facets of EVM DeFi liquidity.
              </Typography>
            </Box>
            <Box
              sx={{
                position: 'relative',
                height: '100%',
                width: { xs: '100%', md: '50%' },
              }}
            >
              <Image
                src='/ui/income-feature.svg'
                alt='Earn with Serpent Swap multi-fungible liquidity pools'
                height={600}
                width={520}
                style={{
                  position: 'absolute',
                  maxHeight: '100%',
                  maxWidth: '100%',
                  bottom: '-25px',
                  margin: '0 auto',
                }}
              />
            </Box>
          </Stack>
        </Paper>
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
      >
        <Paper
          sx={{
            p: { xs: '20px', md: '0px' },
            height: { xs: 'fit-content', md: '757px' },
            width: '100%',
            flexShrink: 0,
            overflow: 'hidden'
          }}
          variant="pink"
        >
          <Stack
            direction={'column'}
            justifyContent={{ md: 'space-between' }}
            width='100%'
            height='100%'
            alignItems='center'
            gap={{ xs: '20px', md: '0px' }}
          >
            <Box
              sx={{
                height: { xs: 'initial', md: '100%' },
                width: '100%',
                display: 'flex',
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '530px',
                  height: { xs: '245px', md: '420px' },
                  maxHeight: '100%',
                  maxWidth: '100%',
                  margin: 'auto',
                }}
              >
                <Image
                  src='/ui/swap-feature.svg'
                  alt='Earn with Serpent Swap multi-fungible liquidity pools'
                  fill
                />
              </Box>
            </Box>
            <Box
              width="456px"
              maxWidth='100%'
              height={{ xs: 'initial', md: '50%' }}
              mx="auto"
              pb={{ xs: '8px', md: 0 }}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography variant={matches ? 'title' : 'subtitleSemibold'}>Swap Tokens</Typography>
              <Typography mt={'16px'} color={'#080708'}>
                The SerpentSwap DEX is a powerful tool when navigating the EVM ecosystem. Swap between any tokens in
                seconds and participate in the fastest growing DeFi ecosystem.
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
      >
        <Paper
          sx={{
            p: { xs: '20px', md: '0px' },
            height: { xs: 'fit-content', md: '757px' },
            width: '100%',
            flexShrink: 0,
            overflow: 'hidden'
          }}
          variant="lightGreen"
        >
          <Stack
            direction={'column'}
            justifyContent={{ md: 'space-between' }}
            width='100%'
            height='100%'
            alignItems='center'
            gap={{ xs: '20px', md: '0px' }}
          >
            <Box
              width="456px"
              maxWidth='100%'
              height={{ xs: 'initial', md: '50%' }}
              pt="auto"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography variant={matches ? 'title' : 'subtitleSemibold'}>Fractionalize NFTs</Typography>
              <Typography mt={'16px'} color={'#080708'}>
                Swap, trade and liquidity pool fractions of non-fungible tokens. Fractionalizing increases the liquidity
                and utility of all NFTs.
              </Typography>
            </Box>
            <Box
              sx={{
                height: { xs: 'initial', md: '100%' },
                width: '100%',
                display: 'flex',
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '530px',
                  height: { xs: '245px', md: '420px' },
                  maxHeight: '100%',
                  maxWidth: '100%',
                  margin: 'auto',
                }}
              >
                <Image
                  src='/ui/fraction-feature.svg'
                  alt='Earn with Serpent Swap multi-fungible liquidity pools'
                  fill
                />
              </Box>
            </Box>
          </Stack>
        </Paper>
      </Grid>
      {/* <Grid
        item
        xs={12}
        md={6}
      >
        <Paper
          sx={{
            p: '60px',
            overflow: 'hidden',
          }}
          variant="pink"
        >
          <Grid
            container
            gap={'60px'}
          >
            <Grid
              item
              xs={12}
            >
              <Box
                sx={{
                  backgroundImage: 'url(/ui/swap-feature.svg)',
                  backgroundPosition: 'center center',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  borderRadius: '32px',
                  width: '100%',
                  height: '416px',
                }}
              />
            </Grid>
            <Grid
              item
              xs={12}
            >
              <Typography variant={matches ? 'title' : 'subtitleSemibold'}>Swap Tokens</Typography>
              <Typography
                mt={'16px'}
                color={'#080708'}
              >
                The SerpentSwap DEX is a powerful tool when navigating the EVM ecosystem. Swap between any tokens in
                seconds and participate in the fastest growing DeFi ecosystem.
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
      >
        <Paper
          sx={{ p: '60px', overflow: 'hidden' }}
          variant="lightGreen"
        >
          <Grid
            container
            gap={'60px'}
            sx={{ alignItems: 'stretch' }}
          >
            <Grid
              item
              xs={12}
            >
              <Typography
                variant={matches ? 'title' : 'subtitleSemibold'}
                color={'#080708'}
              >
                Fractionalize NFTs
              </Typography>
              <Typography
                mt={'16px'}
                color={'#080708'}
              >
                Swap, trade and liquidity pool fractions of non-fungible tokens. Fractionalizing increases the liquidity
                and utility of all NFTs.
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
            >
              <Box
                sx={{
                  backgroundImage: 'url(/ui/fraction-feature.svg)',
                  backgroundPosition: 'center top',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  borderRadius: '32px',
                  width: '100%',
                  height: '416px',
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid> */}
    </Grid>
  );
};

export default Features;
