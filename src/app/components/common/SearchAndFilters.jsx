import {
  Box,
  TextField,
  MenuItem,
  Chip,
  Autocomplete,
  Tooltip,
  Grid,
  Collapse,
} from "@mui/material";

import { useTagStore } from "../../hooks/useTagStore";

export const SearchAndFilters = ({
  showFilters,
  setSearch,
  search,
  setSortBy,
  sortBy,
  setOrder,
  order,
  setItemsPerPage,
  itemsPerPage,
  setType,
  type,
  setSelectedTags,
  selectedTags,
  typeColors: wordTypeColors = {},
}) => {
  const { tags = [], isLoading } = useTagStore();

  return (
    <>
      <Box sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Buscar"
            size="small"
            fullWidth
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          ></TextField>
        </Grid>
      </Box>
      <Collapse in={showFilters}>
        <Box sx={{ mb: 5 }}>
          <Grid container spacing={2}>
            {sortBy && (
              <Grid item xs={12} sm={4} md={2}>
                <TextField
                  label="Ordenar por"
                  select
                  size="small"
                  fullWidth
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="createdAt">Fecha de creación</MenuItem>
                  <MenuItem value="alphabetical">Orden alfabético</MenuItem>
                </TextField>
              </Grid>
            )}

            {order && (
              <Grid item xs={6} sm={4} md={2}>
                <TextField
                  label="Dirección"
                  select
                  size="small"
                  fullWidth
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                >
                  <MenuItem value="asc">Ascendente</MenuItem>
                  <MenuItem value="desc">Descendente</MenuItem>
                </TextField>
              </Grid>
            )}

            {/* Items per page */}

            {itemsPerPage && (
              <Grid item xs={6} sm={4} md={2}>
                <Tooltip title="Cantidad de frases por página">
                  <TextField
                    label="Por página"
                    select
                    size="small"
                    fullWidth
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  >
                    {[3, 6, 9, 12, 15].map((num) => (
                      <MenuItem key={num} value={num}>
                        {num}
                      </MenuItem>
                    ))}
                  </TextField>
                </Tooltip>
              </Grid>
            )}

            {/* Type */}
            {wordTypeColors && (
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Tipo"
                  select
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={type}
                  onChange={(e) => setType(e.target.value)}
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
            )}

            {/* Fila 2: Etiquetas */}
            {tags && (
              <Grid item xs={12} md={2}>
                <Autocomplete
                  multiple
                  options={tags}
                  getOptionLabel={(option) => option.name}
                  value={selectedTags}
                  onChange={(event, newValue) => setSelectedTags(newValue)}
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
                    <TextField
                      {...params}
                      label="Etiquetas"
                      size="small"
                      fullWidth
                    />
                  )}
                />
              </Grid>
            )}
          </Grid>
        </Box>
      </Collapse>
    </>
  );
};
