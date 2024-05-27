import { Autocomplete, TextField } from "@mui/material";
import React from "react";
import { useAppDispatch } from "../../shared/hooks";
import {
  FileFilter,
  IFileFilter,
  IUserFilter,
  UserFilter,
} from "../../store/slices/filterSlice";

export interface FilterItemProps {
  item: IFileFilter | IUserFilter;
  setFilter: any;
  // | ActionCreatorWithPayload<UserFilter, "filters/setUserFilter">
  // | ActionCreatorWithPayload<FileFilter, "filters/setFileFilter">;

  filter: FileFilter | UserFilter;
}

const FilterItem = ({ item, setFilter, filter }: FilterItemProps) => {
  const dispatch = useAppDispatch();
  const [value, setValue] = React.useState<string | null>(null);
  const [inputValue, setInputValue] = React.useState("");

  const handleChange = (event: any, newValue: string | null) => {
    setValue(newValue);
    dispatch(
      setFilter({
        ...filter,
        [item.type]: newValue ? newValue.toLocaleLowerCase() : null,
      })
    );
  };

  const handleInputChange = (event: any, newInputValue: string) => {
    setInputValue(newInputValue);
  };

  return (
    <Autocomplete
      value={value}
      onChange={(event: any, value: string | null) =>
        handleChange(event, value)
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

export default FilterItem;
