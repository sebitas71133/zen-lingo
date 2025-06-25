import {
  Box,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Chip,
  Autocomplete,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useGetTagsQuery } from "../../services/tagsApi";

const wordTypes = ["Sustantivo", "Verbo", "Adjetivo", "Adverbio"];

export const SearchAndFilters = ({ onChange }) => {
  const [searchText, setSearchText] = useState("");
  const [type, setType] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [onlyLearned, setOnlyLearned] = useState(false);

  const { uid } = useSelector((state) => state.auth);

  const { data: tags = [], isLoading } = useGetTagsQuery(undefined, {
    skip: !uid,
  });

  const emitChange = (newFilters) => {
    onChange({
      searchText,
      type,
      selectedTags,
      onlyLearned,
      ...newFilters,
    });
  };

  const handleTagChange = (event, newValue) => {
    setSelectedTags(newValue);
    emitChange({ selectedTags: newValue.map((t) => t.name) });
  };

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
        onChange={(e) => {
          setSearchText(e.target.value);
          emitChange({ searchText: e.target.value });
        }}
      />

      <TextField
        label="Tipo"
        select
        variant="outlined"
        size="small"
        value={type}
        onChange={(e) => {
          setType(e.target.value);
          emitChange({ type: e.target.value });
        }}
        sx={{ minWidth: 140 }}
      >
        <MenuItem value="">Todos</MenuItem>
        {wordTypes.map((t) => (
          <MenuItem key={t} value={t}>
            {t}
          </MenuItem>
        ))}
      </TextField>

      <Autocomplete
        multiple
        options={tags}
        getOptionLabel={(option) => option.name}
        value={selectedTags}
        onChange={handleTagChange}
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
            onChange={(e) => {
              setOnlyLearned(e.target.checked);
              emitChange({ onlyLearned: e.target.checked });
            }}
          />
        }
        label="Solo aprendidas"
      />
    </Box>
  );
};
