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

import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StarIcon from "@mui/icons-material/Star";

import { formattedDate } from "../utils/formatedDate";
import { WordCardActions } from "./WordCardActions";
import { verbTypeColors } from "../utils/wordTypes";
import { VerbViewDialog } from "./VerbViewDialog";

export const VerbCard = ({
  verb,
  onEdit,
  onDelete,
  onToggleLearned,
  onToggleFavorite,
  isUpdating,
}) => {
  const {
    verb: base,
    past,
    participle,
    translation,
    type,

    examples = [],
    tags = [],
    isLearned,
    isFavorite,
    createdAt,
    updatedAt,
  } = verb;

  console.log({ verb });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleOpen = (e) => {
    e.stopPropagation();
    setIsDialogOpen(true);
  };
  const handleClose = (e) => {
    e.stopPropagation();
    setIsDialogOpen(false);
  };

  const typeColor = verbTypeColors[type] || "#64b5f6";

  return (
    <Card
      variant="outlined"
      sx={{
        backgroundColor: isLearned ? "#2e7d3277" : `${typeColor}15`,
        borderColor: isLearned ? "#388e3c" : typeColor,
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
            {base} — <b>{translation}</b>
          </Typography>

          <Stack direction="row" alignItems="center" spacing={1} sx={{ mr: 3 }}>
            <Tooltip title="Ver detalles">
              <IconButton onClick={handleOpen}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={isLearned ? "Aprendido" : "Marcar como aprendido"}>
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
            {/* Acciones */}
            <WordCardActions onEdit={onEdit} onDelete={onDelete} />
          </Stack>
        </Stack>

        {/* Metadatos */}
        <Stack direction="row" spacing={2} sx={{ mt: 1 }} flexWrap="wrap">
          {type && (
            <Typography variant="subtitle2" color="text.secondary">
              Tipo: <b>{type}</b>
            </Typography>
          )}
          {updatedAt && (
            <Typography variant="caption" color="text.secondary">
              Actualizado el: {formattedDate(updatedAt)}
            </Typography>
          )}
        </Stack>

        {/* Formas */}
        <Typography variant="body2" sx={{ mt: 1 }}>
          <b>Pasado:</b> {past} | <b>Participio:</b> {participle}
        </Typography>

        {/* Ejemplo */}
        {examples.length > 0 && (
          <Typography
            variant="body2"
            sx={{
              fontStyle: "italic",
              mt: 1,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
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

      {/* Dialogo */}
      <VerbViewDialog
        open={isDialogOpen}
        onClose={handleClose}
        verbData={verb}
      />
    </Card>
  );
};
