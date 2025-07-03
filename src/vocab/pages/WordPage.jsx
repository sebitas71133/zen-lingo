import { WordFormDialog } from "../components/WordFormDialog";
import { useState } from "react";
import {
  CircularProgress,
  Collapse,
  Container,
  Fab,
  Pagination,
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
import { usePagination } from "../hooks/usePagination";

export const WordPage = () => {
  // const [openForm, setOpenForm] = useState(false);

  const [showFilters, setShowFilters] = useState(false);
  const dispatch = useDispatch();
  const { wordForm: openForm } = useSelector((state) => state.ui.dialogs);

  const filters = useSelector((state) => state.wordFilter);

  const { data: words = [], isLoading, isError } = useGetWordsQuery();

  const filteredWords = useFilteredWords(words, filters);

  // Paginacion

  const { itemsPerPage = 6 } = useSelector((state) => state.wordFilter);

  const {
    currentPageData: currentWords,
    page,
    setPage,
    totalPages,
  } = usePagination(filteredWords, itemsPerPage);

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
    <Container sx={{ mt: 5 }}>
      <Collapse in={showFilters}>
        <SearchAndFilters />
      </Collapse>

      {/* <SeedWords></SeedWords> */}
      {words.length === 0 ? (
        <Typography variant="h6" sx={{ mt: 3, textAlign: "center" }}>
          No hay palabras guardadas todavía 😅
        </Typography>
      ) : (
        <WordList words={currentWords} />
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

      {/* Páginacion */}

      {totalPages > 1 && (
        <Stack
          mt={4}
          alignItems="center"
          sx={{
            position: "fixed", // siempre visible
            bottom: 20, // separación desde el fondo
            left: 0,
            right: 0,
            zIndex: 1100, // sobre contenido
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Stack>
      )}
    </Container>
  );
};
