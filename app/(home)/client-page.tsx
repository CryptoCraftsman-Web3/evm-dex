'use client';

import Elevator from '@/components/index/Elevator';
import Features from '@/components/index/Features';
import Hero from '@/components/index/Hero';
import Statistics from '@/components/index/Statistics';
import Faq from '@/components/index/faq';
import { Box, Button, Grid, Typography } from '@mui/material';
import Link from 'next/link';

const HomeClientPage = () => {
  return (
    <>
      <Box sx={{ width: '1320px', maxWidth: '100%', mx: 'auto', px: { xs: '2%' } }}>
        <Hero />
        <Elevator />
        <Statistics />
        <Features />
        <Faq />
        <Box height={'300px'} />
      </Box>
    </>
  );
};

export default HomeClientPage;
