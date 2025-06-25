import { Box, Pagination, Stack } from "@mui/material";
import { useState, useEffect } from "react";
import { WordCard } from "./WordCard";

import { WordFormDialog } from "./WordFormDialog";

import { useWordStore } from "../hooks/useWordStoreQuery";
import { usePagination } from "../hooks/usePagination";

export const WordList = ({ words }) => {
  const itemsPerPage = 5;

  const {
    currentPageData: currentWords,
    page,
    setPage,
    totalPages,
  } = usePagination(words, itemsPerPage);

  const { deleteWordById, updateWordById, isUpdating } = useWordStore();

  const [openForm, setOpenForm] = useState(false);
  const [wordToEdit, setWordToEdit] = useState(null);

  const handleEdit = (word) => {
    setWordToEdit(word);
    setOpenForm(true);
  };

  const handleDelete = async (word) => {
    if (confirm("¿Estás seguro de eliminar esta palabra?")) {
      console.log({ word });
      await deleteWordById(word.id);
    }
  };

  const handleToggleLearned = async (word) => {
    console.log({ word });
    try {
      await updateWordById(word.id, {
        ...word,
        isLearned: !word.isLearned, // alterna el estado
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
      <Stack spacing={2}>
        {currentWords.map((word) => (
          <WordCard
            key={word.id}
            word={word}
            onEdit={() => handleEdit(word)}
            onDelete={() => handleDelete(word)}
            onToggleLearned={() => handleToggleLearned(word)}
            isUpdating={isUpdating}
          />
        ))}
      </Stack>

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
        onClose={() => setOpenForm(false)}
        initialData={wordToEdit}
      />
    </Box>
  );
};
