'use client';

import Elevator from '@/components/index/elevator';
import Features from '@/components/index/features';
import Hero from '@/components/index/hero';
import Statistics from '@/components/index/statistics';
import Faq from '@/components/index/faq';
import { Box, Button, Grid, Typography } from '@mui/material';
import EndCta from '@/components/index/end-cta';

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
