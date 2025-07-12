import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Stack,
  Chip,
  Box,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import TranslateIcon from "@mui/icons-material/Translate";
import CategoryIcon from "@mui/icons-material/Category";

import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { SpeakWord } from "../../../components/SpeakWord";

export const VerbViewDialog = ({ open, onClose, verbData }) => {
  const {
    conjugations = {},
    translation,
    type,
    context,
    examples = [],
    tags = [],
    verb,
  } = verbData || {};

  console.log({ verbData });

  const { base, thirdPerson, past, pastParticiple, presentParticiple, future } =
    conjugations;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1} mt={1}>
          <TranslateIcon fontSize="small" color="primary" />
          <Typography variant="h6" fontWeight="bold">
            {verb} — {translation}
          </Typography>
          <SpeakWord textToSpeak={verb}></SpeakWord>
        </Stack>
        <Stack direction={"row"} alignItems={"center"} spacing={1} mt={1}>
          <CategoryIcon fontSize="small" color="secondary" />
          <Typography
            variant="subtitle2"
            color="text.secondary"
            textTransform="capitalize"
          >
            Tipo: {type}
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        {/* Conjugaciones */}
        {(base ||
          thirdPerson ||
          past ||
          pastParticiple ||
          presentParticiple ||
          future?.simple ||
          future?.goingTo ||
          conjugations?.modals) && (
          <Box mb={3}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <FormatQuoteIcon fontSize="small" color="disabled" />
              <Typography variant="subtitle1" gutterBottom color="primary">
                Conjugaciones
              </Typography>
            </Stack>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <b>Base:</b> {base || "—"}
                  <SpeakWord textToSpeak={base}></SpeakWord>
                </Typography>
                <Typography variant="body2">
                  <b>Tercera persona:</b> {thirdPerson || "—"}
                  <SpeakWord textToSpeak={thirdPerson}></SpeakWord>
                </Typography>
                <Typography variant="body2">
                  <b>Pasado:</b> {past || "—"}
                  <SpeakWord textToSpeak={past}></SpeakWord>
                </Typography>
                <Typography variant="body2">
                  <b>Participio pasado:</b> {pastParticiple || "—"}
                  <SpeakWord textToSpeak={pastParticiple}></SpeakWord>
                </Typography>
                <Typography variant="body2">
                  <b>Gerundio:</b> {presentParticiple || "—"}
                  <SpeakWord textToSpeak={presentParticiple}></SpeakWord>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <b>Futuro simple (will):</b> {future?.simple || "—"}
                  <SpeakWord textToSpeak={future?.simple}></SpeakWord>
                </Typography>
                <Typography variant="body2">
                  <b>Futuro going to:</b> {future?.goingTo || "—"}
                  <SpeakWord textToSpeak={future?.goingTo}></SpeakWord>
                </Typography>
                <Typography variant="body2">
                  <b>Can:</b> {conjugations?.modals?.can || "—"}
                  <SpeakWord
                    textToSpeak={conjugations?.modals?.can}
                  ></SpeakWord>
                </Typography>
                <Typography variant="body2">
                  <b>Could:</b> {conjugations?.modals?.could || "—"}
                  <SpeakWord
                    textToSpeak={conjugations?.modals?.could}
                  ></SpeakWord>
                </Typography>
                <Typography variant="body2">
                  <b>Would:</b> {conjugations?.modals?.would || "—"}
                  <SpeakWord
                    textToSpeak={conjugations?.modals?.would}
                  ></SpeakWord>
                </Typography>
                <Typography variant="body2">
                  <b>Should:</b> {conjugations?.modals?.should || "—"}
                  <SpeakWord
                    textToSpeak={conjugations?.modals?.should}
                  ></SpeakWord>
                </Typography>
                <Typography variant="body2">
                  <b>Might:</b> {conjugations?.modals?.might || "—"}
                  <SpeakWord
                    textToSpeak={conjugations?.modals?.might}
                  ></SpeakWord>
                </Typography>
                <Typography variant="body2">
                  <b>Must:</b> {conjugations?.modals?.must || "—"}
                  <SpeakWord
                    textToSpeak={conjugations?.modals?.must}
                  ></SpeakWord>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Contexto */}
        {/* {context && (
          <Box mb={3}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <DescriptionIcon fontSize="small" color="action" />
              <Typography variant="subtitle1" gutterBottom color="primary">
                Contexto
              </Typography>
            </Stack>
            <Typography variant="body2">{context}</Typography>
          </Box>
        )} */}

        {/* Ejemplos */}
        {examples.length > 0 && (
          <Box mb={3}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <FormatQuoteIcon fontSize="small" color="disabled" />
              <Typography variant="subtitle1" gutterBottom color="primary">
                Ejemplos
              </Typography>
            </Stack>
            <List dense>
              {examples.map((ex, i) => (
                <ListItem key={i} sx={{ pl: 0 }}>
                  <ListItemIcon sx={{ minWidth: "24px" }}>
                    <Typography variant="body2">•</Typography>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2">
                        {ex} <SpeakWord textToSpeak={ex}></SpeakWord>
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom color="primary">
              Etiquetas
            </Typography>
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
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};
