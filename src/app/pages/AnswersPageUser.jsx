import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  MenuItem,
  Select,
  Container,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  setGeneratedAnswer,
  setIsLoading,
  setIsSuccess,
} from "../../store/slices/translatorSlice";
import { generateChatResponse } from "../../utils/answerApi";
import { useFavoriteStore } from "../../auth/hooks/useFavoriteStore";

export const AnswersPageUser = () => {
  const dispatch = useDispatch();
  const { generatedAnswer, isLoading } = useSelector(
    (state) => state.translator
  );

  const { saveFavorite } = useFavoriteStore();

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      textInput: "",
      answerTone: "neutral",
      responseStyle: "casual",
      responseLength: "medium",
      enthusiasmLevel: "medium",
      conversationContext: "friendly",
      responseFormat: "text",
    },
  });

  const handleGenerateAnswer = async (formData) => {
    if (!formData.textInput) return;

    dispatch(setIsLoading(true));
    dispatch(setIsSuccess(false));

    try {
      const answer = await generateChatResponse(
        formData.textInput,
        formData.answerTone,
        formData.responseStyle,
        formData.responseLength,
        formData.enthusiasmLevel,
        formData.conversationContext,
        formData.responseFormat,
        formData.temperature
      );
      console.log(answer);

      dispatch(setGeneratedAnswer(answer));
    } catch (error) {
      console.error("Error en la traduccion: ", error);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{ mt: 4, color: "text.primary", minHeight: "100vh" }}
    >
      <Paper
        elevation={1}
        sx={{
          p: 3,
          mt: 4,
          backgroundColor: "background.paper",
          backdropFilter: "blur(0.1px)",
          border: "2px solid",
          borderColor: "primary.main",
          boxShadow: "none",

          color: "text.primary",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Generador de Respuestas para Conversaciones en Ingles
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(handleGenerateAnswer)}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* Campo de entrada de texto */}
          <Controller
            name="textInput"
            control={control}
            rules={{
              required: "Ingrese un mensaje",
              validate: (value) => {
                if (!value.trim()) {
                  return "El mensaje no puede estar vacío";
                }
                if (value.trim().split(" ").length < 3) {
                  return "El mensaje parece demasiado corto para generar una respuesta.";
                }
                return true;
              },
              maxLength: 500,
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                variant="outlined"
                label="Ingrese un texto"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          {/* Tono de la respuesta */}
          <FormControl component="fieldset">
            <FormLabel component="legend">Tono de la Respuesta</FormLabel>
            <Controller
              name="answerTone"
              control={control}
              render={({ field }) => (
                <RadioGroup row {...field}>
                  <FormControlLabel
                    value="positive"
                    control={<Radio />}
                    label="Positivo"
                  />
                  <FormControlLabel
                    value="neutral"
                    control={<Radio />}
                    label="Neutral"
                  />
                  <FormControlLabel
                    value="negative"
                    control={<Radio />}
                    label="Negativo"
                  />
                </RadioGroup>
              )}
            />
          </FormControl>

          {/* Estilo de respuesta */}
          <FormControl fullWidth>
            <FormLabel>Estilo de la Respuesta</FormLabel>
            <Controller
              name="responseStyle"
              control={control}
              defaultValue="casual"
              render={({ field }) => (
                <Select {...field}>
                  <MenuItem value="formal">Formal</MenuItem>
                  <MenuItem value="casual">Casual</MenuItem>
                  <MenuItem value="funny">Divertido</MenuItem>
                  <MenuItem value="sarcastic">Sarcástico</MenuItem>
                </Select>
              )}
            />
          </FormControl>

          {/* Longitud de respuesta */}
          <FormControl fullWidth>
            <FormLabel>Longitud de la Respuesta</FormLabel>
            <Controller
              name="responseLength"
              control={control}
              render={({ field }) => (
                <Select {...field}>
                  <MenuItem value="short">Corta</MenuItem>
                  <MenuItem value="medium">Mediana</MenuItem>
                  <MenuItem value="detailed">Detallada</MenuItem>
                </Select>
              )}
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel>Creatividad (Temperature)</FormLabel>
            <Controller
              name="temperature"
              control={control}
              defaultValue={0.5}
              render={({ field }) => (
                <Select {...field}>
                  <MenuItem value={0.2}>Preciso (0.2)</MenuItem>
                  <MenuItem value={0.5}>Balanceado (0.5)</MenuItem>
                  <MenuItem value={0.9}>Creativo (0.9)</MenuItem>
                  <MenuItem value={1.2}>Muy Creativo (1.2)</MenuItem>
                </Select>
              )}
            />
          </FormControl>

          {/* Nivel de entusiasmo */}
          <FormControl fullWidth>
            <FormLabel>Nivel de Entusiasmo</FormLabel>
            <Controller
              name="enthusiasmLevel"
              control={control}
              render={({ field }) => (
                <Select {...field}>
                  <MenuItem value="low">Bajo</MenuItem>
                  <MenuItem value="medium">Medio</MenuItem>
                  <MenuItem value="high">Alto</MenuItem>
                </Select>
              )}
            />
          </FormControl>

          {/* Contexto de la conversación */}
          <FormControl fullWidth>
            <FormLabel>Contexto de la Conversación</FormLabel>
            <Controller
              name="conversationContext"
              control={control}
              render={({ field }) => (
                <Select {...field}>
                  <MenuItem value="friendly">Amistosa</MenuItem>
                  <MenuItem value="work">Trabajo</MenuItem>
                  <MenuItem value="socialMedia">Redes Sociales</MenuItem>
                </Select>
              )}
            />
          </FormControl>

          {/* Formato de respuesta */}
          <FormControl fullWidth>
            <FormLabel>Formato de la Respuesta</FormLabel>
            <Controller
              name="responseFormat"
              control={control}
              render={({ field }) => (
                <Select {...field}>
                  <MenuItem value="text">Texto</MenuItem>
                  <MenuItem value="list">Lista</MenuItem>
                  <MenuItem value="emoji">Emojis incluidos</MenuItem>
                </Select>
              )}
            />
          </FormControl>

          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? "generando..." : "Generar Respuesta"}
          </Button>

          <TextField
            fullWidth
            multiline
            minRows={4}
            maxRows={10}
            variant="outlined"
            label="Respuesta Generada"
            value={generatedAnswer}
            InputProps={{ readOnly: true }}
          />

          <Button
            variant="outlined"
            startIcon={<FavoriteIcon />}
            onClick={() => {
              saveFavorite(
                "answers",
                `${watch("textInput")} : ${generatedAnswer}`
              );
              dispatch(setGeneratedAnswer(""));
            }}
            disabled={!generatedAnswer}
          >
            Guardar Respuesta Favorita
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
