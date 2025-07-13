import { Box, Grid, Pagination, Stack } from "@mui/material";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";

import { WordCard } from "./WordCard";
import { WordFormDialog } from "./WordFormDialog";
import { closeDialog, openDialog } from "../../../store/slices/uiSlice";

import { wordTypeColors } from "../../utils/wordTypes";
import { SearchAndFilters } from "../common/SearchAndFilters";

import { useFiltered, usePagination, useWordStore } from "../../hooks";

export const WordList = ({ words, showFilters = false }) => {
  const dispatch = useDispatch();

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
      <SearchAndFilters
        showFilters={showFilters}
        setSearch={setSearch}
        search={search}
        setSortBy={setSortBy}
        sortBy={sortBy}
        setOrder={setOrder}
        order={order}
        setItemsPerPage={setItemsPerPage}
        itemsPerPage={itemsPerPage}
        setType={setType}
        type={type}
        setSelectedTags={setSelectedTags}
        selectedTags={selectedTags}
        typeColors={wordTypeColors}
      ></SearchAndFilters>
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
