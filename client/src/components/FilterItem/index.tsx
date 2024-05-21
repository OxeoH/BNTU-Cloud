import { Autocomplete, TextField } from "@mui/material";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../shared/hooks";
import { IFilter, setFilter } from "../../store/slices/filterSlice";

const Filter = ({ item }: { item: IFilter }) => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.filter.filter);
  const [value, setValue] = React.useState<string | null>(null);
  const [inputValue, setInputValue] = React.useState("");
  console.log(item.type);

  const handleChange = (event: any, newValue: string | null) => {
    dispatch(setFilter({ ...filter, [item.type]: newValue }));
    setValue(newValue);
  };

  const handleInputChange = (event: any, newInputValue: string) => {
    setInputValue(newInputValue);
  };

  return (
    <Autocomplete
      value={value}
      onChange={(event: any, newValue: string | null) =>
        handleChange(event, newValue)
      }
      inputValue={inputValue}
      onInputChange={(event, newInputValue) =>
        handleInputChange(event, newInputValue)
      }
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
  );
};

export default Filter;
