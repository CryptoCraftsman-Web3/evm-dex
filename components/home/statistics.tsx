import { Grid, Paper, Stack, Box, Typography } from '@mui/material'

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
    bg: '#DB8BFE26'
  },
  {
    icon: '/icons/people.svg',
    text: 'Daily active users',
    value: '75,000+',
    bg: '#8DD87A21'
  },
  {
    icon: '/icons/dollars.svg',
    text: 'Total value locked',
    value: '$10.8M+',
    bg: '#293607'
  }
]

const Statistics = () => {
  return (
    <Grid container spacing={2} py={'70px'}>
      {stats.map((stat, index) => (
        <Grid item xs={12} md={4} key={index}>
          <Paper sx={{ p: '40px' }}>
            <Stack justifyContent={'space-between'}>
              <Box
                sx={{
                  padding: '20px',
                  width: '80px',
                  height: '80px',
                  backgroundColor: stat.bg,
                  borderRadius: '50%',
                  overflow: 'visible',
                  mb: '28px'
                }}
              >
                <img
                  src={stat.icon}
                />
              </Box>
              <Box>
                <Typography variant='h4'>{stat.value}</Typography>
                <Typography variant='subtitle1'>{stat.text}</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      ))}
    </Grid>
  )
}

export default Statistics