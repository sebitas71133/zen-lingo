import {
  Box,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Chip,
  Autocomplete,
} from "@mui/material";

import { wordTypeColors } from "../utils/wordTypes";

import { useSelector, useDispatch } from "react-redux";
import {
  setOnlyLearned,
  setSearchText,
  setSelectedTags,
  setType,
} from "../../store/slices/wordFilterSlice";
import { useTagStore } from "../hooks/useTagStore";

export const SearchAndFilters = () => {
  const dispatch = useDispatch();
  const { searchText, type, selectedTags, onlyLearned } = useSelector(
    (state) => state.wordFilter
  );

  const { tags = [], isLoading } = useTagStore();

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        mb: 3,
        mt: 2,
      }}
    >
      <TextField
        label="Buscar"
        variant="outlined"
        size="small"
        value={searchText}
        onChange={(e) => dispatch(setSearchText(e.target.value))}
      />

      <TextField
        label="Tipo"
        select
        variant="outlined"
        size="small"
        value={type}
        onChange={(e) => dispatch(setType(e.target.value))}
        sx={{ minWidth: 140 }}
      >
        <MenuItem value="">Todos</MenuItem>
        {Object.entries(wordTypeColors).map(([type, color]) => (
          <MenuItem
            key={type}
            value={type}
            sx={{
              "&:hover": {
                backgroundColor: color,
                opacity: 0.85,
              },
            }}
          >
            {type}
          </MenuItem>
        ))}
      </TextField>

      <Autocomplete
        multiple
        options={tags}
        getOptionLabel={(option) => option.name}
        value={selectedTags}
        onChange={(event, newValue) => dispatch(setSelectedTags(newValue))}
        loading={isLoading}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              variant="outlined"
              label={option.name}
              {...getTagProps({ index })}
              key={option.id}
            />
          ))
        }
        renderInput={(params) => (
          <TextField {...params} label="Etiquetas" size="small" />
        )}
        sx={{ minWidth: 200 }}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={onlyLearned}
            onChange={(e) => dispatch(setOnlyLearned(e.target.checked))}
          />
        }
        label="Solo aprendidas"
      />
    </Box>
  );
};
