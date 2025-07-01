import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Stack,
  Chip,
  Divider,
} from "@mui/material";

export const VerbViewDialog = ({ open, onClose, verbData }) => {
  const {
    conjugations = {},
    translation,
    type,
    context,
    examples = [],
    tags = [],
  } = verbData || {};

  const { base, thirdPerson, past, pastParticiple, presentParticiple, future } =
    conjugations;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {base} — {translation}
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1" gutterBottom>
          Tipo: {type}
        </Typography>

        {(base ||
          thirdPerson ||
          past ||
          pastParticiple ||
          presentParticiple ||
          future?.simple ||
          future?.goingTo ||
          conjugations?.modals) && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2">Conjugaciones:</Typography>
            <Typography variant="body2">
              <b>Base:</b> {base || "—"} <br />
              <b>Tercera persona:</b> {thirdPerson || "—"} <br />
              <b>Pasado:</b> {past || "—"} <br />
              <b>Participio pasado:</b> {pastParticiple || "—"} <br />
              <b>Gerundio:</b> {presentParticiple || "—"} <br />
              <b>Futuro simple (will):</b> {future?.simple || "—"} <br />
              <b>Futuro going to:</b> {future?.goingTo || "—"} <br />
              <b>Can:</b> {conjugations?.modals?.can || "—"} <br />
              <b>Could:</b> {conjugations?.modals?.could || "—"} <br />
              <b>Would:</b> {conjugations?.modals?.would || "—"} <br />
              <b>Should:</b> {conjugations?.modals?.should || "—"} <br />
              <b>Might:</b> {conjugations?.modals?.might || "—"} <br />
              <b>Must:</b> {conjugations?.modals?.must || "—"}
            </Typography>
          </>
        )}

        {context && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1">{context}</Typography>
          </>
        )}

        {examples.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2">Ejemplos:</Typography>
            <ul>
              {examples.map((ex, i) => (
                <li key={i}>
                  <Typography variant="body2">{ex}</Typography>
                </li>
              ))}
            </ul>
          </>
        )}

        {tags.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
