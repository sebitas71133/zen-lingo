import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
  Stack,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export const WordCard = ({
  word,
  onEdit,
  onDelete,
  onToggleLearned,
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
            <IconButton disabled={isUpdating} onClick={onToggleLearned}>
              {isUpdating ? (
                <CircularProgress size={20} />
              ) : (
                <CheckCircleIcon color={isLearned ? "success" : "disabled"} />
              )}
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

        {examples.length > 0 && (
          <Typography variant="body2" sx={{ fontStyle: "italic" }}>
            Ejemplo: {examples[0]}
          </Typography>
        )}

        {tags.length > 0 && (
          <Stack direction="row" flexWrap="wrap" spacing={1} sx={{ mt: 1 }}>
            {tags.map((tag, i) => (
              <Chip
                key={tag.id}
                label={tag.name}
                size="small"
                color="secondary"
                variant="outlined"
              />
            ))}
          </Stack>
        )}
      </CardContent>

      <CardActions>
        <Tooltip title="Editar">
          <IconButton onClick={onEdit}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Eliminar">
          <IconButton onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};
