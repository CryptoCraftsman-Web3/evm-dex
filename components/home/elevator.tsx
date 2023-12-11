import { Grid, Typography } from '@mui/material'

const Elevator = () => {
  return (
    <Grid container spacing={2} py={'70px'}>
      <Grid item md={1}></Grid>
      <Grid item xs={12} md={10} style={{ position: 'relative' }}>
        <Typography
          variant='h3'
          color='#827D82'
        >
          <span
            style={{
              position: 'absolute',
              top: '-25%',
              left: '15%',
              width: '576.631px',
              height: '354.799px',
              flexShrink: 0,
              borderRadius: 'var(--0, 576.631px)',
              background: 'conic-gradient(from 200deg at 55.62% 52.65%, #C2E95A 55.566471219062805deg, #C2E95A 154.42988991737366deg, #C2E95A 205.1064419746399deg, #DF9FF5 281.5150237083435deg, #E19AFF 359.5929479598999deg)',
              mixBlendMode: 'overlay',
              filter: 'blur(50px)',
              overflow: 'hidden'
            }}
          />
          <span style={{ color: '#519E4A' }}>Introducing Serpent swap</span> - your companion in navigating the XRPL EVM and its technology. Manage your account, provide liquidity, swap your tokens and earn rewards.
        </Typography>
      </Grid>
      <Grid item md={1}></Grid>
    </Grid>
  )
}

export default Elevator