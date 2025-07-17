import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useTagStore } from "../../hooks/useTagStore";
import { usePhraseStore } from "../../hooks/usePhraseStore";
import { translatorApi } from "../../utils/gemini/translatorApi";
import { SpeakWord } from "../../../components/SpeakWord";

const WORD_TYPES = ["phrases", "idioms"];
const DEFAULT_VALUES = {
  phrase: "",
  translation: "",
  type: "",
  context: "",
  examples: [],
  flapping: "",
  spanish_pronunciation: "",
  tags: [],
};

const MotionBox = motion.create(Box);

export const PhraseFormDialog = ({ open, onClose, initialData }) => {
  const theme = useTheme();

  // Estado local
  const [exampleInput, setExampleInput] = useState("");

  //Para la llamada a gemini
  const [loading, setLoading] = useState(false);

  const { tags: allTags = [], isLoading: loadingTags } = useTagStore();

  const { createPhrase, updatePhraseById, isAdding, isUpdating } =
    usePhraseStore();

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: DEFAULT_VALUES,
  });

  // Carga de datos iniciales
  useEffect(() => {
    if (initialData) {
      reset({ ...DEFAULT_VALUES, ...initialData });
    } else {
      reset(DEFAULT_VALUES);
    }
  }, [initialData, reset]);

  // Agregar / eliminar ejemplos
  const handleAddExample = () => {
    const text = exampleInput.trim();
    if (!text) return;
    const exs = getValues("examples") || [];
    if (!exs.includes(text)) {
      setValue("examples", [...exs, text]);
    }
    setExampleInput("");
  };
  const handleRemoveExample = (idx) => {
    const exs = getValues("examples") || [];
    setValue(
      "examples",
      exs.filter((_, i) => i !== idx)
    );
  };

  // Envío
  const onSubmit = async (data) => {
    const payload = { ...data, updatedAt: new Date().toISOString() };
    if (initialData?.id) {
      await updatePhraseById(initialData.id, payload);
    } else {
      await createPhrase({
        ...payload,
        createdAt: new Date().toISOString(),
        isLearned: false,
        isFavorite: false,
      });
    }
    onClose();
    reset();
  };

  const handleAutoFill = async () => {
    const translation = getValues("phrase").trim();
    if (!translation) return;

    setLoading(true);
    try {
      // Llamada a API Gemini con tipo "phrase"
      const result = await translatorApi(translation, "phrase");

      console.log({ result });

      if (result) {
        // if (result.phrase) setValue("phrase", result.phrase);
        if (result.type)
          setValue(
            "type",
            result.type === "phrasal verb"
              ? "phrases"
              : result.type === "idiom"
              ? "idioms"
              : result.type
          );

        if (result.context) setValue("translation", result.translation);
        if (result.context) setValue("translation", result.context);
        if (result.flapping) setValue("flapping", result.flapping);
        if (result.spanish_pronunciation)
          setValue("spanish_pronunciation", result.spanish_pronunciation);
        if (result.examples && Array.isArray(result.examples)) {
          setValue("examples", result.examples);
          setExampleInput("");
        }
      }
    } catch (error) {
      console.error("Error al autocompletar con Gemini:", error);
    } finally {
      setLoading(false);
    }
  };

  const examples = watch("examples");

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <MotionBox
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Box
          sx={{
            backdropFilter: "blur(12px)",
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(0,0,0,0.6)"
                : "rgba(255,255,255,0.85)",
            borderRadius: 2,
          }}
        >
          <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
            {initialData?.id ? "✏️ Editar frase" : "🆕 Nueva frase"}
          </DialogTitle>

          <DialogContent dividers>
            <Stack spacing={2}>
              {/* Frase */}
              <Stack direction={"row"} spacing={1}>
                <Controller
                  name="phrase"
                  control={control}
                  rules={{ required: "Campo obligatorio" }}
                  fullWidth
                  multiline
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Frase o Idiomatica"
                      fullWidth
                      error={!!errors.phrase}
                      helperText={errors.phrase?.message}
                      multiline
                      maxRows={4}
                    />
                  )}
                />
                {watch("phrase") && (
                  <SpeakWord textToSpeak={watch("phrase")}></SpeakWord>
                )}
              </Stack>

              {/* Traduccion */}
              <Stack direction={"row"} spacing={1}>
                <Controller
                  name="translation"
                  control={control}
                  // rules={{ required: "Campo obligatorio" }}
                  fullWidth
                  multiline
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Traduccion de la Frase o Idiomatica (opcional)"
                      fullWidth
                      error={!!errors.translation}
                      helperText={errors.translation?.message}
                      multiline
                      maxRows={4}
                    />
                  )}
                />
              </Stack>

              {watch("phrase") && (
                <Button
                  variant="outlined"
                  onClick={handleAutoFill}
                  loading={loading}
                >
                  ✨ Autocompletar con IA
                </Button>
              )}

              {/* Tipo */}
              <Controller
                name="type"
                control={control}
                rules={{ required: "Selecciona un tipo" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Tipo"
                    fullWidth
                    error={!!errors.type}
                    helperText={errors.type?.message}
                  >
                    {WORD_TYPES.map((t) => (
                      <MenuItem key={t} value={t}>
                        {t}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              {/* Contexto */}
              <Stack direction={"row"} spacing={1}>
                <Controller
                  name="context"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Contexto/significado (opcional)"
                      fullWidth
                      multiline
                      rows={3}
                    />
                  )}
                />
                {watch("context") && (
                  <SpeakWord textToSpeak={watch("context")}></SpeakWord>
                )}
              </Stack>

              {/* flapping */}

              <Stack direction={"row"} spacing={1}>
                <Controller
                  name="flapping"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="flapping (opcional) - Puede contener errores"
                      fullWidth
                      multiline
                      rows={1}
                    />
                  )}
                />
                {/* {watch("flapping") && (
                  <SpeakWord textToSpeak={watch("flapping")}></SpeakWord>
                )} */}
              </Stack>

              {/* spanish pronunciantion */}

              <Stack direction={"row"} spacing={1}>
                <Controller
                  name="spanish_pronunciation"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Pronunciacio español (opcional) - Puede contener errores"
                      fullWidth
                      multiline
                      rows={1}
                    />
                  )}
                />
                {watch("spanish_pronunciation") && (
                  <SpeakWord
                    textToSpeak={watch("spanish_pronunciation")}
                  ></SpeakWord>
                )}
              </Stack>

              {/* Ejemplos */}
              <Box>
                <Stack direction="row" spacing={1}>
                  <TextField
                    label="Ejemplo"
                    value={exampleInput}
                    onChange={(e) => setExampleInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddExample()}
                    fullWidth
                    multiline
                    maxRows={4}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddExample}
                    disabled={!exampleInput.trim()}
                  >
                    + Añadir
                  </Button>
                </Stack>
                <Stack direction="row" flexWrap="wrap" spacing={1} mt={1}>
                  {examples?.map((ex, i) => (
                    <Chip
                      key={i}
                      label={ex}
                      onDelete={() => handleRemoveExample(i)}
                      sx={{
                        bgcolor: theme.palette.primary.light,
                        color: theme.palette.primary.contrastText,
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              {/* Tags */}
              {/* Tags */}
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    options={allTags}
                    getOptionLabel={(opt) => opt.name}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    filterSelectedOptions
                    loading={loadingTags}
                    value={field.value}
                    onChange={(_, newValue) => field.onChange(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Etiquetas"
                        placeholder="Selecciona..."
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingTags && <CircularProgress size={20} />}
                              {params.InputProps?.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                )}
              />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
            <Button
              onClick={() => {
                reset();
                onClose();
              }}
              disabled={isAdding || isUpdating}
              color="inherit"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              disabled={isAdding || isUpdating}
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: "#fff",
                px: 3,
                borderRadius: 1,
              }}
            >
              {initialData?.id ? "Actualizar" : "Crear"}
            </Button>
          </DialogActions>
        </Box>
      </MotionBox>
    </Dialog>
  );
};
