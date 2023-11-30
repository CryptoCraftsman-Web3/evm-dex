'use client';

import Elevator from '@/components/home/elevator';
import Features from '@/components/home/features';
import Hero from '@/components/home/hero';
import Statistics from '@/components/home/statistics';
import Faq from '@/components/home/faq';
import { Box, Button, Grid, Typography } from '@mui/material';
import EndCta from '@/components/home/end-cta';

const HomeClientPage = () => {
  return (
    <>
      <Box sx={{ width: '1320px', maxWidth: '100%', mx: 'auto', px: { xs: '2%' } }}>
        <Hero />
        <Elevator />
        <Statistics />
        <Features />
        <Faq />
        <EndCta />
      </Box>
    </>
  );
};

export default HomeClientPage;
