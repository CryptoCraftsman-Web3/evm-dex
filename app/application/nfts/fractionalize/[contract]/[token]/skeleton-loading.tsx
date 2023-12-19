'use client';

import { Grid, Skeleton, Stack } from '@mui/material';

export default function SkeletonLoading() {
  return (
    <Stack
      direction="column"
      spacing={4}
    >
      <Stack
        direction="column"
        spacing={1}
      >
        <Skeleton
          variant="rounded"
          width="50%"
          height="48px"
        />
        <Skeleton
          variant="rounded"
          width="40%"
          height="18px"
        />
      </Stack>

      <Grid
        container
        spacing={6}
      >
        <Grid
          item
          xs={12}
          md={6}
        >
          <Skeleton
            variant="rounded"
            sx={{
              width: '70%',
              height: '100%',
              aspectRatio: '1 / 1',
            }}
          />
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
        >
          <Stack
            direction="column"
            spacing={3}
          >
            <Skeleton
              variant="rounded"
              height="40px"
              width="100%"
            />

            <Skeleton
              variant="rounded"
              height="40px"
              width="100%"
            />

            <Skeleton
              variant="rounded"
              height="40px"
              width="100%"
            />

            <Skeleton
              variant="rounded"
              height="40px"
              width="100%"
            />
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}
