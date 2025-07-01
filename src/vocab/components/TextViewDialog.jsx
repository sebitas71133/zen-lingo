import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Stack,
  Chip,
  Divider,
} from "@mui/material";

export const TextViewDialog = ({ open, onClose, textData }) => {
  const {
    title,
    translation,
    originalText,

    tags = [],
  } = textData || {};

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        {originalText && (
          <>
            <Typography variant="body1" gutterBottom>
              {originalText}
            </Typography>
            <Divider sx={{ my: 2 }} />
          </>
        )}

        {translation && (
          <>
            <Typography variant="body1" gutterBottom>
              {translation}
            </Typography>
            <Divider sx={{ my: 2 }} />
          </>
        )}

        {tags.length > 0 && (
          <Stack direction="row" spacing={1} flexWrap="wrap">
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
      </DialogContent>
    </Dialog>
  );
};
