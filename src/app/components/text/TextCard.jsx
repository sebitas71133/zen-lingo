import {
  Box,
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

import { textTypeColors } from "../../utils/wordTypes";

import { TextViewDialog } from "./TextViewDialog";
import { formattedDate } from "../../utils/formatedDate";
import { WordCardActions } from "../common/WordCardActions";

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

  const typeColor = textTypeColors[type] || "#64b5f6";

  return (
    <Card
      variant="outlined"
      sx={{
        backgroundColor: isLearned ? "#2e7d3277" : `${typeColor}15`,
        borderColor: isLearned ? "#388e3c" : typeColor,
        mb: 2,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderLeft: `6px solid ${typeColor}`,
        boxShadow: `0 0 10px ${typeColor}30`,
        transition: "0.3s",
        "&:hover": {
          boxShadow: `0 0 15px ${typeColor}55`,
          scale: "1.03",
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        {/* Título */}
        <Typography
          variant="h6"
          sx={{
            textTransform: "capitalize",
            fontWeight: "bold",
            whiteSpace: "break-word",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={title}
        >
          {title}
        </Typography>

        {/* Acciones */}
        <Box mt={1} mb={1}>
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Ver texto completo">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDialogOpen(true);
                }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title={isLearned ? "Aprendido" : "Marcar como aprendido"}>
              <IconButton
                size="small"
                disabled={isUpdating}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLearned();
                }}
              >
                {isUpdating ? (
                  <CircularProgress size={16} />
                ) : (
                  <CheckCircleIcon
                    color={isLearned ? "success" : "disabled"}
                    fontSize="small"
                  />
                )}
              </IconButton>
            </Tooltip>

            <Tooltip title={isFavorite ? "Favorito" : "Marcar como favorito"}>
              <IconButton
                size="small"
                disabled={isUpdating}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite();
                }}
              >
                {isUpdating ? (
                  <CircularProgress size={16} />
                ) : (
                  <StarIcon
                    color={isFavorite ? "warning" : "disabled"}
                    fontSize="small"
                  />
                )}
              </IconButton>
            </Tooltip>

            <WordCardActions
              onEdit={onEdit}
              onDelete={onDelete}
              data={[text]}
              nameData={"texts"}
              size="small"
            />
          </Stack>
        </Box>

        {/* Contenido */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 1,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "break-word",
          }}
        >
          {originalText || "—"}
        </Typography>

        {/* Footer: Tags + Metadata */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
          flexWrap="wrap"
          rowGap={1}
        >
          <Stack direction="row" spacing={0.5} flexWrap="wrap">
            {tags.map((tag) => (
              <Chip
                key={tag.id}
                label={tag.name}
                size="small"
                sx={{
                  color: tag.color,
                  borderColor: tag.color,
                  backgroundColor: `${tag.color}20`,
                  textTransform: "capitalize",
                  height: 24,
                }}
              />
            ))}
          </Stack>
          {(type || updatedAt) && (
            <Typography variant="caption" color="text.secondary">
              {type && <b>{type}</b>} {type && updatedAt && " • "}
              {updatedAt && `Actualizado el: ${formattedDate(updatedAt)}`}
            </Typography>
          )}
        </Stack>
      </CardContent>

      <TextViewDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        textData={text}
      />
    </Card>
  );
};
