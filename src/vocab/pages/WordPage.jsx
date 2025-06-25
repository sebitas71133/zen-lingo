import { WordFormDialog } from "../components/WordFormDialog";
import { useEffect, useState } from "react";
import { Container, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { WordList } from "../components/WordList";

import { useSelector } from "react-redux";
import { SearchAndFilters } from "../components/SearchAndFilters";

export const WordPage = () => {
  const [openForm, setOpenForm] = useState(false);

  // const { loadWords } = useWordStore();
  // const { uid } = useSelector((state) => state.auth);
  // const { isLoading, error } = useSelector((state) => state.word);

  // useEffect(() => {
  //   if (uid) {
  //     loadWords();
  //   }
  // }, [uid]);

  return (
    <Container>
      <WordList />

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
