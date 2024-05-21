import Skeleton from "@mui/material/Skeleton";
import { Avatar, Box, Stack, Typography } from "@mui/material";

export default function SkeletonLoader({ count }: { count: number }) {
  let skeletons = [];
  for (let i = 0; i < count; i++) {
    skeletons[i] = i;
  }
  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      width="90%"
      p={20}
    >
      {skeletons.map((num) => (
        <Stack
          key={num}
          direction="row"
          justifyContent="center"
          alignItems="center"
          width="100%"
          mb={10}
        >
          <Typography variant="h2" width="100%" mr={4}>
            <Skeleton variant="circular" animation="wave">
              <Avatar />
            </Skeleton>
          </Typography>
          <Typography variant="h2" width="100%" mr={4}>
            <Skeleton animation="wave" width="100%" />
          </Typography>
          <Typography variant="h2" width="100%" mr={4}>
            <Skeleton animation="wave" width="100%" />
          </Typography>
          <Typography variant="h2" width="100%" mr={4}>
            <Skeleton animation="wave" width="100%" />
          </Typography>
          <Typography variant="h2" width="100%" mr={4}>
            <Skeleton animation="wave" width="100%" />
          </Typography>
          <Typography variant="h2" width="100%" mr={4}>
            <Skeleton animation="wave" width="100%" />
          </Typography>
          <Typography variant="h2" width="100%" mr={4}>
            <Skeleton animation="wave" width="100%" />
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}
