import { WordFormDialog } from "../components/WordFormDialog";
import { useEffect, useState } from "react";
import {
  CircularProgress,
  Container,
  Fab,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { WordList } from "../components/WordList";

import { useSelector } from "react-redux";
import { SearchAndFilters } from "../components/SearchAndFilters";
import { useGetWordsQuery } from "../../services/wordApi";

export const WordPage = () => {
  const [openForm, setOpenForm] = useState(false);

  const { data = [], isLoading, isError } = useGetWordsQuery();

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

  if (!data.length) {
    return (
      <Typography variant="h6" sx={{ mt: 3, textAlign: "center" }}>
        No hay palabras guardadas todavía 😅
      </Typography>
    );
  }

  return (
    <Container>
      <WordList words={data} />

      {/* Boton para agregar nueva nota */}
      <Fab
        color="primary"
        onClick={() => setOpenForm(true)}
        sx={{ position: "fixed", bottom: 24, right: 24 }}
      >
        <AddIcon />
      </Fab>

      <WordFormDialog open={openForm} onClose={() => setOpenForm(false)} />
    </Container>
  );
};
