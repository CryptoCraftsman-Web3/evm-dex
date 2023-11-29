import { Grid, Typography, Paper, Stack, Box } from '@mui/material'

const Features = () => {
  return (
    <Grid container spacing={2} py={'70px'}>
      <Grid item xs={12}>
        <Typography variant='h2' textAlign={'center'} mb={'20px'}>Features</Typography>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: '80px', height: '640px', overflow: 'hidden' }} variant='green'>
          <Grid container spacing={2} height={'100%'} justifyContent={'space-between'}>
            <Grid item xs={12} md={4.5}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                height: '100%',
              }}
            >
              <Typography variant='h4'>Earn with Serpent Swap liquidity pools</Typography>
              <Typography>Our Liquidity Pools feature allows you to provide liquidity to decentralized markets and earn passive income in the form of rewards and transaction fees.</Typography>
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
                  opacity: '0.2'
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
      <Grid item xs={12} md={6}>
        <Paper
          sx={{
            p: '60px',
            overflow: 'hidden',
          }}
          variant='pink'
        >
          <Grid container gap={'60px'}>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
              <Typography variant='h4' color={'#080708'}>Swap your tokens</Typography>
              <Typography color={'#080708'}>A multi-token swap, often referred to as a multi-token decentralized exchange (DEX) transaction, is a complex and versatile financial operation commonly associated.</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid >
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: '60px', overflow: 'hidden' }} variant='lightGreen'>
          <Grid container gap={'60px'}>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
              <Typography variant='h4' color={'#080708'}>Buy fractional NFTs</Typography>
              <Typography color={'#080708'}>Forget having to puurchase insecure, illiquid NFTs. Trade fractions of NFTs and be sure your liquidity is always there when you are ready to sell.</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid >
  )
}

export default Features