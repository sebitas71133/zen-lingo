import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeDialog, openDialog } from "../../store/slices/uiSlice";
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
import { usePagination } from "../hooks/usePagination";
import { useTextStore } from "../hooks/useTextStore";
import { TextCard } from "./TextCard";
import { TextFormDialog } from "./TextFormDialog";
import { useTagStore } from "../hooks/useTagStore";

import { useFiltered } from "../hooks/useFiltered";

export const TextList = ({ texts, showFilters }) => {
  const dispatch = useDispatch();

  // Obtener tags
  const { tags = [], isLoading } = useTagStore();

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
  } = useFiltered(texts, "title", localStorage.getItem("text_page") ?? 6);

  const {
    currentPageData: currentTexts,
    page,
    setPage,
    totalPages,
  } = usePagination(filteredItems, itemsPerPage);

  const { textEditForm: openForm } = useSelector((state) => state.ui.dialogs);

  const { deleteTextById, toggleFavoriteById, toggleIsReadById, isUpdating } =
    useTextStore();

  const [textToEdit, setTextToEdit] = useState(null);

  const handleEdit = (text) => {
    setTextToEdit(text);
    dispatch(openDialog("textEditForm"));
  };

  const handleToggleFavorite = async (text) => {
    await toggleFavoriteById(text.id, text);
  };

  const handleToggleIsRead = async (text) => {
    await toggleIsReadById(text.id, text);
  };

  const handleDelete = async (text) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Vas a eliminar el texto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      await deleteTextById(text.id);
      Swal.fire({
        title: "Eliminado",
        text: "El texto fue eliminado correctamente.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  useEffect(() => {
    if (!openForm) setTextToEdit(null);
  }, [openForm]);

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Buscar texto"
            size="small"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
              <Tooltip title="Cantidad de textos por página">
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
                size="small"
                fullWidth
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="poema">poema</MenuItem>
                <MenuItem value="cuento">cuento</MenuItem>
                <MenuItem value="frase">frase</MenuItem>
                <MenuItem value="diálogo">diálogo</MenuItem>
                <MenuItem value="otro">otro</MenuItem>
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
        {currentTexts.map((text) => (
          <Grid item key={text.id} xs={12} sm={6} md={4} lg={3}>
            <TextCard
              text={text}
              onEdit={() => handleEdit(text)}
              onDelete={() => handleDelete(text)}
              onToggleRead={() => handleToggleIsRead(text)}
              onToggleFavorite={() => handleToggleFavorite(text)}
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

      <TextFormDialog
        open={openForm}
        onClose={() => dispatch(closeDialog("textEditForm"))}
        initialData={textToEdit}
      />
    </Box>
  );
};
