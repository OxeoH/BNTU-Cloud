import { Stack } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../shared/hooks";
import FilterItem from "../FilterItem";
import {
  FileFilter,
  IFileFilter,
  IUserFilter,
  UserFilter,
} from "../../store/slices/filterSlice";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";

export interface TableFilters {
  filters: IFileFilter[] | IUserFilter[];
  filter: FileFilter | UserFilter;
  setFilter:
    | ActionCreatorWithPayload<UserFilter, "filters/setUserFilter">
    | ActionCreatorWithPayload<FileFilter, "filters/setFileFilter">;
}

const TableFilters = ({ filters, filter, setFilter }: TableFilters) => {
  const dispatch = useAppDispatch();

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      width="100%"
      alignItems="center"
      my={20}
    >
      {filters.map((item) => (
        <FilterItem
          item={item}
          key={item.name}
          setFilter={setFilter}
          filter={filter}
        />
      ))}
    </Stack>
  );
};

export default TableFilters;
