import { Grid, Paper, Stack, Box, Typography } from '@mui/material';

interface StatsProps {
  icon: string;
  text: string;
  value: string;
  bg: string;
}

const stats: StatsProps[] = [
  {
    icon: '/icons/users.svg',
    text: 'Total registered users',
    value: '500,000+',
    bg: '#DB8BFE26',
  },
  {
    icon: '/icons/people.svg',
    text: 'Daily active users',
    value: '75,000+',
    bg: '#8DD87A21',
  },
  {
    icon: '/icons/dollars.svg',
    text: 'Total value locked',
    value: '$10.8M+',
    bg: '#293607',
  },
];

const Statistics = () => {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      gap={{ xs: '20px', md: '19px' }}
    >
      {stats.map((stat, index) => (
        <Paper
          key={index}
          sx={{
            p: { xs: '20px, 28px', md: '40px' },
            width: '427px',
            maxWidth: '100%',
            mx: 'auto',
          }}
        >
          <Stack gap={{ xs: '20px', md: '28px' }}>
            <Box
              sx={{
                padding: '20px',
                width: '80px',
                height: '80px',
                backgroundColor: stat.bg,
                borderRadius: '50%',
                overflow: 'visible',
              }}
            >
              <img src={stat.icon} />
            </Box>
            <Box sx={{ textTransform: 'capitalize' }}>
              <Typography variant="title">{stat.value}</Typography>
              <Typography variant="subtitle1">{stat.text}</Typography>
            </Box>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
};

export default Statistics;
