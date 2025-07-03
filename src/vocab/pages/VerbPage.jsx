import {
  Typography,
  Container,
  Stack,
  CircularProgress,
  Fab,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";

import { useVerbStore } from "../hooks/useVerbStore";
import { useDispatch, useSelector } from "react-redux";
import { closeDialog, openDialog } from "../../store/slices/uiSlice";
import { useState } from "react";

import { VerbList } from "../components/VerbList";
import { VerbFormDialog } from "../components/VerbFormDialog.jsx";

export const VerbPage = () => {
  const { verbs = [], isLoading, isError } = useVerbStore();

  const dispatch = useDispatch();
  const { verbForm: openForm } = useSelector((state) => state.ui.dialogs);

  const [showFilters, setShowFilters] = useState(false);

  if (isLoading) {
    return (
      <Stack alignItems="center" mt={4}>
        <CircularProgress />
        <Typography>Cargando verbos...</Typography>
      </Stack>
    );
  }

  console.log({ verbs });

  if (isError) {
    return (
      <Typography
        variant="h6"
        color="error"
        sx={{ mt: 3, textAlign: "center" }}
      >
        Ocurrió un error al cargar los verbos 😢
      </Typography>
    );
  }

  return (
    <Container sx={{ mt: 5 }}>
      {verbs.length === 0 ? (
        <Typography variant="h6" sx={{ mt: 3, textAlign: "center" }}>
          No hay verbos guardados todavía 😅
        </Typography>
      ) : (
        <VerbList verbs={verbs} showFilters={showFilters} />
      )}

      {/* Botón para agregar nuevo verbo */}
      <Fab
        color="primary"
        onClick={() => dispatch(openDialog("verbForm"))}
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

      <VerbFormDialog
        open={openForm}
        onClose={() => dispatch(closeDialog("verbForm"))}
        initialData={null}
      />
    </Container>
  );
};
