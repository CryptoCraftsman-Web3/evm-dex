import { Grid, Typography, useTheme } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'

const Elevator = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  return (
    <Grid
      container
      justifyContent={'center'}
    >
      <Grid item xs={12} md={10} style={{ position: 'relative' }}>
        <Typography
          variant={matches ? 'h3' : 'subtitleSemibold'}
          color='#827D82'
          sx={{
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <span
            style={{
              color: '#519E4A'
            }}
          >
            Serpent Swap
          </span>
          &nbsp;- your companion to navigating the EVM DeFi ecosystem. Swap between assets, provide liquidity using tokens or NFTs, and earn fees.
        </Typography>
      </Grid>
    </Grid>
  )
}

export default Elevator

//   < span
// style = {{
//   position: 'absolute',
//     top: '-25%',
//       left: '15%',
//         width: '576.631px',
//           height: '354.799px',
//             maxWidth: '100%',
//               flexShrink: 0,
//                 borderRadius: 'var(--0, 576.631px)',
//                   background: 'conic-gradient(from 200deg at 55.62% 52.65%, #C2E95A 55.566471219062805deg, #C2E95A 154.42988991737366deg, #C2E95A 205.1064419746399deg, #DF9FF5 281.5150237083435deg, #E19AFF 359.5929479598999deg)',
//                     mixBlendMode: 'overlay',
//                       filter: 'blur(50px)',
//                         overflow: 'hidden'
// }}
// />