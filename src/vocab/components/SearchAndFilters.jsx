import {
  Box,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Chip,
  Autocomplete,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTagStore } from "../hooks/useTagStore";
import { useLoadTagsOnMount } from "../hooks/useLoadTagsOnMount";

const wordTypes = ["Sustantivo", "Verbo", "Adjetivo", "Adverbio"];

export const SearchAndFilters = ({ onChange }) => {
  const [searchText, setSearchText] = useState("");
  const [type, setType] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [onlyLearned, setOnlyLearned] = useState(false);

  const { loadTags } = useTagStore(); // ✅ ahora está dentro del componente
  const allTags = useSelector((state) => state.tags.list); // ✅ también aquí

  // Cargar los tags al montar
  //   useEffect(() => {
  //     loadTags();
  //   }, []);

  useLoadTagsOnMount();

  const emitChange = (newFilters) => {
    onChange({
      searchText,
      type,
      selectedTags,
      onlyLearned,
      ...newFilters,
    });
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
        options={allTags}
        value={selectedTags}
        onChange={(event, newValue) => {
          setSelectedTags(newValue);
          emitChange({ selectedTags: newValue });
        }}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              variant="outlined"
              label={option}
              {...getTagProps({ index })}
              key={option}
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
