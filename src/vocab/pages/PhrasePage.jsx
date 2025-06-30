import {
  Box,
  Typography,
  Chip,
  Container,
  IconButton,
  Stack,
  Tooltip,
  Checkbox,
  Divider,
  CircularProgress,
  Fab,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import DoneIcon from "@mui/icons-material/Done";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import { usePhraseStore } from "../hooks/usePhraseStore";
import { useDispatch, useSelector } from "react-redux";
import { PhraseList } from "../components/PhraseList";
import { closeDialog, openDialog } from "../../store/slices/uiSlice";
import { PhraseFormDialog } from "../components/PhraseFormDialog";
import { useState } from "react";

export const PhrasePage = () => {
  const { phrases = [], isLoading, isError } = usePhraseStore();

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
    <Container maxWidth="md" sx={{ mt: 4 }}>
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
