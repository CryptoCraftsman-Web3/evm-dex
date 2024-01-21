'use client';

import Elevator from '@/components/home/elevator';
import EndCta from '@/components/home/end-cta';
import Faq from '@/components/home/faq';
import Features from '@/components/home/features';
import Hero from '@/components/home/hero';
import Statistics from '@/components/home/statistics';
import { Stack } from '@mui/material';

const HomeClientPage = () => {
  return (
    <Stack gap={{ xs: '80px', md: '200px' }}>
      <Hero />
      <Elevator />
      <Statistics />
      <Features />
      <Faq />
      <EndCta />
      {/* 
       */}
    </Stack>
  );
};

export default HomeClientPage;
