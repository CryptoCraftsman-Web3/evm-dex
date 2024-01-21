import { Grid, Paper, Typography, Button, useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery'
import Link from 'next/link';

const EndCta = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  return (
    <Grid
      container
      spacing={2}
      pt={'70px'}
    >
      <Grid
        item
        xs={12}
      >
        <Paper
          sx={{
            p: '60px',
            textAlign: 'center',
          }}
        >
          <Grid
            container
            justifyContent={'center'}
            gap={'60px'}
          >
            <Grid
              item
              xs={12}
              md={8}
              alignItems={'center'}
              textAlign={'center'}
            >
              <Typography
                variant='h2'
                mt={'60px'}
                mb={'20px'}
                fontSize={{ xs: '40px', md: 'initial' }}
              >
                Ready to turn on the power?
              </Typography>
              <Typography mb={'20px'}>
                Contribute to the future of multi-fungible DeFi with SerpentSwap. Whether you are a daily hustler or a
                long-term HODLer, unlock the true power of your assets..
              </Typography>
              <Link href="/application/swap">
                <Button
                  variant="contained"
                  size="large"
                >
                  Launch app
                </Button>
              </Link>
            </Grid>
            <Grid
              item
              xs={12}
            >
              <img
                src={'/illustrations/plug.png'}
                alt={'cta'}
                style={{ maxWidth: '100%' }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default EndCta;
