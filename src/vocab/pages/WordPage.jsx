import { WordFormDialog } from "../components/WordFormDialog";
import { useState } from "react";
import {
  CircularProgress,
  Container,
  Fab,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { WordList } from "../components/WordList";

import { SearchAndFilters } from "../components/SearchAndFilters";
import { useGetWordsQuery } from "../../services/wordApi";
import { useFilteredWords } from "../hooks/useFilteredWords";
import { useDispatch, useSelector } from "react-redux";
import { closeDialog, openDialog } from "../../store/slices/uiSlice";

export const WordPage = () => {
  // const [openForm, setOpenForm] = useState(false);

  const dispatch = useDispatch();
  const { wordForm: openForm } = useSelector((state) => state.ui.dialogs);

  const filters = useSelector((state) => state.wordFilter);

  const { data: words = [], isLoading, isError } = useGetWordsQuery();
  const filteredWords = useFilteredWords(words, filters);

  if (isLoading) {
    return (
      <Stack alignItems="center" mt={4}>
        <CircularProgress />
        <Typography>Cargando palabras...</Typography>
      </Stack>
    );
  }

  if (isError) {
    return (
      <Typography
        variant="h6"
        color="error"
        sx={{ mt: 3, textAlign: "center" }}
      >
        Ocurrió un error al cargar las palabras 😢
      </Typography>
    );
  }

  return (
    <Container>
      <SearchAndFilters />
      {words.length === 0 ? (
        <Typography variant="h6" sx={{ mt: 3, textAlign: "center" }}>
          No hay palabras guardadas todavía 😅
        </Typography>
      ) : (
        <WordList words={filteredWords} />
      )}

      {/* Boton para agregar nueva nota */}
      <Fab
        color="primary"
        onClick={() => dispatch(openDialog("wordForm"))}
        sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 100 }}
      >
        <AddIcon />
      </Fab>

      <WordFormDialog
        open={openForm}
        onClose={() => dispatch(closeDialog("wordForm"))}
        initialData={null}
      />
    </Container>
  );
};
