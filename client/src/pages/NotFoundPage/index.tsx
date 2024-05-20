import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MAIN_ROUTE } from "../../routes/utils/consts";
import { Stack, Typography } from "@mui/material";
import { SentimentVeryDissatisfied } from "@mui/icons-material";

export default function NotFoundPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(MAIN_ROUTE);
    }, 3000);

    // Очистка таймера при размонтировании компонента
    return () => clearTimeout(timer);
  }, []);
  return (
    <Stack
      width="100%"
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Typography variant="h2" color="InfoText" sx={{ my: 10 }}>
        Упс..Страница не найдена
      </Typography>
      <Typography
        variant="subtitle1"
        color={(theme) => theme.palette.primary.main}
        sx={{ my: 10 }}
      >
        Вы будете перенаправлены через 3 секунды...
      </Typography>
      <SentimentVeryDissatisfied fontSize="large" color="primary" />
    </Stack>
  );
}
