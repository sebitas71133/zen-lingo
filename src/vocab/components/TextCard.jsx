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
import { TextViewDialog } from "./TextViewDialog"; // crea este componente si aún no existe
import { textTypeColors } from "../utils/wordTypes";

export const TextCard = ({
  text,
  onEdit,
  onDelete,
  onToggleLearned,
  onToggleFavorite,
  isUpdating,
}) => {
  const {
    title,
    originalText,
    tags = [],
    isLearned,
    isFavorite,
    createdAt,
    updatedAt,
    type,
  } = text;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleOpen = (e) => {
    e.stopPropagation();
    setIsDialogOpen(true);
  };
  const handleClose = (e) => {
    e.stopPropagation();
    setIsDialogOpen(false);
  };

  const typeColor = textTypeColors[type] || "#64b5f6";

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
            sx={{ fontWeight: "bold", textTransform: "capitalize" }}
          >
            {title}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Tooltip title="Ver texto completo">
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

        {/* Contenido resumido */}
        <Typography
          variant="body2"
          sx={{
            mt: 1,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {originalText}
        </Typography>

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

      {/* Diálogo */}
      <TextViewDialog
        open={isDialogOpen}
        onClose={handleClose}
        textData={text}
      />
    </Card>
  );
};
