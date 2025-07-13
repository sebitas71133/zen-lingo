import {
  Typography,
  Container,
  Stack,
  CircularProgress,
  Fab,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { closeDialog, openDialog } from "../../store/slices/uiSlice";

import { usePhraseStore } from "../hooks";
import { PhraseList, PhraseFormDialog } from "../components";

export const PhrasePage = () => {
  const { phrases = [], isLoading, isError } = usePhraseStore();

  console.log({ phrases });

  const dispatch = useDispatch();
  const { phraseForm: openForm } = useSelector((state) => state.ui.dialogs);

  const [showFilters, setShowFilters] = useState(false);

  if (isLoading) {
    return (
      <Stack alignItems="center" mt={4}>
        <CircularProgress />
        <Typography>Cargando frases...</Typography>
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
        Ocurrió un error al cargar las frases 😢
      </Typography>
    );
  }

  return (
    <Container sx={{ mt: 5 }}>
      {phrases.length === 0 ? (
        <Typography variant="h6" sx={{ mt: 3, textAlign: "center" }}>
          No hay palabras guardadas todavía 😅
        </Typography>
      ) : (
        <PhraseList
          phrases={phrases}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
      )}

      {/* Boton para agregar nueva frase */}

      <Fab
        color="primary"
        onClick={() => dispatch(openDialog("phraseForm"))}
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

      <PhraseFormDialog
        open={openForm}
        onClose={() => dispatch(closeDialog("phraseForm"))}
        initialData={null}
      />
    </Container>
  );
};
