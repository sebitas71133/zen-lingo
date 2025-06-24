import {
  Box,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Pagination,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useFavoriteStore } from "../../auth/hooks/useFavoriteStore";
import { usePagination } from "../../auth/hooks/usePagination";

export const FavoritesPageUser = () => {
  const { favoriteWords, favoritePhrases, favoriteAnswers } = useSelector(
    (state) => state.translator
  );

  const {
    page: pageWords,
    setPage: setPageWords,
    totalPages: totalPagesWords,
    currentPageData: paginatedWords,
  } = usePagination(favoriteWords, 5);

  const {
    page: pagePhrases,
    setPage: setPagePhrases,
    totalPages: totalPagesPhrases,
    currentPageData: paginatedPhrases,
  } = usePagination(favoritePhrases, 5);

  const {
    page: pageAnswers,
    setPage: setPageAnswers,
    totalPages: totalPagesAnswers,
    currentPageData: paginatedAnswers,
  } = usePagination(favoriteAnswers, 5);

  const { uid } = useSelector((state) => state.auth);

  console.log({ uid });

  const { loadFavorites, deleteFavorite } = useFavoriteStore();
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (uid) {
      loadFavorites();
    }
  }, [uid]);

  const handleDelete = (type, value) => {
    deleteFavorite(type, value);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, minHeight: "100vh" }}>
      <Paper
        elevation={1}
        sx={{
          p: 3,
          backgroundColor: "background.paper",
          border: "2px solid",
          borderColor: "primary.main",
          boxShadow: "none",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Mis Favoritos
        </Typography>

        <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
          <Tab label="Palabras" />
          <Tab label="Frases" />
          <Tab label="Respuestas" />
        </Tabs>

        {/* Lista de palabras */}
        {tab === 0 && (
          <>
            <List>
              {paginatedWords.length === 0 ? (
                <Typography>No hay palabras guardadas.</Typography>
              ) : (
                paginatedWords.map((word, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton onClick={() => handleDelete("words", word)}>
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={word} />
                  </ListItem>
                ))
              )}
            </List>
            <Stack spacing={2} mt={2} alignItems="center">
              <Pagination
                count={totalPagesWords}
                page={pageWords}
                onChange={(_, value) => setPageWords(value)}
              />
            </Stack>
          </>
        )}

        {/* Lista de frases */}
        {tab === 1 && (
          <>
            <List>
              {paginatedPhrases.length === 0 ? (
                <Typography>No hay frases guardadas.</Typography>
              ) : (
                paginatedPhrases.map((phrase, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton
                        onClick={() => handleDelete("phrases", phrase)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={phrase} />
                  </ListItem>
                ))
              )}
            </List>
            <Stack spacing={2} mt={2} alignItems="center">
              <Pagination
                count={totalPagesPhrases}
                page={pagePhrases}
                onChange={(_, value) => setPagePhrases(value)}
              />
            </Stack>
          </>
        )}

        {/* Lista de respuestas */}
        {tab === 2 && (
          <>
            <List>
              {favoriteAnswers.length === 0 ? (
                <Typography variant="body1" sx={{ mt: 2 }}>
                  No hay respuestas guardadas.
                </Typography>
              ) : (
                paginatedAnswers.map((answer, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton
                        onClick={() => handleDelete("answers", answer)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={answer} />
                  </ListItem>
                ))
              )}
            </List>
            <Stack spacing={2} mt={2} alignItems="center">
              <Pagination
                count={totalPagesAnswers}
                page={pageAnswers}
                onChange={(_, value) => setPageAnswers(value)}
              />
            </Stack>
          </>
        )}
      </Paper>
    </Container>
  );
};
