import {
  Box,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Chip,
  Autocomplete,
  Tooltip,
  Grid,
  useMediaQuery,
  useTheme,
  Collapse,
  Fab,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { wordTypeColors } from "../utils/wordTypes";

import { useSelector, useDispatch } from "react-redux";
import {
  setItemPerPage,
  setOnlyFavorite,
  setOnlyLearned,
  setSearchText,
  setSelectedTags,
  setSortBy,
  setSortOrder,
  setType,
} from "../../store/slices/wordFilterSlice";
import { useTagStore } from "../hooks/useTagStore";

export const SearchAndFilters = () => {
  const dispatch = useDispatch();
  const {
    searchText,
    type,
    selectedTags,
    onlyLearned,
    onlyFavorite,
    sortBy = "alphabetical",
    sortOrder = "asc",
    itemsPerPage,
  } = useSelector((state) => state.wordFilter);

  const { tags = [], isLoading } = useTagStore();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Pantallas menores a 600px

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        {/* Fila 1: Búsqueda y Tipo */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Buscar"
            variant="outlined"
            size="small"
            fullWidth
            value={searchText}
            onChange={(e) => dispatch(setSearchText(e.target.value))}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Tipo"
            select
            variant="outlined"
            size="small"
            fullWidth
            value={type}
            onChange={(e) => dispatch(setType(e.target.value))}
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
        </Grid>

        {/* Fila 2: Etiquetas */}
        <Grid item xs={12} md={4}>
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
              <TextField {...params} label="Etiquetas" size="small" fullWidth />
            )}
          />
        </Grid>

        {/* Fila 3: Ordenar, Dirección, Por página */}
        <Grid item xs={12} sm={4} md={2}>
          <TextField
            label="Ordenar por"
            select
            size="small"
            fullWidth
            value={sortBy}
            onChange={(e) => dispatch(setSortBy(e.target.value))}
          >
            <MenuItem value="createdAt">Fecha de creación</MenuItem>
            <MenuItem value="alphabetical">Orden alfabético</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={6} sm={4} md={2}>
          <TextField
            label="Dirección"
            select
            size="small"
            fullWidth
            value={sortOrder}
            onChange={(e) => dispatch(setSortOrder(e.target.value))}
          >
            <MenuItem value="asc">Ascendente</MenuItem>
            <MenuItem value="desc">Descendente</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={6} sm={4} md={2}>
          <Tooltip title="Cantidad de palabras por página">
            <TextField
              label="Por página"
              select
              size="small"
              fullWidth
              value={itemsPerPage}
              onChange={(e) => dispatch(setItemPerPage(Number(e.target.value)))}
            >
              {[3, 6, 9, 12, 15].map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </TextField>
          </Tooltip>
        </Grid>

        {/* Fila 4: Checkboxes */}
        <Grid item xs={6} sm={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={onlyLearned}
                onChange={(e) => dispatch(setOnlyLearned(e.target.checked))}
              />
            }
            label="Aprendidas"
          />
        </Grid>

        <Grid item xs={6} sm={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={onlyFavorite}
                onChange={(e) => dispatch(setOnlyFavorite(e.target.checked))}
              />
            }
            label="Favoritos"
          />
        </Grid>
      </Grid>
    </Box>
  );
};
