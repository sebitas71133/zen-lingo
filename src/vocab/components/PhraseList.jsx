import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePhraseStore } from "../hooks/usePhraseStore";
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
import { WordFormDialog } from "./WordFormDialog";
import { PhraseCard } from "./PhraseCard";
import { PhraseFormDialog } from "./PhraseFormDialog";

export const PhraseList = ({ phrases, showFilters, setShowFilters }) => {
  const [searchName, setSearchName] = useState("");

  const [order, setOrder] = useState("asc");

  const [itemsPerPage, setItemsPerPage] = useState(6);

  //   const [showFilters, setShowFilters] = useState(false);

  let filtered = [...phrases];

  if (searchName) {
    filtered = filtered.filter((phrase) =>
      phrase.phrase.toLowerCase().includes(searchName.toLowerCase())
    );
  }

  if (order) {
    filtered.sort((a, b) =>
      order === "asc"
        ? a.phrase.localeCompare(b.phrase)
        : b.phrase.localeCompare(a.phrase)
    );
  }

  const dispatch = useDispatch();

  const {
    currentPageData: currentPhrases,
    page,
    setPage,
    totalPages,
  } = usePagination(filtered, itemsPerPage);

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
    // setOpenForm(true);

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

  // Reset form on close
  useEffect(() => {
    if (!openForm) setWordToEdit(null);
  }, [openForm]);

  return (
    <Box sx={{ mt: 3 }}>
      {/* FILTERS */}
      <Collapse in={showFilters}>
        <Box sx={{ mb: 5 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Buscar"
                size="small"
                fullWidth
                variant="outlined"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              ></TextField>
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
          </Grid>
        </Box>
      </Collapse>

      {/* LISTA DE PHRASES */}
      <Grid container spacing={2}>
        {currentPhrases.map((word) => (
          <Grid
            item
            key={word.id}
            xs={12} // 1 por fila en móviles
            sm={6} // 2 por fila en pantallas ≥600px
          >
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
  );
};
