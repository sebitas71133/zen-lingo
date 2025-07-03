import { Box, Grid, Pagination, Stack } from "@mui/material";
import { useState, useEffect } from "react";
import { WordCard } from "./WordCard";

import { WordFormDialog } from "./WordFormDialog";

import { useWordStore } from "../hooks/useWordStoreQuery";
import { usePagination } from "../hooks/usePagination";
import { useDispatch, useSelector } from "react-redux";
import { closeDialog, openDialog } from "../../store/slices/uiSlice";
import Swal from "sweetalert2";

export const WordList = ({ words }) => {
  // const itemsPerPage = 6;

  // const { itemsPerPage = 6 } = useSelector((state) => state.wordFilter);

  // const {
  //   currentPageData: currentWords,
  //   page,
  //   setPage,
  //   totalPages,
  // } = usePagination(words, itemsPerPage);

  const dispatch = useDispatch();
  const { wordEditForm: openForm } = useSelector((state) => state.ui.dialogs);

  const { deleteWordById, updateWordById, isUpdating } = useWordStore();

  // const [openForm, setOpenForm] = useState(false);
  const [wordToEdit, setWordToEdit] = useState(null);

  const handleEdit = (word) => {
    setWordToEdit(word);
    // setOpenForm(true);

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
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        {words.map((word) => (
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

      {/* {totalPages > 1 && (
        <Stack mt={4} alignItems="center">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Stack>
      )} */}

      <WordFormDialog
        open={openForm}
        onClose={() => dispatch(closeDialog("wordEditForm"))}
        initialData={wordToEdit}
      />
    </Box>
  );
};
