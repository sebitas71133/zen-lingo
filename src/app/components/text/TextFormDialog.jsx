import {
  Autocomplete,
  Box,
  Button,
  Chip,
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
import { useTextStore } from "../../hooks/useTextStore";
import { translatorApi } from "../../utils/gemini/translatorApi";

const TEXT_TYPES = [
  "cuento",
  "fábula",
  "leyenda",
  "poema",
  "frase",
  "pensamiento",
  "diálogo",
  "entrevista",
  "reflexión",
  "noticia",
  "reseña",
  "ensayo",
  "canción",
  "guion",
  "monólogo",
  "mensaje",
  "instrucción",
  "artículo",
  "parodia",
  "microcuento",
  "motivacional",
  "humorístico",
  "fantasía",
  "histórico",
  "otro",
];

const DEFAULT_VALUES = {
  title: "",
  originalText: "",
  translation: "",
  notes: "",
  tags: [],
  type: "",
};

const MotionBox = motion.create(Box);

export const TextFormDialog = ({ open, onClose, initialData }) => {
  const theme = useTheme();
  const { tags: allTags = [], isLoading: loadingTags } = useTagStore();
  const { createText, updateTextById, isAdding, isUpdating } = useTextStore();

  //Para la llamada a gemini
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: DEFAULT_VALUES });

  useEffect(() => {
    if (initialData) {
      reset({ ...DEFAULT_VALUES, ...initialData });
    } else {
      reset(DEFAULT_VALUES);
    }
  }, [initialData, reset]);

  const onSubmit = async (data) => {
    const payload = { ...data, updatedAt: new Date().toISOString() };
    if (initialData?.id) {
      await updateTextById(initialData.id, payload);
    } else {
      await createText({
        ...payload,
        createdAt: new Date().toISOString(),
      });
    }
    onClose();
  };

  const handleAutoFill = async () => {
    const title = getValues("title").trim();
    const type = getValues("type").trim();
    if (!title) return;

    setLoading(true);
    try {
      // Llamada a Gemini con el nuevo prompt
      const result = await translatorApi(title, "text", type);

      console.log({ result });

      if (result) {
        if (result.originalText) setValue("originalText", result.originalText);
        if (result.translation) setValue("translation", result.translation);
        if (result.notes) setValue("notes", result.notes);
      }
    } catch (error) {
      console.error("Error al autocompletar texto con Gemini:", error);
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
            {initialData?.id ? "✏️ Editar texto" : "📄 Nuevo texto"}
          </DialogTitle>

          <DialogContent dividers>
            <Stack spacing={2}>
              {/* Título */}
              <Controller
                name="title"
                control={control}
                rules={{ required: "Campo obligatorio" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Título"
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    multiline
                    maxRows={4}
                  />
                )}
              />

              {/* Tipo de texto */}
              <Controller
                name="type"
                control={control}
                rules={{ required: "Campo obligatorio" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Tipo de texto"
                    fullWidth
                    error={!!errors.type}
                    helperText={errors.type?.message}
                    multiline
                    maxRows={4}
                  >
                    {TEXT_TYPES.map((option) => (
                      <MenuItem
                        key={option}
                        value={option}
                        sx={{ textTransform: "capitalize" }}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              {watch("title") && (
                <Button
                  variant="outlined"
                  onClick={handleAutoFill}
                  loading={loading}
                  // sx={{ alignSelf: "flex-start" }}
                >
                  ✨ Autocompletar con IA
                </Button>
              )}

              {/* Texto original */}
              <Controller
                name="originalText"
                control={control}
                rules={{ required: "Campo obligatorio" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Texto en inglés"
                    multiline
                    minRows={10}
                    fullWidth
                    error={!!errors.originalText}
                    helperText={errors.originalText?.message}
                  />
                )}
              />

              {/* Traducción */}
              <Controller
                name="translation"
                control={control}
                rules={{ required: "Campo obligatorio" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Traducción"
                    multiline
                    minRows={10}
                    fullWidth
                    error={!!errors.translation}
                    helperText={errors.translation?.message}
                  />
                )}
              />

              {/* Notas */}
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Notas (opcional)"
                    multiline
                    minRows={3}
                    fullWidth
                  />
                )}
              />
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

          <DialogActions>
            <Button
              onClick={() => {
                reset();
                onClose();
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              disabled={isAdding || isUpdating}
            >
              Guardar
            </Button>
          </DialogActions>
        </Box>
      </MotionBox>
    </Dialog>
  );
};
