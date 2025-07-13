import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Swal from "sweetalert2";
import { Box, Grid, Pagination, Stack } from "@mui/material";

import { PhraseFormDialog } from "./PhraseFormDialog";
import { PhraseCard } from "./PhraseCard";

import { closeDialog, openDialog } from "../../../store/slices/uiSlice";

import { useFiltered, usePagination, usePhraseStore } from "../../hooks";

import { phraseTypeColors } from "../../utils/wordTypes";
import { SearchAndFilters } from "../common/SearchAndFilters";

export const PhraseList = ({ phrases, showFilters }) => {
  const dispatch = useDispatch();

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
      <SearchAndFilters
        showFilters={showFilters}
        setSearch={setSearch}
        search={search}
        setOrder={setOrder}
        order={order}
        setItemsPerPage={setItemsPerPage}
        itemsPerPage={itemsPerPage}
        setType={setType}
        type={type}
        setSelectedTags={setSelectedTags}
        selectedTags={selectedTags}
        typeColors={phraseTypeColors}
      ></SearchAndFilters>

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
