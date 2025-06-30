import { WordFormDialog } from "../components/WordFormDialog";
import { useState } from "react";
import {
  CircularProgress,
  Collapse,
  Container,
  Fab,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import { WordList } from "../components/WordList";

import { SearchAndFilters } from "../components/SearchAndFilters";
import { useGetWordsQuery } from "../../services/wordApi";
import { useFilteredWords } from "../hooks/useFilteredWords";
import { useDispatch, useSelector } from "react-redux";
import { closeDialog, openDialog } from "../../store/slices/uiSlice";
import { SeedWords } from "../../seed/SeedWords";

export const WordPage = () => {
  // const [openForm, setOpenForm] = useState(false);

  const [showFilters, setShowFilters] = useState(false);
  const dispatch = useDispatch();
  const { wordForm: openForm } = useSelector((state) => state.ui.dialogs);

  const filters = useSelector((state) => state.wordFilter);

  const { data: words = [], isLoading, isError } = useGetWordsQuery();
  const filteredWords = useFilteredWords(words, filters);

  console.log({ words });

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
      <Collapse in={showFilters}>
        <SearchAndFilters />
      </Collapse>

      {/* <SeedWords></SeedWords> */}
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

      <Fab
        color="secondary"
        onClick={() => setShowFilters(!showFilters)}
        sx={{
          position: "fixed",
          bottom: 94, // un poco más arriba que el botón de crear
          right: 24,
          zIndex: 100,
        }}
      >
        <FilterListIcon />
      </Fab>

      <WordFormDialog
        open={openForm}
        onClose={() => dispatch(closeDialog("wordForm"))}
        initialData={null}
      />
    </Container>
  );
};
