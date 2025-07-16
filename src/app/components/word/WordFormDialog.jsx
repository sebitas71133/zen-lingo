import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  Chip,
  Box,
  Autocomplete,
  CircularProgress,
  useTheme,
} from "@mui/material";

import { motion } from "framer-motion";
import { Controller, useForm } from "react-hook-form";
import { useTagStore } from "../../hooks/useTagStore";
import { useWordStore } from "../../hooks/useWordStore";
import { translatorApi } from "../../utils/gemini/translatorApi";
import { SpeakWord } from "../../../components/SpeakWord";
import { cleanedText } from "../../utils/cleanedText";

// CONSTANTES
const WORD_TYPES = ["sustantivo", "verbo", "adjetivo", "adverbio", "expresión"];
const DEFAULT_VALUES = {
  word: "",
  translation: "",
  type: "",
  definition: "",
  examples: [],
  tags: [],
  spokenForm: "", //Forma hablada
};

// Componente animado
const MotionBox = motion.create(Box);

export const WordFormDialog = ({ open, onClose, initialData }) => {
  const theme = useTheme();

  // Estado local
  const [exampleInput, setExampleInput] = useState("");

  //Para la llamada a gemini
  const [loading, setLoading] = useState(false);

  // Hooks de datos
  const { tags: allTags = [], isLoading: loadingTags } = useTagStore();
  const { createWord, updateWordById, isAdding, isUpdating } = useWordStore();

  // React Hook Form
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
      await updateWordById(initialData.id, payload);
    } else {
      await createWord({
        ...payload,
        createdAt: new Date().toISOString(),
        isLearned: false,
      });
    }
    onClose();
    reset();
  };

  const handleAutoFill = async () => {
    const translation = getValues("translation").trim();
    if (!translation) return;
    setLoading(true);
    try {
      // Llamada a API Gemini
      const result = await translatorApi(translation, "word");

      if (result) {
        if (result.word) setValue("word", result.word);
        if (result.spokenForm) setValue("spokenForm", result.spokenForm);
        if (result.type) setValue("type", result.type);
        if (result.definition) setValue("definition", result.definition);
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
            {initialData?.id ? "✏️ Editar palabra" : "🆕 Nueva palabra"}
          </DialogTitle>

          <DialogContent dividers>
            <Stack spacing={2}>
              {/* Traducción */}
              <Controller
                name="translation"
                control={control}
                rules={{
                  required: "Campo obligatorio",
                  maxLength: { value: 80, message: "Máximo 80 caracteres" },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Palabra en Español"
                    fullWidth
                    error={!!errors.translation}
                    helperText={errors.translation?.message}
                  />
                )}
              />

              {/* Boton para autocompletar con IA */}

              {watch("translation") && (
                <Button
                  variant="outlined"
                  onClick={handleAutoFill}
                  loading={loading}
                  // sx={{ alignSelf: "flex-start" }}
                >
                  ✨ Autocompletar con IA
                </Button>
              )}

              {/* Palabra */}

              <Stack direction={"row"} spacing={1} mt={1} alignItems={"center"}>
                <Controller
                  name="word"
                  control={control}
                  rules={{
                    required: "Campo obligatorio",
                    maxLength: { value: 80, message: "Máximo 80 caracteres" },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Palabra en Ingles"
                      fullWidth
                      error={!!errors.word}
                      helperText={errors.word?.message}
                      multiline
                      maxRows={4}
                    />
                  )}
                />

                {watch("word") && (
                  <SpeakWord textToSpeak={watch("word")}></SpeakWord>
                )}
              </Stack>

              {/* Forma Hablada */}

              <Stack direction={"row"} spacing={1} mt={1} alignItems={"center"}>
                <Controller
                  name="spokenForm"
                  control={control}
                  rules={{
                    maxLength: { value: 400, message: "Máximo 400 caracteres" },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Forma Hablada (Opcional)"
                      fullWidth
                      error={!!errors.spokenForm}
                      helperText={errors.spokenForm?.message}
                      multiline
                      maxRows={4}
                    />
                  )}
                />

                {watch("spokenForm") && (
                  <SpeakWord
                    textToSpeak={cleanedText(watch("spokenForm"))}
                  ></SpeakWord>
                )}
              </Stack>

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

              {/* Definición */}

              <Stack direction="row" alignItems="center" spacing={1} mt={1}>
                <Controller
                  name="definition"
                  control={control}
                  rules={{
                    maxLength: { value: 300, message: "Máximo 300 caracteres" },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Definición (opcional)"
                      fullWidth
                      multiline
                      rows={3}
                    />
                  )}
                />{" "}
                {watch("definition") && (
                  <SpeakWord textToSpeak={watch("definition")}></SpeakWord>
                )}
              </Stack>

              {/* <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                mt={1}
              ></Stack> */}

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
                    slotProps={{
                      input: {
                        maxLength: 150,
                      },
                    }}
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
                  {watch("examples")?.map((ex, i) => (
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
