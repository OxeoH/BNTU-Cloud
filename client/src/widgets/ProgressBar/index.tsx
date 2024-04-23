import { LinearProgress, linearProgressClasses, styled } from "@mui/material";

export const ProgressBar = ({
  size,
  value,
}: {
  size: number;
  value: number;
}) => {
  const used = (value * 100) / size;

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      background: `${theme.palette.grey[300]}`, //`linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.light} 30%, rgba(237,205,17,1) 60%, ${theme.palette.warning.main} 90%, ${theme.palette.error.main} 100%)`,
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.primary.light, //`linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.light} 30%, rgba(237,205,17,1) 60%, ${theme.palette.warning.main} 90%, ${theme.palette.error.main} 100%)`, //theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
    },
  }));

  return <BorderLinearProgress variant="determinate" value={used} />;
};
