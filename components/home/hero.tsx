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
        mt={{ xs: '35px', md: '124px' }}
      >
        <Typography variant="h1">
          Serpent
          <br />
          Swap
        </Typography>
        <Typography
          variant="subtitle1"
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
              maxWidth: '800px',
            }}
          />
        </div>
      </Grid>
    </Grid>
  );
};

export default Hero;
