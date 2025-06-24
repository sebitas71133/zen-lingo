import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Slider,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { translatorApi } from "../../utils/translatorApi";
import { Controller, useForm } from "react-hook-form";

import { handleSpeak } from "../../utils/handleSpeak";

import {
  setIsLoading,
  setIsSuccess,
  setTranslatedText,
} from "../../store/slices/translatorSlice";
import { MicButton } from "../../home/components/MicButton";
import { useFavoriteStore } from "../../auth/hooks/useFavoriteStore";

const idiomas = [
  { name: "Inglés", code: "en-US" },
  { name: "Portugués", code: "pt-PT" }, // Para Brasil usa "pt-BR"
  { name: "Ruso", code: "ru-RU" },
  { name: "Español", code: "es-ES" }, // Para México usa "es-MX", para Perú "es-PE"
  { name: "Italiano", code: "it-IT" },
  { name: "Francés", code: "fr-FR" },
  { name: "Alemán", code: "de-DE" },
  { name: "Quechua", code: "quy" },
];

const situaciones = [
  "Redes sociales",
  "Académico",
  "Negocios",
  "Tecnologia",
  "Médico",
  "Legal",
  "Juegos",
  "Cine/TV",
];

const formalidad = ["Informal", "Neutro", "Formal"];

const variantes = ["Americano", "Britanico"];

const tipoDeInfo = [
  "Definición",
  "Ejemplos",
  "Sinónimos",
  "Antónimos",
  "Conjugaciones",
];

