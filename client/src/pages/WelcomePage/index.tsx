import { Stack, Typography } from "@mui/material";
import React from "react";

export default function index() {
  return (
    <Stack
      direction="column"
      alignItems="center"
      justifyContent="center"
      width="100%"
      textAlign="center"
    >
      <Typography variant="h2" color="primary" my={20}>
        Облачное хранилище для кафедральных документов
      </Typography>
      <Typography variant="h6" color="text">
        Перед использованием требуется пройти регистрацию
      </Typography>
    </Stack>
  );
}
