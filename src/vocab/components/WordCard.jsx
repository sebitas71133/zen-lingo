import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
  Stack,
  Tooltip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export const WordCard = ({ word, onEdit, onDelete, onToggleLearned }) => {
  const {
    word: term,
    translation,
    type,
    definition,
    examples,
    tags = [],
    isLearned,
  } = word;

  console.log({ word });

  return (
    <Card
      variant="outlined"
      sx={{
        backgroundColor: isLearned ? "success.light" : "background.paper",
        borderColor: isLearned ? "success.main" : "primary.main",
        mb: 2,
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">
            {term} — <b>{translation}</b>
          </Typography>
          <Tooltip title={isLearned ? "Aprendida" : "Marcar como aprendida"}>
            <IconButton onClick={onToggleLearned}>
              <CheckCircleIcon color={isLearned ? "success" : "disabled"} />
            </IconButton>
          </Tooltip>
        </Stack>

        {type && (
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Tipo: {type}
          </Typography>
        )}

        {definition && (
          <Typography variant="body1" sx={{ mb: 1 }}>
            {definition}
          </Typography>
        )}

        {examples?.length > 0 && (
          <Typography variant="body2" sx={{ fontStyle: "italic" }}>
            Ejemplo: {examples[0]}
          </Typography>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <Stack direction="row" flexWrap="wrap" spacing={1} sx={{ mt: 1 }}>
            {tags.map((tag, i) => (
              <Chip key={i} label={tag} size="small" color="secondary" />
            ))}
          </Stack>
        )}
      </CardContent>

      <CardActions>
        <IconButton onClick={onEdit}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};
