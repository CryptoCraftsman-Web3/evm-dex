'use client';

import { Skeleton, Stack } from '@mui/material';

export default function SkeletonLoading() {
  return (
    <>
      <Skeleton
        variant="rounded"
        width="100%"
        height={50}
      />

      <Skeleton
        variant="rounded"
        width="100%"
        height={150}
      />

      <Skeleton
        variant="rounded"
        width="100%"
        height={150}
      />

      <Stack
        direction="row"
        spacing={2}
      >
        <Skeleton
          variant="rounded"
          width="49%"
          height={150}
        />

        <Skeleton
          variant="rounded"
          width="49%"
          height={150}
        />
      </Stack>

      <Skeleton
        variant="rounded"
        width="100%"
        height={150}
      />
    </>
  );
}
