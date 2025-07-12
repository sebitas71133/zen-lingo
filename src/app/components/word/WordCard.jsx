import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Stack,
  Tooltip,
  CircularProgress,
  Box,
  Grid,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StarIcon from "@mui/icons-material/Star";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { WordViewDialog } from "./WordViewDialog";
import { wordTypeColors } from "../../utils/wordTypes";
import { formattedDate } from "../../utils/formatedDate";
import { WordCardActions } from "../WordCardActions";

export const WordCard = ({
  word,
  onEdit,
  onDelete,
  onToggleLearned,
  onToggleFavorite,
  isUpdating,
}) => {
  const {
    word: term,
    translation,
    type,
    definition,
    examples = [],
    tags = [],
    isLearned,
    isFavorite,
    updatedAt,
  } = word;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const typeColor = wordTypeColors[type] || "#64b5f6";

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
        {/* First Row: Title */}
        <Typography
          variant="h6"
          sx={{
            textTransform: "capitalize",
            fontWeight: "bold",
            whiteSpace: "break-word",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={`${term} — ${translation}`}
        >
          {term} — {translation}
        </Typography>

        {/* Second Row: Actions */}
        <Box mt={1} mb={1}>
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Ver detalles">
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
            <Tooltip title={isLearned ? "Aprendida" : "Marcar como aprendida"}>
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
            <WordCardActions onEdit={onEdit} onDelete={onDelete} size="small" />
          </Stack>
        </Box>

        {/* Body */}
        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {definition || examples[0] || "—"}
          </Typography>
        </Box>

        {/* Footer */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
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
          {updatedAt && (
            <Typography variant="caption" color="text.secondary">
              {formattedDate(updatedAt)}
            </Typography>
          )}
        </Stack>
      </CardContent>

      {/* Dialog */}
      <WordViewDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        wordData={word}
      />
    </Card>
  );
};
