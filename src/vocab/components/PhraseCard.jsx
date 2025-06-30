import {
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { WordCardActions } from "./WordCardActions";

import { phraseTypeColors, wordTypeColors } from "../utils/wordTypes";

import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StarIcon from "@mui/icons-material/Star";
import { formattedDate } from "../utils/formatedDate";
import { PhraseViewDialog } from "./PhraseViewDialog";

export const PhraseCard = ({
  phrase,
  onEdit,
  onDelete,
  onToggleLearned,
  onToggleFavorite,
  isUpdating,
}) => {
  const {
    phrase: term,
    translation,
    type,
    context,
    examples = [],
    tags = [],
    isLearned,
    isFavorite,
    createdAt,
    updatedAt,
  } = phrase;

  console.log({ phrase });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpen = (e) => {
    e.stopPropagation();
    setIsDialogOpen(true);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setIsDialogOpen(false);
  };

  const typeColor = phraseTypeColors[type] || "#64b5f6";

  return (
    <Card
      variant="outlined"
      sx={{
        backgroundColor: isLearned ? "#2e7d3277" : `${typeColor}15`,
        borderColor: isLearned ? "#388e3c" : typeColor, // success.dark o tono más fuerte
        mb: 2,
        transition: "0.3s",
        boxShadow: `0 0 10px ${typeColor}30`,
        "&:hover": {
          boxShadow: `0 0 15px ${typeColor}55`,
        },
        borderLeft: `6px solid ${typeColor}`,
      }}
    >
      <CardContent>
        {/* Título + botones */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="h6"
            sx={{ textTransform: "capitalize", fontWeight: "bold" }}
          >
            {term} — <b>{translation}</b>
          </Typography>

          <Stack direction="row" alignItems="center" spacing={1} sx={{ mr: 3 }}>
            <Tooltip title="Ver detalles">
              <IconButton onClick={(e) => handleOpen(e)}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={isLearned ? "Aprendida" : "Marcar como aprendida"}>
              <IconButton
                disabled={isUpdating}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLearned();
                }}
              >
                {isUpdating ? (
                  <CircularProgress size={20} />
                ) : (
                  <CheckCircleIcon color={isLearned ? "success" : "disabled"} />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title={isFavorite ? "Favorito" : "Marcar como favorito"}>
              <IconButton
                disabled={isUpdating}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite();
                }}
              >
                {isUpdating ? (
                  <CircularProgress size={20} />
                ) : (
                  <StarIcon color={isFavorite ? "warning" : "disabled"} />
                )}
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {/* Metadatos */}
        <Stack direction="row" spacing={2} sx={{ mt: 1 }} flexWrap="wrap">
          {type && (
            <Typography variant="subtitle2" color="text.secondary">
              Tipo: <b>{type}</b>
            </Typography>
          )}
          {createdAt && (
            <Typography variant="caption" color="text.secondary">
              Actualizado el: {formattedDate(updatedAt)}
            </Typography>
          )}
        </Stack>

        {/* Definición */}
        {context && (
          <Typography variant="body1" sx={{ mt: 1 }}>
            {context}
          </Typography>
        )}

        {/* Ejemplo */}
        {examples.length > 0 && (
          <Typography variant="body2" sx={{ fontStyle: "italic", mt: 1 }}>
            Ejemplo: {examples[0]}
          </Typography>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <Stack direction="row" flexWrap="wrap" spacing={1} sx={{ mt: 2 }}>
            {tags.map((tag) => (
              <Chip
                key={tag.id}
                label={tag.name}
                size="small"
                variant="outlined"
                sx={{
                  color: tag.color,
                  borderColor: tag.color,
                  backgroundColor: `${tag.color}20`,
                  textTransform: "capitalize",
                }}
              />
            ))}
          </Stack>
        )}
      </CardContent>

      {/* Acciones (Editar / Eliminar) */}
      <WordCardActions onEdit={onEdit} onDelete={onDelete} />

      <PhraseViewDialog
        open={isDialogOpen}
        onClose={(e) => handleClose(e)}
        phraseData={phrase}
      ></PhraseViewDialog>
    </Card>
  );
};
