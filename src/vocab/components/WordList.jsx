import {
  Autocomplete,
  Box,
  Chip,
  Collapse,
  Container,
  Grid,
  MenuItem,
  Pagination,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { useState, useEffect } from "react";
import { WordCard } from "./WordCard";

import { WordFormDialog } from "./WordFormDialog";

import { useWordStore } from "../hooks/useWordStore";

import { useDispatch, useSelector } from "react-redux";
import { closeDialog, openDialog } from "../../store/slices/uiSlice";
import Swal from "sweetalert2";
import { usePagination } from "../hooks/usePagination";
import { useFiltered } from "../hooks/useFiltered";
import { useTagStore } from "../hooks/useTagStore";
import { wordTypeColors } from "../utils/wordTypes";

export const WordList = ({ words, showFilters = false }) => {
  const dispatch = useDispatch();

  // Obtener tags
  const { tags = [], isLoading } = useTagStore();

  // Uso del hook personalizado con filtros y data filtrada
  const {
    search,
    type,
    order,
    itemsPerPage,
    selectedTags,
    sortBy,
    setSearch,
    setType,
    setOrder,
    setSortBy,
    setItemsPerPage,
    setSelectedTags,

    filteredItems,
  } = useFiltered(words, "word", localStorage.getItem("word_page") ?? 6);

  const {
    currentPageData: currentWords,
    page,
    setPage,
    totalPages,
  } = usePagination(filteredItems, itemsPerPage);

  const { wordEditForm: openForm } = useSelector((state) => state.ui.dialogs);

  const { deleteWordById, updateWordById, isUpdating } = useWordStore();

  const [wordToEdit, setWordToEdit] = useState(null);

  const handleEdit = (word) => {
    setWordToEdit(word);

    dispatch(openDialog("wordEditForm"));
  };

  const handleDelete = async (word) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Vas a eliminar la palabra: "${word.name}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      await deleteWordById(word.id);
      Swal.fire({
        title: "Eliminado",
        text: "La palabra fue eliminada correctamente.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };
  const handleToggleLearned = async (word) => {
    try {
      await updateWordById(word.id, {
        ...word,
        isLearned: !word.isLearned, // alterna el estado
      });
    } catch (error) {
      console.error("Error al actualizar el estado de 'learned':", error);
    }
  };

  const handleToggleFavorite = async (word) => {
    try {
      await updateWordById(word.id, {
        ...word,
        isFavorite: !word.isFavorite, // alterna el estado
      });
    } catch (error) {
      console.error("Error al actualizar el estado de 'learned':", error);
    }
  };
  // Reset form on close
  useEffect(() => {
    if (!openForm) setWordToEdit(null);
  }, [openForm]);

  return (
    <Box sx={{ mt: 4 }}>
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
            {/* Fila 2: Etiquetas */}
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
          </Grid>
        </Box>
      </Collapse>
      <Grid container spacing={2}>
        {currentWords.map((word) => (
          <Grid item key={word.id} xs={12} sm={6} md={4} lg={3}>
            <WordCard
              word={word}
              onEdit={() => handleEdit(word)}
              onDelete={() => handleDelete(word)}
              onToggleLearned={() => handleToggleLearned(word)}
              onToggleFavorite={() => handleToggleFavorite(word)}
              isUpdating={isUpdating}
            />
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Stack mt={4} alignItems="center">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Stack>
      )}

      <WordFormDialog
        open={openForm}
        onClose={() => dispatch(closeDialog("wordEditForm"))}
        initialData={wordToEdit}
      />
    </Box>
  );
};
