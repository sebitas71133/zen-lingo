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

import {
  useAddTextMutation,
  useGetTextsQuery,
  useAddWordMutation,
  useGetWordsQuery,
  useAddVerbMutation,
  useGetVerbsQuery,
  useAddPhraseMutation,
  useGetPhrasesQuery,
  useAddTagMutation,
  useGetTagsQuery,
  useDeleteWordMutation,
  useDeletePhraseMutation,
  useDeleteVerbMutation,
  useDeleteTextMutation,
  useDeleteTagMutation,
} from "../../services";

import {
  exportAllToExcel,
  exportAllToJSON,
  exportAllToPDF,
} from "../utils/exportNotes";

import { toast } from "react-toastify";
import Swal from "sweetalert2";

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

  const {
    data: tags = [],
    isLoading: loadingTags,
    isError: errorTags,
  } = useGetTagsQuery();

  const [addWord] = useAddWordMutation();
  const [addPhrase] = useAddPhraseMutation();
  const [addVerb] = useAddVerbMutation();
  const [addText] = useAddTextMutation();
  const [addTag] = useAddTagMutation();

  const [deleteWord] = useDeleteWordMutation();
  const [deletePhrase] = useDeletePhraseMutation();
  const [deleteVerb] = useDeleteVerbMutation();
  const [deleteText] = useDeleteTextMutation();
  const [deleteTag] = useDeleteTagMutation();

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

  const handleExport = (type) => {
    switch (type) {
      case "json":
        exportAllToJSON({ words, phrases, verbs, texts, tags });
        break;
      case "pdf":
        exportAllToPDF({ words, phrases, verbs, texts, tags });
        break;
      case "excel":
        exportAllToExcel({ words, phrases, verbs, texts, tags });
        break;

      default:
        break;
    }
  };

  const handleImportJson = async (event, word = "all") => {
    const file = event.target.files?.[0];
    if (!file) return;

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Se importarán datos a tu aplicación. ¿Deseas continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, importar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) {
      toast.info("🚫 Importación cancelada");
      return;
    }

    const text = await file.text();

    try {
      const json = JSON.parse(text);
      const {
        palabras = [],
        frases = [],
        verbos = [],
        textos = [],
        etiquetas = [],
      } = json;

      if ((word === "words" || word === "all") && palabras.length) {
        for (const palabra of palabras) {
          const exists = words.some(
            (w) =>
              w.word.trim().toLowerCase() === palabra.word.trim().toLowerCase()
          );
          if (!exists) {
            const { id, ...rest } = palabra;
            await addWord(rest);
          }
        }
        toast.success("✅ Palabras importadas correctamente");
      }

      if ((word === "phrases" || word === "all") && frases.length) {
        for (const phrase of frases) {
          const exists = phrases.some(
            (p) =>
              p.phrase.trim().toLowerCase() ===
              phrase.phrase.trim().toLowerCase()
          );
          if (!exists) {
            const { id, ...rest } = phrase;
            await addPhrase(rest);
          }
        }
        toast.success("✅ Frases importadas correctamente");
      }

      if ((word === "verbs" || word === "all") && verbos.length) {
        for (const verb of verbos) {
          const exists = verbs.some(
            (v) =>
              v.verb.trim().toLowerCase() === verb.verb.trim().toLowerCase()
          );
          console.log(exists);
          if (!exists) {
            const { id, ...rest } = verb;
            await addVerb(rest);
          }
        }
        toast.success("✅ Verbos importados correctamente");
      }

      if ((word === "texts" || word === "all") && textos.length) {
        for (const text of textos) {
          const exists = texts.some(
            (t) =>
              t.title.trim().toLowerCase() === text.title.trim().toLowerCase()
          );
          if (!exists) {
            const { id, ...rest } = text;
            await addText(rest);
          }
        }
        toast.success("✅ Textos importados correctamente");
      }

      if ((word === "tags" || word === "all") && etiquetas.length) {
        for (const tag of etiquetas) {
          const exists = tags.some(
            (t) => t.name.trim().toLowerCase() === tag.name.trim().toLowerCase()
          );
          if (!exists) {
            const { id, ...rest } = tag;
            await addTag(rest);
          }
        }
        toast.success("✅ Etiquetas importadas correctamente");
      }

      toast.success("🎉 Importación completada");
    } catch (err) {
      console.error("Error al importar JSON:", err);
      toast.error("❌ Error al importar el archivo JSON");
    }
  };

  const handleResetAll = async () => {
    const result = await Swal.fire({
      title: "¿Estás absolutamente seguro?",
      html: `Esta acción <b>no se puede deshacer</b>. Escribe <code>BORRAR TODO</code> para confirmar.`,
      input: "text",
      inputPlaceholder: "Escribe BORRAR TODO",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar todo",
      cancelButtonText: "Cancelar",
      preConfirm: (value) => {
        if (value !== "BORRAR TODO") {
          Swal.showValidationMessage("Debes escribir exactamente: BORRAR TODO");
          return false;
        }
      },
    });

    if (result.isConfirmed) {
      try {
        await Promise.all(words.map((word) => deleteWord(word.id)));
        await Promise.all(phrases.map((phrase) => deletePhrase(phrase.id)));
        await Promise.all(texts.map((text) => deleteText(text.id)));
        await Promise.all(verbs.map((verb) => deleteVerb(verb.id)));
        await Promise.all(tags.map((tag) => deleteTag(tag.id)));

        toast.success("Colecciones reseteadas correctamente ✅");

        Swal.fire(
          "¡Eliminado!",
          "Todas las colecciones fueron borradas.",
          "success"
        );
      } catch (error) {
        console.error(error);
        toast.error("Error al resetear colecciones ❌");
      }
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

          {/* 🆕 Botón de reiniciar  */}
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              color="error"
              fullWidth
              component="span"
              startIcon={<FolderZipIcon />}
              onClick={handleResetAll}
            >
              Delete All
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, mt: 3 }}>
        Import your favorites
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
          {/* 🆕 Botón de importar JSON */}
          <Grid item xs={12} sm={6} md={3}>
            <input
              type="file"
              accept="application/json"
              onChange={(event) => handleImportJson(event, "all")}
              style={{ display: "none" }}
              id="upload-json"
            />
            <label htmlFor="upload-json">
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                component="span"
                startIcon={<FolderZipIcon />}
              >
                Import all data
              </Button>
            </label>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <input
              type="file"
              accept="application/json"
              onChange={(event) => handleImportJson(event, "words")}
              style={{ display: "none" }}
              id="upload-json"
            />
            <label htmlFor="upload-json">
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                component="span"
                startIcon={<FolderZipIcon />}
              >
                Import your words
              </Button>
            </label>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <input
              type="file"
              accept="application/json"
              onChange={(event) => handleImportJson(event, "phrases")}
              style={{ display: "none" }}
              id="upload-json"
            />
            <label htmlFor="upload-json">
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                component="span"
                startIcon={<FolderZipIcon />}
              >
                Import your phrases
              </Button>
            </label>
          </Grid>
          {/* 🆕 Botón de importar JSON */}
          <Grid item xs={12} sm={6} md={3}>
            <input
              type="file"
              accept="application/json"
              onChange={(event) => handleImportJson(event, "verbs")}
              style={{ display: "none" }}
              id="upload-json"
            />
            <label htmlFor="upload-json">
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                component="span"
                startIcon={<FolderZipIcon />}
              >
                Import your verbs
              </Button>
            </label>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <input
              type="file"
              accept="application/json"
              onChange={(event) => handleImportJson(event, "texts")}
              style={{ display: "none" }}
              id="upload-json"
            />
            <label htmlFor="upload-json">
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                component="span"
                startIcon={<FolderZipIcon />}
              >
                Import your texts
              </Button>
            </label>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <input
              type="file"
              accept="application/json"
              onChange={(event) => handleImportJson(event, "tags")}
              style={{ display: "none" }}
              id="upload-json"
            />
            <label htmlFor="upload-json">
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                component="span"
                startIcon={<FolderZipIcon />}
              >
                Import your tags
              </Button>
            </label>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};
