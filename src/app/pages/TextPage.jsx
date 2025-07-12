import {
  Typography,
  Container,
  Stack,
  CircularProgress,
  Fab,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import { useTextStore } from "../hooks/useTextStore";
import { closeDialog, openDialog } from "../../store/slices/uiSlice";
import { TextList } from "../components/text/TextList";
import { TextFormDialog } from "../components/text/TextFormDialog";

export const TextPage = () => {
  const dispatch = useDispatch();
  const { textForm: openForm } = useSelector((state) => state.ui.dialogs);

  const { texts = [], isLoading, isError } = useTextStore();
  const [showFilters, setShowFilters] = useState(false);

  if (isLoading) {
    return (
      <Stack alignItems="center" mt={4}>
        <CircularProgress />
        <Typography>Cargando textos...</Typography>
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
        Ocurrió un error al cargar los textos 😢
      </Typography>
    );
  }

  return (
    <Container sx={{ mt: 5 }}>
      {texts.length === 0 ? (
        <Typography variant="h6" sx={{ mt: 3, textAlign: "center" }}>
          No hay textos guardados todavía 😅
        </Typography>
      ) : (
        <TextList texts={texts} showFilters={showFilters} />
      )}

      {/* Botón para agregar nuevo texto */}
      <Fab
        color="primary"
        onClick={() => dispatch(openDialog("textForm"))}
        sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 100 }}
      >
        <AddIcon />
      </Fab>

      <Fab
        color="secondary"
        onClick={() => setShowFilters(!showFilters)}
        sx={{
          position: "fixed",
          bottom: 94,
          right: 24,
          zIndex: 100,
        }}
      >
        <FilterListIcon />
      </Fab>

      <TextFormDialog
        open={openForm}
        onClose={() => dispatch(closeDialog("textForm"))}
        initialData={null}
      />
    </Container>
  );
};
