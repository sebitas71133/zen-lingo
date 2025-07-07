import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { useGetWordsQuery } from "../../services/wordApi";
import { useGetPhrasesQuery } from "../../services/phrasesApi";
import { useGetVerbsQuery } from "../../services/verbsApi";
import { useGetTextsQuery } from "../../services/textsApi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openDialog } from "../../store/slices/uiSlice";
import { useGetTagsQuery } from "../../services/tagsApi";

export const DashboardPage = () => {
  const {
    data: words = [],
    isLoading: loadingWords,
    isError: errorWords,
  } = useGetWordsQuery();
  const {
    data: phrases = [],
    isLoading: loadingPhrases,
    isError: errorPhrases,
  } = useGetPhrasesQuery();
  const {
    data: verbs = [],
    isLoading: loadingVerbs,
    isError: errorVerbs,
  } = useGetVerbsQuery();
  const {
    data: texts = [],
    isLoading: loadingTexts,
    isError: errorTexts,
  } = useGetTextsQuery();

  const {
    data: tags = [],
    isLoading: loadingTags,
    isError: errorTags,
  } = useGetTagsQuery();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (
    loadingWords ||
    loadingPhrases ||
    loadingVerbs ||
    loadingTexts ||
    loadingTags
  ) {
    return (
      <Stack alignItems="center" mt={4}>
        <CircularProgress />
        <Typography>Cargando dashboard...</Typography>
      </Stack>
    );
  }

  if (errorWords || errorPhrases || errorVerbs || errorTexts || errorTags) {
    return (
      <Typography
        variant="h6"
        color="error"
        sx={{ mt: 3, textAlign: "center" }}
      >
        Ocurrió un error al cargar los datos del dashboard 😢
      </Typography>
    );
  }

  // Ordenamos por fecha para obtener los más recientes
  const getLastItems = (items, key = "updatedAt", count = 3) =>
    [...items]
      .sort((a, b) => new Date(b[key]) - new Date(a[key]))
      .slice(0, count);

  const summary = [
    { label: "Textos", value: texts.length, emoji: "📚" },
    { label: "Frases", value: phrases.length, emoji: "💬" },
    { label: "Palabras", value: words.length, emoji: "🧠" },
    { label: "Verbos", value: verbs.length, emoji: "⚙️" },
    { label: "Tags", value: tags.length, emoji: "⚙️" },
  ];

  const latestTexts = getLastItems(texts);
  const latestWords = getLastItems(words);
  const latestPhrases = getLastItems(phrases);
  const latestVerbs = getLastItems(verbs);
  const latestTags = getLastItems(tags);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        📊 Dashboard
      </Typography>

      <Grid container spacing={3}>
        {summary.map(({ label, value, emoji }) => (
          <Grid item xs={12} sm={6} md={3} key={label}>
            <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h5">{emoji}</Typography>
              <Typography variant="subtitle1">{label}</Typography>
              <Typography variant="h4">{value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>
        Últimos añadidos
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <Typography variant="subtitle2">🧠 Palabras</Typography>
          <List dense>
            {latestWords.map((w) => (
              <ListItem key={w.id}>
                <ListItemText primary={w.word} secondary={w.definition} />
              </ListItem>
            ))}
          </List>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Typography variant="subtitle2">💬 Frases</Typography>
          <List dense>
            {latestPhrases.map((p) => (
              <ListItem key={p.id}>
                <ListItemText primary={p.phrase} secondary={p.translation} />
              </ListItem>
            ))}
          </List>
        </Grid>

        <Grid item xs={12} md={6} lg={2}>
          <Typography variant="subtitle2">⚙️ Verbos</Typography>
          <List dense>
            {latestVerbs.map((v) => (
              <ListItem key={v.id}>
                <ListItemText primary={v.verb} secondary={v.translation} />
              </ListItem>
            ))}
          </List>
        </Grid>

        <Grid item xs={12} md={6} lg={2}>
          <Typography variant="subtitle2">📚 Textos</Typography>
          <List dense>
            {latestTexts.map((t) => (
              <ListItem key={t.id}>
                <ListItemText primary={t.title} secondary={t.type} />
              </ListItem>
            ))}
          </List>
        </Grid>

        <Grid item xs={12} md={6} lg={2}>
          <Typography variant="subtitle2">📚 Tags</Typography>
          <List dense>
            {latestTags.map((t) => (
              <ListItem key={t.id}>
                <ListItemText primary={t.name} secondary={t.color} />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>
        Acciones rápidas
      </Typography>

      <Stack direction="row" spacing={2} flexWrap="wrap">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            navigate("/app/word");
            dispatch(openDialog("wordForm"));
          }}
        >
          ➕ Nueva palabra
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            navigate("/app/texts");
            dispatch(openDialog("textForm"));
          }}
        >
          ➕ Nuevo texto
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            navigate("/app/phrase");
            dispatch(openDialog("phraseForm"));
          }}
        >
          ➕ Nueva frase
        </Button>
        <Button
          variant="contained"
          color="warning"
          onClick={() => {
            navigate("/app/verbs");
            dispatch(openDialog("verbForm"));
          }}
        >
          ➕ Nuevo verbo
        </Button>
      </Stack>
    </Box>
  );
};
