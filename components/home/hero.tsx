import { Button, Grid, Typography } from '@mui/material';
import Link from 'next/link';

const Hero = () => {
  return (
    <Grid
      container
      spacing={2}
      sx={{
        minHeight: '90vh',
      }}
    >
      <Grid
        item
        xs={12}
        md={12 / 2}
        textAlign={{ xs: 'center', md: 'left' }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: { xs: 'center', md: 'flex-start' },
        }}
      >
        <Typography
          variant="h1"
          sx={{
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          Serpent<br />Swap
        </Typography>
        <Typography
          variant="subtitle"
          mb={'40px'}
          width={'525px'}
          maxWidth={'95%'}
        >
          Shed the old, and embrace a new future of multi-fungible finance
        </Typography>
        <Link href="/about">
          <Button
            variant="contained"
            size="large"
          >
            Learn More
          </Button>
        </Link>
      </Grid>
      <Grid
        item
        xs={12}
        md={12 / 2}
      >
        <div style={{ position: 'relative', height: '100%', width: '100%' }}>
          <img
            src="/hero-illustration.svg"
            alt="hero"
            height="100%"
            style={{
              position: 'absolute',
              right: 0,
              width: '800px',
              maxWidth: '100%',
            }}
          />
        </div>
      </Grid>
    </Grid>
  );
};

export default Hero;
