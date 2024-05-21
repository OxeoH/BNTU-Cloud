import { Stack } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../shared/hooks";
import FilterItem from "../FilterItem";

const TableFilters = () => {
  const dispatch = useAppDispatch();
  const filterStore = useAppSelector((state) => state.filter);

  //const [filter, setFilter] = useState<Filter>(filterStore.filter);

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      width="100%"
      alignItems="center"
      my={20}
    >
      {filterStore.filtersList.map((item) => (
        <FilterItem item={item} />
      ))}
    </Stack>
  );
};

export default TableFilters;