export const TranslatorPageUser = () => {
  const dispatch = useDispatch();
  const {
    // inputText,
    translatedText,

    isLoading,

    isSuccess,
  } = useSelector((state) => state.translator);

  const { saveFavorite } = useFavoriteStore();

  const {
    control,
    watch,
    register,
    handleSubmit,
    setValue,
    reset,

    formState: { errors },
  } = useForm();

  console.log("TranslatorApp render");

  const onSubmitForm = async (formData) => {
    console.log(formData);
    if (!formData.inputText) return;

    dispatch(setIsLoading(true));
    dispatch(setIsSuccess(false));
    try {
      const result = await translatorApi(
        formData.inputText,
        formData.targetLanguage,
        formData.formalityLevel,
        formData.translationType,
        formData.situation,
        formData.variant,
        formData.idiomatic,
        formData.infoType
      );

      console.log(result);

      dispatch(setTranslatedText(result));
    } catch (error) {
      console.error("Error en la traduccion: ", error);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const handleSpeechResult = (text) => {
    setValue("inputText", text);
  };

  useEffect(() => {
    setValue("translationType", "word");
  }, []);

  console.log("infoType:", watch("infoType"));
  return (
    <Container
      maxWidth="md"
      sx={{ mt: 4, color: "text.primary", minHeight: "100vh" }}
    >
      <Paper
        elevation={1}
        sx={{
          p: 3,

          // backgroundColor: "rgba(20, 20, 20, 0.7)",
          backgroundColor: "background.paper",
          backdropFilter: "blur(0.1px)",
          border: "2px solid",
          borderColor: "primary.main",
          boxShadow: "none",
          color: "text.primary",
          minHeight: "70vh",
        }}
      >
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Controller
              name="translationType"
              control={control}
              defaultValue="word"
              rules={{ required: "Please select a translation type" }}
              render={({ field }) => (
                <ToggleButtonGroup
                  value={field.value}
                  exclusive
                  onChange={(e, newValue) => field.onChange(newValue)}
                  aria-label="translation type"
                >
                  <ToggleButton
                    value="word"
                    color="secondary"
                    aria-label="word translation"
                  >
                    Palabra
                  </ToggleButton>
                  <ToggleButton
                    value="phrase"
                    color="secondary"
                    aria-label="phrase translation"
                  >
                    Frase
                  </ToggleButton>
                  <MicButton onResult={handleSpeechResult} />
                </ToggleButtonGroup>
              )}
            />
            {errors.translationType && <p>{errors.translationType.message}</p>}

            {/* INPUT TEXT */}
            <Controller
              name="inputText"
              control={control}
              defaultValue=""
              rules={{
                required: "Este campo es obligatorio",
                validate: (value) => {
                  const wordCount = value.trim().split(/\s+/).length; // Cuenta palabras

                  if (watch("translationType") === "word") {
                    if (wordCount < 1)
                      return "Debe ingresar al menos 1 palabra";
                    if (wordCount > 3) return "Máximo 3 palabras permitidas";
                  } else {
                    if (wordCount < 3)
                      return "Debe ingresar al menos 3 palabras";
                    if (wordCount > 100)
                      return "Máximo 100 palabras permitidas";
                  }

                  return true; // Válido
                },
              }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  multiline={watch("translationType") !== "word"} // Solo permite múltiples líneas en frases
                  rows={watch("translationType") !== "word" ? 4 : 1} // Una sola línea para palabras
                  variant="outlined"
                  label={
                    watch("translationType") === "word"
                      ? "Ingrese una palabra para traducir"
                      : "Ingrese un texto para traducir"
                  }
                  {...field}
                  error={!!errors.inputText}
                  helperText={errors.inputText?.message}
                />
              )}
            />
            {errors.inputText && <p>{errors.inputText?.message}</p>}
            {/* OPCIONES  */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" }, // Columna en móviles, fila en pantallas más grandes
                gap: 2,
                overflowX: { xs: "visible", sm: "auto" }, // Evita desplazamiento horizontal en móviles
                paddingBottom: 1,
                width: "100%", // Asegurar que el contenedor se adapte
                alignItems: "center",
                scrollbarWidth: "thin",
                scrollbarColor: "#888 transparent",
                "&::-webkit-scrollbar": { height: "6px" },
                "&::-webkit-scrollbar-track": { background: "transparent" },
                "&::-webkit-scrollbar-thumb": {
                  background: "#888",
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb:hover": { background: "#555" },
              }}
            >
              <Controller
                name="targetLanguage"
                control={control}
                defaultValue="en-US"
                rules={{ required: "Please select a language" }}
                render={({ field }) => (
                  <Select {...field} sx={{ minWidth: 120, width: "100%" }}>
                    {idiomas.map((idioma) => (
                      <MenuItem value={idioma.code} key={idioma.name}>
                        {idioma.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />

              {/* Select de variante */}
              {watch("targetLanguage") === "en-US" && (
                <Controller
                  name="variant"
                  control={control}
                  defaultValue="Americano"
                  rules={{ required: "Please select a variant" }}
                  render={({ field }) => (
                    <Select {...field} sx={{ minWidth: 120, width: "100%" }}>
                      {variantes.map((variante) => (
                        <MenuItem value={variante} key={variante}>
                          {variante}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              )}
              {errors.targetLanguage && <p>{errors.targetLanguage.message}</p>}
              {/* Select de nivel de formalidad */}
              {watch("translationType") !== "word" && (
                <Controller
                  name="formalityLevel"
                  control={control}
                  defaultValue="Neutro"
                  rules={{ required: "Please select a formalityLevel" }}
                  render={({ field }) => (
                    <Select {...field} sx={{ minWidth: 120, width: "100%" }}>
                      {formalidad.map((form) => (
                        <MenuItem value={form} key={form}>
                          {form}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              )}
              {watch("translationType") !== "word" && (
                <Controller
                  name="situation"
                  control={control}
                  defaultValue="Redes sociales"
                  rules={{ required: "Please select a situation" }}
                  render={({ field }) => (
                    <Select {...field} sx={{ minWidth: 120, width: "100%" }}>
                      {situaciones.map((sit) => (
                        <MenuItem value={sit} key={sit}>
                          {sit}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              )}
              {errors.situation && <p>{errors.situation.message}</p>}

              {errors.variant && <p>{errors.variant.message}</p>}
              {/* Select Idiomatic */}
              {watch("translationType") !== "word" && (
                <Controller
                  name="idiomatic"
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <Tooltip title="Activar o desactivar expresiones idiomáticas">
                      <FormControlLabel
                        control={
                          <Switch
                            {...field}
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            color="primary"
                          />
                        }
                        label="Idiomatic"
                      ></FormControlLabel>
                    </Tooltip>
                  )}
                />
              )}
              {watch("translationType") === "word" && (
                <Controller
                  name="infoType"
                  control={control}
                  defaultValue="Definición"
                  rules={{ required: "Seleccione un tipo de información" }}
                  render={({ field }) => (
                    <Select {...field} sx={{ minWidth: 120, width: "100%" }}>
                      {tipoDeInfo.map((tipo) => (
                        <MenuItem value={tipo} key={tipo}>
                          {tipo}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              )}
              {errors.infoType && <p>{errors.infoType.message}</p>}
            </Box>
            <Button
              variant="outlined"
              // onClick={handleTranslate}
              sx={{ flexGrow: 1 }}
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? "Traduciendo..." : "Traducir"}
            </Button>

            {watch("translationType") !== "word" && (
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                label="Traducción"
                value={translatedText}
                InputProps={{ readOnly: true }}
              />
            )}
            {/* ACORDEON */}
            {watch("translationType") === "word" && isSuccess && (
              <Accordion defaultExpanded={isSuccess}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography color="secondary">Resultados: </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {watch("infoType") === "Definición" && (
                    <TextField
                      fullWidth
                      multiline
                      rows={5}
                      variant="outlined"
                      //   label="Traducción"
                      value={translatedText}
                      InputProps={{ readOnly: true }}
                    />
                  )}
                  {watch("infoType") === "Ejemplos" && (
                    <List>
                      {Array.isArray(translatedText) &&
                        translatedText.map((example, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={example} />
                          </ListItem>
                        ))}
                    </List>
                  )}
                  {watch("infoType") === "Sinónimos" && (
                    <List>
                      {Array.isArray(translatedText) &&
                        translatedText.map((synonym, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={synonym} />
                          </ListItem>
                        ))}
                    </List>
                  )}
                  {watch("infoType") === "Antónimos" && (
                    <List>
                      {Array.isArray(translatedText) &&
                        translatedText.map((antonym, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={antonym} />
                          </ListItem>
                        ))}
                    </List>
                  )}
                  {watch("infoType") === "Conjugaciones" && (
                    <List>
                      {Array.isArray(translatedText) &&
                        translatedText.map((conjugaciones, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={conjugaciones} />
                          </ListItem>
                        ))}
                    </List>
                  )}
                </AccordionDetails>
              </Accordion>
            )}

            {/* BOTONES */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* <Button
                variant="outlined"
                startIcon={<VolumeUpIcon />}
                onClick={() =>
                  handleSpeak(translatedText, watch("targetLanguage"))
                }
              >
                Original
              </Button> */}
              <Button
                variant="outlined"
                startIcon={<VolumeUpIcon />}
                onClick={() =>
                  handleSpeak(translatedText, watch("targetLanguage"), watch)
                }
              >
                Escuchar
              </Button>
              <Controller
                name="rate"
                control={control}
                defaultValue={1}
                render={({ field }) => (
                  <Slider
                    {...field}
                    min={0.4}
                    max={1.5}
                    step={0.1}
                    value={field.value}
                    onChange={(_, value) => field.onChange(value)}
                    valueLabelDisplay="auto"
                    sx={{
                      width: "200px",
                      minWidth: "150px",
                    }}
                  />
                )}
              />
              <Button
                variant="outlined"
                startIcon={<FavoriteIcon />}
                sx={{ width: "180px" }}
                disabled={!translatedText}
                onClick={() => {
                  if (watch("translationType") === "word") {
                    saveFavorite(
                      "words",
                      `${watch("inputText")} : ${translatedText}`
                    );
                  } else {
                    saveFavorite(
                      "phrases",
                      `${watch("inputText")} : ${translatedText}`
                    );
                  }
                  dispatch(setTranslatedText(""));
                  // reset();
                }}
              >
                Guardar Favorito
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};
