import {
  Box,
  Typography,
  Grid,
  Button,
  Paper,
  Stack,
  CircularProgress,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";
import FolderZipIcon from "@mui/icons-material/FolderZip";
import CodeIcon from "@mui/icons-material/Code";
import { useGetWordsQuery } from "../../services/wordApi";
import { useGetPhrasesQuery } from "../../services/phrasesApi";
import { useGetVerbsQuery } from "../../services/verbsApi";
import { useGetTextsQuery } from "../../services/textsApi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  exportAllToExcel,
  exportAllToJSON,
  exportAllToPDF,
} from "../utils/exportNotes";

export const ToolsPage = () => {
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

  if (loadingWords || loadingPhrases || loadingVerbs || loadingTexts) {
    return (
      <Stack alignItems="center" mt={4}>
        <CircularProgress />
        <Typography>Cargando dashboard...</Typography>
      </Stack>
    );
  }

  if (errorWords || errorPhrases || errorVerbs || errorTexts) {
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

  console.log({ words, phrases, verbs, texts });

  const handleExport = (type) => {
    switch (type) {
      case "json":
        exportAllToJSON({ words, phrases, verbs, texts });
        break;
      case "pdf":
        exportAllToPDF({ words, phrases, verbs, texts });
        break;
      case "excel":
        exportAllToExcel({ words, phrases, verbs, texts });
        break;

      default:
        break;
    }
  };
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tools
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Export your favorites in different formats
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          backgroundColor: "background.paper",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<CodeIcon />}
              onClick={() => handleExport("json")}
            >
              Export to JSON
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              color="error"
              fullWidth
              startIcon={<PictureAsPdfIcon />}
              onClick={() => handleExport("pdf")}
            >
              Export to PDF
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              color="success"
              fullWidth
              startIcon={<TableChartIcon />}
              onClick={() => handleExport("excel")}
            >
              Export to Excel
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};
