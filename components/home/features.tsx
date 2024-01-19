import { Grid, Typography, Paper, Stack, Box } from '@mui/material';

const Features = () => {
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
          sx={{ p: '80px', height: '640px', overflow: 'hidden' }}
          variant="green"
        >
          <Grid
            container
            spacing={2}
            height={'100%'}
            justifyContent={'space-between'}
          >
            <Grid
              item
              xs={12}
              md={4.5}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                height: '100%',
              }}
            >
              <Typography variant="title">Earn with SerpentSwap multi-fungible liquidity pools</Typography>
              <Typography mt={'16px'}>
                Our liquidity pools allow users to earn rewards on their favorite tokens and NFTs through trading fees.
                A dangerously inclusive decentralized exchange (DEX), poised to unlock all facets of EVM DeFi liquidity.
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                position: 'relative',
                height: '100%',
              }}
            >
              <Box
                style={{
                  position: 'absolute',
                  right: '-5%',
                  bottom: '-30%',
                  width: '468px',
                  height: '500px',
                  backgroundImage: 'url(/ui/pools.png)',
                  backgroundPosition: 'center top',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  borderRadius: '32px',
                  opacity: '0.2',
                }}
              />
              <Box
                style={{
                  position: 'absolute',
                  width: '307px',
                  aspectRatio: '1/1',
                  backgroundImage: 'url(/ui/add-liquidity.png)',
                  backgroundPosition: 'center top',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  borderRadius: '32px',
                }}
              />
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
                  backgroundImage: 'url(/ui/swap.png)',
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
              <Typography variant="title">Swap Tokens</Typography>
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
              <Box
                sx={{
                  backgroundImage: 'url(/ui/fractional-nft.png)',
                  backgroundPosition: 'center top',
                  backgroundSize: 'cover',
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
              <Typography
                variant="title"
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
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Features;
