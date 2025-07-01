import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeDialog, openDialog } from "../../store/slices/uiSlice";
import Swal from "sweetalert2";
import {
  Box,
  Collapse,
  Grid,
  MenuItem,
  Pagination,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { usePagination } from "../hooks/usePagination";
import { useVerbStore } from "../hooks/useVerbStore";
import { VerbCard } from "./VerbCard";
import { VerbFormDialog } from "./VerbFormDialog";

export const VerbList = ({ verbs, showFilters }) => {
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [type, setType] = useState("");

  let filtered = [...verbs];

  if (search) {
    filtered = filtered.filter((v) =>
      v.verb.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (type) {
    filtered = filtered.filter(
      (v) => v.type?.toLowerCase() === type.toLowerCase()
    );
  }

  if (order) {
    filtered.sort((a, b) =>
      order === "asc"
        ? a.verb.localeCompare(b.verb)
        : b.verb.localeCompare(a.verb)
    );
  }

  const dispatch = useDispatch();
  const {
    currentPageData: currentVerbs,
    page,
    setPage,
    totalPages,
  } = usePagination(filtered, itemsPerPage);

  const { verbEditForm: openForm } = useSelector((state) => state.ui.dialogs);

  const {
    deleteVerbById,
    toggleFavoriteById,
    toggleIsLearnedById,
    isUpdating,
  } = useVerbStore();

  const [verbToEdit, setVerbToEdit] = useState(null);

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
    <Box sx={{ mt: 3 }} fullWidth>
      <Collapse in={showFilters}>
        <Box sx={{ mb: 5 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Buscar verbo"
                size="small"
                fullWidth
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
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
                <MenuItem value="regular">Regular</MenuItem>
                <MenuItem value="irregular">Irregular</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Box>
      </Collapse>

      <Grid container spacing={2}>
        {currentVerbs.map((verb) => (
          <Grid item key={verb.id} xs={12} sm={6}>
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
        onClose={() => dispatch(closeDialog("verbEditForm"))}
        initialData={verbToEdit}
      />
    </Box>
  );
};
