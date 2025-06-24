import { Box, Typography, Grid, Button, Paper } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";
import FolderZipIcon from "@mui/icons-material/FolderZip";
import CodeIcon from "@mui/icons-material/Code";

import {
  exportFavoritesToExcel,
  exportFavoritesToJSON,
  exportFavoritesToPDF,
} from "../../utils/exportNotes";
import { useSelector } from "react-redux";

export const ToolsPage = () => {
  const { favoriteWords, favoritePhrases, favoriteAnswers } = useSelector(
    (state) => state.translator
  );

  const handleExport = (type) => {
    switch (type) {
      case "json":
        exportFavoritesToJSON(favoriteWords, favoritePhrases, favoriteAnswers);
        break;
      case "pdf":
        exportFavoritesToPDF(favoriteWords, favoritePhrases, favoriteAnswers);
        break;
      case "excel":
        exportFavoritesToExcel(favoriteWords, favoritePhrases, favoriteAnswers);
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
