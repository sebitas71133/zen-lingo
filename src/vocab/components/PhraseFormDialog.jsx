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
import { useTagStore } from "../hooks/useTagStore";
import { usePhraseStore } from "../hooks/usePhraseStore";
import { Controller, useForm } from "react-hook-form";
import { motion } from "framer-motion";

const WORD_TYPES = ["phrases", "idioms "];
const DEFAULT_VALUES = {
  phrase: "",
  translation: "",
  type: "",
  context: "",
  examples: [],
  tags: [],
};

const MotionBox = motion(Box);

export const PhraseFormDialog = ({ open, onClose, initialData }) => {
  const theme = useTheme();

  // Estado local
  const [exampleInput, setExampleInput] = useState("");

  const { tags: allTags = [], isLoading: loadingTags } = useTagStore();

  const { createPhrase, updatePhraseById, isAdding, isUpdating } =
    usePhraseStore();

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
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
    console.log({ data });
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
            {initialData?.id ? "✏️ Editar frase" : "🆕 Nueva frase"}
          </DialogTitle>

          <DialogContent dividers>
            <Stack spacing={2}>
              {/* Frase */}
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
                    fullWidth
                    error={!!errors.translation}
                    helperText={errors.translation?.message}
                  />
                )}
              />

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

              {/* Ejemplos */}
              <Box>
                <Stack direction="row" spacing={1}>
                  <TextField
                    label="Ejemplo"
                    value={exampleInput}
                    onChange={(e) => setExampleInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddExample()}
                    fullWidth
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
                  {getValues("examples")?.map((ex, i) => (
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
                    loading={loadingTags}
                    value={field.value}
                    onChange={(_, v) => field.onChange(v)}
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
                              {params.InputProps.endAdornment}
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
