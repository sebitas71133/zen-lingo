import { useSelector } from "react-redux";
import { Box, Pagination, Stack, Typography, Snackbar } from "@mui/material";
import { useState, useEffect } from "react";
import { WordCard } from "./WordCard";

import { WordFormDialog } from "./WordFormDialog";
import { useWordStore } from "../hooks/useWordStore";
import { SearchAndFilters } from "./SearchAndFilters";

export const WordList = () => {
  const words = useSelector((state) => state.word.words);
  console.log(words);
  const allTags = [...new Set(words.flatMap((w) => w.tags || []))];

  const [page, setPage] = useState(1);
  const itemsPerPage = 3;

  const [filters, setFilters] = useState({
    searchText: "",
    type: "",
    selectedTags: [],
    onlyLearned: false,
  });

  const filteredWords = words.filter((word) => {
    const matchesSearch =
      word.word?.toLowerCase().includes(filters.searchText.toLowerCase()) ||
      word.translation
        ?.toLowerCase()
        .includes(filters.searchText.toLowerCase());

    const matchesType =
      !filters.type || word.type?.toLowerCase() === filters.type.toLowerCase();

    const matchesTags =
      filters.selectedTags.length === 0 ||
      filters.selectedTags.every((tag) => word.tags?.includes(tag));

    const matchesLearned = !filters.onlyLearned || word.learned;

    return matchesSearch && matchesType && matchesTags && matchesLearned;
  });

  const totalPages = Math.ceil(filteredWords.length / itemsPerPage);
  const currentWords = filteredWords.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const { deleteWordById, createWord, updateWordById } = useWordStore();

  const [openForm, setOpenForm] = useState(false);
  const [wordToEdit, setWordToEdit] = useState(null);

  const handleEdit = (word) => {
    setWordToEdit(word);
    setOpenForm(true);
  };

  const handleDelete = async (word) => {
    if (confirm("¿Estás seguro de eliminar esta palabra?")) {
      await deleteWordById(word.id);
    }
  };

  const handleToggleLearned = (word) => {
    toggleLearnedStatus(word.id, word.isLearned);
  };
  // Reset form on close
  useEffect(() => {
    if (!openForm) setWordToEdit(null);
  }, [openForm]);

  if (!words.length) {
    return (
      <Typography variant="h6" sx={{ mt: 3, textAlign: "center" }}>
        No hay palabras guardadas todavía 😅
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <SearchAndFilters onChange={setFilters} allTags={allTags} />
      <Stack spacing={2}>
        {currentWords.map((word) => (
          <WordCard
            key={word.id}
            word={word}
            onEdit={() => handleEdit(word)}
            onDelete={() => handleDelete(word)}
            onToggleLearned={() => handleToggleLearned(word)}
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
