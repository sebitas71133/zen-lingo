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
import { VerbCard } from "./VerbCard";
import { VerbFormDialog } from "./VerbFormDialog";
import { usePagination } from "../../hooks/usePagination";
import { useVerbStore } from "../../hooks/useVerbStore";
import { useTagStore } from "../../hooks/useTagStore";
import { useFiltered } from "../../hooks/useFiltered";
import { closeDialog, openDialog } from "../../../store/slices/uiSlice";

export const VerbList = ({ verbs, showFilters }) => {
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
  } = useFiltered(verbs, "verb", localStorage.getItem("verb_page") ?? 6);

  //Paginacion y data para mostrar

  const {
    currentPageData: currentVerbs,
    page,
    setPage,
    totalPages,
  } = usePagination(filteredItems, itemsPerPage);

  const { verbEditForm: openForm } = useSelector((state) => state.ui.dialogs);

  const {
    deleteVerbById,
    toggleFavoriteById,
    toggleIsLearnedById,
    isUpdating,
  } = useVerbStore();

  //Verbo a editar
  const [verbToEdit, setVerbToEdit] = useState(null);

  // Handles para editar, borrar, togle, etc

  const handleEdit = (verb) => {
    setVerbToEdit(verb);
    dispatch(openDialog("verbEditForm"));
  };

  const handleToggleFavorite = async (verb) => {
    await toggleFavoriteById(verb.id, verb);
  };

  const handleToggleIsLearned = async (verb) => {
    await toggleIsLearnedById(verb.id, verb);
  };

  const handleDelete = async (verb) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Vas a eliminar el verbo",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      await deleteVerbById(verb.id);
      Swal.fire({
        title: "Eliminado",
        text: "El verbo fue eliminado correctamente.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  useEffect(() => {
    if (!openForm) setVerbToEdit(null);
  }, [openForm]);

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Buscar verbo"
            size="small"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>
      </Box>
      <Collapse in={showFilters}>
        <Box sx={{ mb: 3 }}>
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
              <Tooltip title="Cantidad de verbos por página">
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
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Tipo"
                select
                size="small"
                fullWidth
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="regular">Regular</MenuItem>
                <MenuItem value="irregular">Irregular</MenuItem>
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
        <Grid container spacing={2}>
          {currentVerbs.map((verb) => (
            <Grid item key={verb.id} xs={12} sm={6} md={4} lg={3}>
              <VerbCard
                verb={verb}
                onEdit={() => handleEdit(verb)}
                onDelete={() => handleDelete(verb)}
                onToggleLearned={() => handleToggleIsLearned(verb)}
                onToggleFavorite={() => handleToggleFavorite(verb)}
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

        <VerbFormDialog
          open={openForm}
          onClose={() => dispatch(closeDialogalog("verbEditForm"))}
          initialData={verbToEdit}
        />
      </Box>
    </Box>
  );
};
