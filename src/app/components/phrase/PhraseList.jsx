import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Swal from "sweetalert2";
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

import { PhraseFormDialog } from "./PhraseFormDialog";

import { closeDialog, openDialog } from "../../../store/slices/uiSlice";
import { PhraseCard } from "./PhraseCard";

import { usePhraseStore } from "../../hooks/usePhraseStore";
import { useTagStore } from "../../hooks/useTagStore";
import { useFiltered } from "../../hooks/useFiltered";

import { phraseTypeColors } from "../../utils/wordTypes";
import { usePagination } from "../../hooks/usePagination";

export const PhraseList = ({ phrases, showFilters }) => {
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
    setSearch,
    setType,
    setOrder,
    setItemsPerPage,
    setSelectedTags,

    filteredItems,
  } = useFiltered(phrases, "phrase", localStorage.getItem("phrase_page") ?? 6);

  const {
    currentPageData: currentPhrases,
    page,
    setPage,
    totalPages,
  } = usePagination(filteredItems, itemsPerPage);

  const { phraseEditForm: openForm } = useSelector((state) => state.ui.dialogs);

  const {
    deletePhraseById,
    toggleFavoriteById,
    toggleIsLearnedById,
    isUpdating,
  } = usePhraseStore();

  const [wordToEdit, setWordToEdit] = useState(null);

  const handleEdit = (word) => {
    setWordToEdit(word);

    dispatch(openDialog("phraseEditForm"));
  };

  const handleToggleFavorite = async (word) => {
    await toggleFavoriteById(word.id, word);
  };

  const handleToggleIsLearned = async (word) => {
    await toggleIsLearnedById(word.id, word);
  };

  const handleDelete = async (phrase) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Vas a eliminar la frase `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      await deletePhraseById(phrase.id);
      Swal.fire({
        title: "Eliminado",
        text: "La frase o idiom fue eliminada correctamente.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

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
                {Object.entries(phraseTypeColors).map(([type, color]) => (
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

      <Box>
        {/* LISTA DE PHRASES */}
        <Grid container spacing={2}>
          {currentPhrases.map((word) => (
            <Grid item key={word.id} xs={12} sm={6} md={4} lg={3}>
              <PhraseCard
                phrase={word}
                onEdit={() => handleEdit(word)}
                onDelete={() => handleDelete(word)}
                onToggleLearned={() => handleToggleIsLearned(word)}
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

        <PhraseFormDialog
          open={openForm}
          onClose={() => dispatch(closeDialog("phraseEditForm"))}
          initialData={wordToEdit}
        />
      </Box>
    </Box>
  );
};
