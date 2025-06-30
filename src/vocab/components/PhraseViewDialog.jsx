import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Chip,
  Stack,
  Box,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import TranslateIcon from "@mui/icons-material/Translate";
import CategoryIcon from "@mui/icons-material/Category";
import DescriptionIcon from "@mui/icons-material/Description";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import LabelIcon from "@mui/icons-material/Label";

const MotionBox = motion(Box);

export const PhraseViewDialog = ({ open, onClose, phraseData }) => {
  if (!phraseData) return null;

  const {
    phrase,
    translation,
    type,
    context,
    examples = [],
    tags = [],
  } = phraseData;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <MotionBox
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <DialogContent dividers>
          {/* Palabra y traducción */}
          <Box mb={3}>
            <Typography variant="h4" fontWeight="bold">
              {phrase}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1} mt={1}>
              <TranslateIcon fontSize="small" color="primary" />
              <Typography variant="subtitle1" color="text.secondary">
                {translation}
              </Typography>
            </Stack>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Tipo */}
          <Box mb={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <CategoryIcon fontSize="small" color="secondary" />
              <Typography variant="subtitle2" fontWeight="bold">
                Tipo
              </Typography>
            </Stack>
            <Typography sx={{ ml: 4 }}>{type}</Typography>
          </Box>

          {/* Definición */}
          {context && (
            <Box mb={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <DescriptionIcon fontSize="small" color="action" />
                <Typography variant="subtitle2" fontWeight="bold">
                  Definición
                </Typography>
              </Stack>
              <Typography sx={{ ml: 4 }}>{context}</Typography>
            </Box>
          )}

          {/* Ejemplos */}
          {examples.length > 0 && (
            <Box mb={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <FormatQuoteIcon fontSize="small" color="disabled" />
                <Typography variant="subtitle2" fontWeight="bold">
                  Ejemplos
                </Typography>
              </Stack>
              <Stack spacing={1} sx={{ ml: 4, mt: 1 }}>
                {examples.map((ex, idx) => (
                  <Typography
                    key={idx}
                    variant="body2"
                    sx={{ fontStyle: "italic" }}
                  >
                    “{ex}”
                  </Typography>
                ))}
              </Stack>
            </Box>
          )}

          {/* Etiquetas */}
          {tags.length > 0 && (
            <Box mb={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LabelIcon fontSize="small" />
                <Typography variant="subtitle2" fontWeight="bold">
                  Etiquetas
                </Typography>
              </Stack>
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                sx={{ ml: 4, mt: 1 }}
              >
                {tags.map((tag) => (
                  <Chip
                    key={tag.id}
                    label={tag.name}
                    size="small"
                    sx={{
                      backgroundColor: tag.color ? `${tag.color}22` : "#e0e0e0",
                      color: tag.color || "inherit",
                      border: `1px solid ${tag.color || "#ccc"}`,
                      textTransform: "capitalize",
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} variant="contained" color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </MotionBox>
    </Dialog>
  );
};
