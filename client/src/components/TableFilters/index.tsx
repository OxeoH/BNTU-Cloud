import { Autocomplete, Stack, TextField } from "@mui/material";
import React from "react";
import { FileType } from "../../api/File/types";

const TableFilters = () => {
  let typeOptions = Object.entries(FileType);

  const filtersList = [
    {
      name: "Тип",
      options: typeOptions.map((entry) => {
        return { value: entry[0], title: entry[1] };
      }),
    },
    {
      name: "Люди",
      options: [
        { value: "egor@gmail.com", title: "egor@gmail.com" },
        { value: "sasha@gmail.com", title: "sasha@gmail.com" },
      ],
    },
    {
      name: "Местоположение",
      options: [
        { value: "all", title: "В любом месте" },
        { value: "my", title: "Моё хранилище" },
        { value: "shared", title: "Доступные мне" },
      ],
    },
  ];
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      width="100%"
      alignItems="center"
      my={20}
    >
      {filtersList.map((item) => (
        <Autocomplete
          freeSolo
          fullWidth
          sx={{ mx: 20 }}
          options={item.options.map((option) => option.title)}
          renderInput={(params) => (
            <TextField
              {...params}
              label={item.name}
              InputProps={{
                ...params.InputProps,
                style: {
                  borderRadius: 20,
                  borderColor: "ActiveBorder",
                },
              }}
              InputLabelProps={{
                style: {
                  borderRadius: 20,
                  borderColor: "ActiveBorder",
                },
              }}
            />
          )}
        />
      ))}
    </Stack>
  );
};

export default TableFilters;
